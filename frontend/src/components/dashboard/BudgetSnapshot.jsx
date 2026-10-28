import { Link } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { formatCurrency, classNames } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

const barTone = {
  ok: 'bg-brand',
  warning: 'bg-warn',
  exceeded: 'bg-danger',
};

export default function BudgetSnapshot({ budgets }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-semibold text-ink">Budgets this month</h3>
        <Link to="/budget" className="text-xs font-medium text-brand hover:underline">
          Manage
        </Link>
      </div>

      {!budgets?.length ? (
        <div className="p-5">
          <EmptyState
            icon={PiggyBank}
            title="No budgets set"
            description="Set a monthly limit per category to catch overspending early."
            action={
              <Button as={Link} to="/budget" size="sm" variant="secondary">
                Set a budget
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="space-y-4 px-5 py-4">
          {budgets.slice(0, 4).map((b) => (
            <li key={b._id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{b.category}</span>
                <span className="font-tabular text-ink-muted">
                  {formatCurrency(b.spent, currency)} / {formatCurrency(b.monthlyLimit, currency)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-alt">
                <div
                  className={classNames('h-full rounded-full transition-all', barTone[b.status])}
                  style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
