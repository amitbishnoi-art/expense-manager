import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

// Holds app-wide reference data (category lists, payment methods, etc.)
// fetched once so every form/filter shares the same source of truth,
// plus a simple refresh counter components can use to re-pull their data
// after a mutation (add/edit/delete expense, set budget, ...).
const DataContext = createContext(null);

const FALLBACK_META = {
  expenseCategories: ['Groceries', 'Utilities', 'Rent/Mortgage', 'Transportation', 'Other'],
  incomeCategories: ['Salary', 'Freelance', 'Other Income'],
  paymentMethods: ['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'],
  recurringFrequencies: ['weekly', 'biweekly', 'monthly', 'yearly'],
  currencies: ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'CAD', 'AUD', 'JPY'],
};

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [meta, setMeta] = useState(FALLBACK_META);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/meta')
      .then(({ data }) => setMeta(data))
      .catch(() => setMeta(FALLBACK_META));
  }, [isAuthenticated]);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  return <DataContext.Provider value={{ meta, refresh, refreshTick }}>{children}</DataContext.Provider>;
}

export const useAppData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used within a DataProvider');
  return ctx;
};
