const express = require('express');
const { body, query } = require('express-validator');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getStats,
  exportExpenses,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  RECURRING_FREQUENCIES,
} = require('../utils/constants');

const router = express.Router();

router.use(protect); // every route below requires authentication

const expenseValidators = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type').optional().isIn(['expense', 'income']).withMessage('Type must be expense or income'),
  body('category').custom((value, { req }) => {
    const list = req.body.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!list.includes(value)) {
      throw new Error('Invalid category for the selected type');
    }
    return true;
  }),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('paymentMethod').optional().isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  body('isRecurring').optional().isBoolean(),
  body('recurringFrequency').optional({ nullable: true }).isIn([...RECURRING_FREQUENCIES, null]),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

// Static/specific routes before the parameterized /:id route
router.get('/stats', getStats);
router.get('/export', exportExpenses);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  getExpenses
);

router.post('/', expenseValidators, validate, createExpense);

router.get('/:id', getExpenseById);
router.put('/:id', expenseValidators, validate, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
