import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', icon: Icon, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        )}
        <input
          ref={ref}
          className={classNames(
            'w-full rounded-control border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-brand focus:outline-none',
            Icon && 'pl-9',
            error ? 'border-danger' : 'border-border',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
});

export default Input;
