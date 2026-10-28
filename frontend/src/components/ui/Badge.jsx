import { classNames } from '../../utils/helpers';

const tones = {
  neutral: 'bg-surface-alt text-ink-muted border-border',
  income: 'bg-income/10 text-income border-income/30',
  expense: 'bg-expense/10 text-expense border-expense/30',
  warn: 'bg-warn/10 text-warn border-warn/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  brand: 'bg-brand-soft text-brand border-brand/20',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
