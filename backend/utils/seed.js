/**
 * Optional helper: seeds the database with a demo user and a few months
 * of sample expenses/income so the dashboard has something to show.
 *
 * Run with: npm run seed   (from the backend/ folder, after setting .env)
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const DEMO_EMAIL = 'demo@expensetracker.app';

const categories = [
  'Groceries',
  'Utilities',
  'Rent/Mortgage',
  'Transportation',
  'Dining Out',
  'Entertainment',
  'Healthcare',
  'Shopping',
];

const randomBetween = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const seed = async () => {
  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: DEMO_EMAIL,
      password: 'Demo1234',
      currency: 'USD',
      monthlyIncomeGoal: 4000,
    });
    console.log('Created demo user: demo@expensetracker.app / Demo1234');
  } else {
    await Expense.deleteMany({ user: user._id });
    await Budget.deleteMany({ user: user._id });
    console.log('Demo user already existed - cleared old expenses/budgets');
  }

  const docs = [];
  const now = new Date();

  for (let m = 5; m >= 0; m--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);

    // Salary income
    docs.push({
      user: user._id,
      type: 'income',
      title: 'Monthly salary',
      amount: randomBetween(3800, 4200),
      category: 'Salary',
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      paymentMethod: 'Bank Transfer',
    });

    // A handful of expenses per category per month
    categories.forEach((category) => {
      const entries = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < entries; i++) {
        docs.push({
          user: user._id,
          type: 'expense',
          title: `${category} expense`,
          amount: randomBetween(15, 250),
          category,
          date: new Date(
            monthDate.getFullYear(),
            monthDate.getMonth(),
            Math.floor(Math.random() * 27) + 1
          ),
          paymentMethod: ['Cash', 'Debit Card', 'Credit Card'][Math.floor(Math.random() * 3)],
        });
      }
    });
  }

  await Expense.insertMany(docs);

  await Budget.insertMany([
    { user: user._id, category: 'Groceries', monthlyLimit: 500, alertThreshold: 80 },
    { user: user._id, category: 'Dining Out', monthlyLimit: 200, alertThreshold: 75 },
    { user: user._id, category: 'Entertainment', monthlyLimit: 150, alertThreshold: 80 },
    { user: user._id, category: 'Transportation', monthlyLimit: 250, alertThreshold: 80 },
  ]);

  console.log(`Seeded ${docs.length} transactions and 4 budgets.`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
