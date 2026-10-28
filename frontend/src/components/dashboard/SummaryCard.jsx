import { classNames } from '../../utils/helpers';
import Card from '../ui/Card';

const toneStyles = {
  brand: 'bg-brand-soft text-brand',
  income: 'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  neutral: 'bg-surface-alt text-ink-muted',
};

export default function SummaryCard({ label, value, icon: Icon, tone = 'neutral', trend, sub }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <span className={classNames('flex h-9 w-9 items-center justify-center rounded-control', toneStyles[tone])}>
          <Icon size={17} />
        </span>
      </div>
      <div>
        <p className="font-display font-tabular text-2xl font-semibold text-ink sm:text-[28px]">{value}</p>
        {(trend !== undefined || sub) && (
          <p className="mt-1 text-xs text-ink-muted">
            {trend !== undefined && (
              <span className={classNames('font-medium', trend >= 0 ? 'text-income' : 'text-expense')}>
                {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
              </span>
            )}{' '}
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
}
