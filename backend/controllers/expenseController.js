const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// @desc    Create a new expense/income entry
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, expense });
});

// @desc    Get all expenses for logged in user, with filters, search, sort, pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    search,
    minAmount,
    maxAmount,
    sortBy = 'date',
    order = 'desc',
    page = 1,
    limit = 20,
  } = req.query;

  const query = { user: req.user._id };

  if (type) query.type = type;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortField = ['date', 'amount', 'title', 'category', 'createdAt'].includes(sortBy) ? sortBy : 'date';

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum),
    Expense.countDocuments(query),
  ]);

  res.json({
    success: true,
    expenses,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ success: true, expense });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  Object.assign(expense, req.body);
  expense = await expense.save();

  res.json({ success: true, expense });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ success: true, message: 'Expense deleted' });
});

// @desc    Dashboard statistics: totals, category breakdown, monthly trend
// @route   GET /api/expenses/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [currentMonthTotals, categoryBreakdown, monthlyTrend, recentTransactions, allTimeTotals] =
    await Promise.all([
      // Current month income vs expense totals
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),

      // Category breakdown for current month (expenses only) - powers the pie chart
      Expense.aggregate([
        {
          $match: {
            user: userId,
            type: 'expense',
            date: { $gte: startOfMonth, $lt: startOfNextMonth },
          },
        },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      // Last 12 months income vs expense - powers bar/line charts
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      // 8 most recent transactions
      Expense.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(8),

      // All-time totals for net balance
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
    ]);

  const toTotalsObject = (arr) =>
    arr.reduce((acc, item) => ({ ...acc, [item._id]: item.total }), { income: 0, expense: 0 });

  // Build a stable 12-month series (fills months with zero data)
  const monthLabels = [];
  const trendMap = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthLabels.push({ key, year: d.getFullYear(), month: d.getMonth() + 1 });
    trendMap[key] = { income: 0, expense: 0 };
  }
  monthlyTrend.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    if (trendMap[key]) trendMap[key][item._id.type] = item.total;
  });
  const trend = monthLabels.map((m) => ({
    label: new Date(m.year, m.month - 1, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
    income: trendMap[m.key].income,
    expense: trendMap[m.key].expense,
  }));

  res.json({
    success: true,
    currentMonth: toTotalsObject(currentMonthTotals),
    allTime: toTotalsObject(allTimeTotals),
    categoryBreakdown: categoryBreakdown.map((c) => ({ category: c._id, total: c.total, count: c.count })),
    trend,
    recentTransactions,
  });
});

// @desc    Export all expenses as CSV
// @route   GET /api/expenses/export
// @access  Private
const exportExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

  const header = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Notes', 'Tags'];
  const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const rows = expenses.map((e) =>
    [
      e.date.toISOString().split('T')[0],
      e.type,
      e.title,
      e.category,
      e.amount,
      e.paymentMethod,
      e.notes || '',
      (e.tags || []).join('; '),
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csv = [header.map(escapeCsv).join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses-export.csv"');
  res.send(csv);
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getStats,
  exportExpenses,
};
