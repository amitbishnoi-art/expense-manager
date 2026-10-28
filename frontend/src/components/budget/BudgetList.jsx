import { Trash2, AlertTriangle, PiggyBank } from 'lucide-react';
import { formatCurrency, classNames } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const barTone = { ok: 'bg-brand', warning: 'bg-warn', exceeded: 'bg-danger' };
const badgeTone = { ok: 'brand', warning: 'warn', exceeded: 'danger' };
const badgeLabel = { ok: 'On track', warning: 'Nearing limit', exceeded: 'Over budget' };

export default function BudgetList({ budgets, onDelete }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  if (!budgets?.length) {
    return (
      <EmptyState
        icon={PiggyBank}
        title="No budgets yet"
        description="Create your first monthly budget above to start tracking spending against a limit."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {budgets.map((b) => (
        <Card key={b._id} className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-base font-semibold text-ink">{b.category}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {formatCurrency(b.spent, currency)} of {formatCurrency(b.monthlyLimit, currency)}
              </p>
            </div>
            <button
              onClick={() => onDelete(b)}
              aria-label={`Delete ${b.category} budget`}
              className="rounded-control p-1.5 text-ink-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
            <div
              className={classNames('h-full rounded-full transition-all duration-500', barTone[b.status])}
              style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Badge tone={badgeTone[b.status]}>
              {b.status === 'exceeded' && <AlertTriangle size={11} />}
              {badgeLabel[b.status]}
            </Badge>
            <span className="text-xs font-medium text-ink-muted">{b.percentUsed}% used</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
