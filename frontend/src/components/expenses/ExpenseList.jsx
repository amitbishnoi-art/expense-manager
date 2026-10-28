import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2, Receipt, Repeat } from 'lucide-react';
import { formatCurrency, formatDate, colorForIndex } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/DataContext';
import EmptyState from '../ui/EmptyState';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const { user } = useAuth();
  const { meta } = useAppData();
  const currency = user?.currency || 'USD';

  if (!expenses?.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions found"
        description="Try adjusting your filters, or add your first transaction to get started."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      {/* Desktop table header */}
      <div className="hidden grid-cols-12 gap-3 border-b border-border bg-surface-alt px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-muted sm:grid">
        <span className="col-span-5">Transaction</span>
        <span className="col-span-2">Category</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-2 text-right">Amount</span>
        <span className="col-span-1" />
      </div>

      <ul className="divide-y divide-border">
        {expenses.map((t) => {
          const catIndex = meta.expenseCategories.indexOf(t.category);
          const isIncome = t.type === 'income';
          return (
            <li
              key={t._id}
              className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 sm:grid-cols-12"
            >
              <div className="col-span-2 flex items-center gap-3 sm:col-span-5">
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
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
                    {t.title}
                    {t.isRecurring && <Repeat size={12} className="shrink-0 text-ink-muted" />}
                  </p>
                  <p className="truncate text-xs text-ink-muted sm:hidden">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>
              </div>

              <span className="hidden text-sm text-ink-muted sm:col-span-2 sm:block">{t.category}</span>
              <span className="hidden text-sm text-ink-muted sm:col-span-2 sm:block">{formatDate(t.date)}</span>

              <span
                className={`text-right font-tabular text-sm font-semibold sm:col-span-2 ${
                  isIncome ? 'text-income' : 'text-expense'
                }`}
              >
                {isIncome ? '+' : '−'}
                {formatCurrency(t.amount, currency)}
              </span>

              <div className="col-span-2 flex justify-end gap-1 sm:col-span-1">
                <button
                  onClick={() => onEdit(t)}
                  aria-label={`Edit ${t.title}`}
                  className="rounded-control p-1.5 text-ink-muted hover:bg-surface-alt hover:text-ink"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(t)}
                  aria-label={`Delete ${t.title}`}
                  className="rounded-control p-1.5 text-ink-muted hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
