import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'bg-brand text-white hover:opacity-90 shadow-card',
  secondary: 'bg-surface-alt text-ink hover:bg-border/60 border border-border',
  ghost: 'bg-transparent text-ink hover:bg-surface-alt',
  danger: 'bg-danger text-white hover:opacity-90',
  outline: 'bg-transparent border border-border text-ink hover:bg-surface-alt',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon: Icon,
  children,
  disabled,
  ...props
}) {
  return (
    <Tag
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2} />
      )}
      {children}
    </Tag>
  );
}
