import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react';
import { formatCurrency, formatDate, colorForIndex } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/DataContext';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

export default function RecentTransactions({ transactions }) {
  const { user } = useAuth();
  const { meta } = useAppData();
  const currency = user?.currency || 'USD';

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-semibold text-ink">Recent transactions</h3>
        <Link to="/expenses" className="text-xs font-medium text-brand hover:underline">
          View all
        </Link>
      </div>

      {!transactions?.length ? (
        <div className="p-5">
          <EmptyState icon={Receipt} title="Nothing yet" description="Your latest transactions will show up here." />
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {transactions.map((t) => {
            const catIndex = meta.expenseCategories.indexOf(t.category);
            const isIncome = t.type === 'income';
            return (
              <li key={t._id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isIncome
                      ? 'rgb(var(--color-income) / 0.12)'
                      : `${colorForIndex(catIndex >= 0 ? catIndex : 0)}1F`,
                    color: isIncome ? 'rgb(var(--color-income))' : colorForIndex(catIndex >= 0 ? catIndex : 0),
                  }}
                >
                  {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                  <p className="text-xs text-ink-muted">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-tabular text-sm font-semibold ${
                    isIncome ? 'text-income' : 'text-expense'
                  }`}
                >
                  {isIncome ? '+' : '−'}
                  {formatCurrency(t.amount, currency)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
