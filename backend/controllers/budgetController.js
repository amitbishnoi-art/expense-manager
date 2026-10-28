const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Create or update the budget for a category (upsert)
// @route   POST /api/budgets
// @access  Private
const setBudget = asyncHandler(async (req, res) => {
  const { category, monthlyLimit, alertThreshold } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category },
    { monthlyLimit, alertThreshold, user: req.user._id, category },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json({ success: true, budget });
});

// @desc    Get all budgets with current-month spend progress
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const budgets = await Budget.find({ user: req.user._id }).sort({ category: 1 });

  const spendByCategory = await Expense.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
        category: { $in: budgets.map((b) => b.category) },
      },
    },
    { $group: { _id: '$category', spent: { $sum: '$amount' } } },
  ]);

  const spendMap = spendByCategory.reduce((acc, s) => ({ ...acc, [s._id]: s.spent }), {});

  const result = budgets.map((b) => {
    const spent = spendMap[b.category] || 0;
    const percentUsed = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
    return {
      _id: b._id,
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      alertThreshold: b.alertThreshold,
      spent,
      remaining: Math.max(b.monthlyLimit - spent, 0),
      percentUsed,
      status: percentUsed >= 100 ? 'exceeded' : percentUsed >= b.alertThreshold ? 'warning' : 'ok',
    };
  });

  res.json({ success: true, budgets: result });
});

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  res.json({ success: true, message: 'Budget deleted' });
});

module.exports = { setBudget, getBudgets, deleteBudget };
