const express = require('express');
const { body } = require('express-validator');
const { setBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { EXPENSE_CATEGORIES } = require('../utils/constants');

const router = express.Router();

router.use(protect);

router.get('/', getBudgets);

router.post(
  '/',
  [
    body('category').isIn(EXPENSE_CATEGORIES).withMessage('Invalid category'),
    body('monthlyLimit').isFloat({ gt: 0 }).withMessage('Monthly limit must be greater than 0'),
    body('alertThreshold').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  setBudget
);

router.delete('/:id', deleteBudget);

module.exports = router;
