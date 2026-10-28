const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('../utils/constants');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },
    monthlyLimit: {
      type: Number,
      required: true,
      min: [1, 'Monthly limit must be greater than 0'],
    },
    alertThreshold: {
      type: Number,
      default: 80, // percent of limit at which we start warning
      min: 1,
      max: 100,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
