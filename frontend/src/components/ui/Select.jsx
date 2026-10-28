import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const Select = forwardRef(function Select({ label, error, className = '', children, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            'w-full appearance-none rounded-control border bg-surface px-3 py-2.5 pr-9 text-sm text-ink transition-colors focus:border-brand focus:outline-none',
            error ? 'border-danger' : 'border-border',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
});

export default Select;
