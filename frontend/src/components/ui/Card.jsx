import { classNames } from '../../utils/helpers';

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={classNames(
        'rounded-card border border-border bg-surface p-5 shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
