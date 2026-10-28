const express = require('express');
const {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  RECURRING_FREQUENCIES,
  CURRENCIES,
} = require('../utils/constants');

const router = express.Router();

// Exposes the enums the frontend needs to build dropdowns, so the
// category/currency lists only have to be maintained in one place.
router.get('/', (req, res) => {
  res.json({
    success: true,
    expenseCategories: EXPENSE_CATEGORIES,
    incomeCategories: INCOME_CATEGORIES,
    paymentMethods: PAYMENT_METHODS,
    recurringFrequencies: RECURRING_FREQUENCIES,
    currencies: CURRENCIES,
  });
});

module.exports = router;
