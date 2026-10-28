import { useEffect, useState, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/DataContext';
import { formatCurrency, getErrorMessage } from '../utils/helpers';
import Layout from '../components/layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import TrendAreaChart from '../components/dashboard/TrendAreaChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetSnapshot from '../components/dashboard/BudgetSnapshot';
import Spinner from '../components/ui/Spinner';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { refreshTick, refresh } = useAppData();
  const currency = user?.currency || 'USD';

  const [stats, setStats] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [statsRes, budgetsRes] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/budgets'),
      ]);
      setStats(statsRes.data);
      setBudgets(budgetsRes.data.budgets);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTick]);

  if (loading || !stats) {
    return (
      <Layout pageTitle="Dashboard">
        <div className="flex h-96 items-center justify-center">
          <Spinner size={32} />
        </div>
      </Layout>
    );
  }

  const monthIncome = stats.currentMonth.income || 0;
  const monthExpense = stats.currentMonth.expense || 0;
  const monthNet = monthIncome - monthExpense;
  const netAllTime = (stats.allTime.income || 0) - (stats.allTime.expense || 0);

  return (
    <Layout pageTitle="Dashboard" onAddExpense={() => setFormOpen(true)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total balance"
            value={formatCurrency(netAllTime, currency)}
            icon={Wallet}
            tone="brand"
            sub="all time"
          />
          <SummaryCard
            label="Income this month"
            value={formatCurrency(monthIncome, currency)}
            icon={TrendingUp}
            tone="income"
          />
          <SummaryCard
            label="Expenses this month"
            value={formatCurrency(monthExpense, currency)}
            icon={TrendingDown}
            tone="expense"
          />
          <SummaryCard
            label="Net this month"
            value={formatCurrency(monthNet, currency)}
            icon={Scale}
            tone={monthNet >= 0 ? 'income' : 'expense'}
            sub={monthNet >= 0 ? 'you\u2019re in the green' : 'spending more than earning'}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <MonthlyBarChart data={stats.trend} />
          </div>
          <div className="xl:col-span-2">
            <CategoryPieChart data={stats.categoryBreakdown} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <TrendAreaChart data={stats.trend} />
          </div>
          <div className="xl:col-span-2">
            <BudgetSnapshot budgets={budgets} />
          </div>
        </div>

        <RecentTransactions transactions={stats.recentTransactions} />
      </div>

      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          refresh();
        }}
      />
    </Layout>
  );
}
