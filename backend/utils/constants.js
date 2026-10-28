// Shared enums used across models, controllers and validators.
const EXPENSE_CATEGORIES = [
  'Groceries',
  'Utilities',
  'Rent/Mortgage',
  'Transportation',
  'Dining Out',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Travel',
  'Insurance',
  'Subscriptions',
  'Personal Care',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Refund',
  'Other Income',
];

const PAYMENT_METHODS = ['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Mobile Wallet', 'Other'];

const RECURRING_FREQUENCIES = ['weekly', 'biweekly', 'monthly', 'yearly'];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'CAD', 'AUD', 'JPY'];

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  RECURRING_FREQUENCIES,
  CURRENCIES,
};
