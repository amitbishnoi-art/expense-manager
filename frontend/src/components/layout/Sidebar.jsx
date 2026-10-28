import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, UserCircle, Wallet, X } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Transactions', icon: Receipt },
  { to: '/budget', label: 'Budgets', icon: PiggyBank },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const NavItems = (
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onCloseMobile}
          className={({ isActive }) =>
            classNames(
              'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-soft text-brand'
                : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
            )
          }
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface py-6 lg:flex">
        <div className="mb-8 flex items-center gap-2 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white">
            <Wallet size={18} />
          </div>
          <span className="font-display text-lg font-semibold text-ink">Ledgerly</span>
        </div>
        {NavItems}
      </aside>

      {/* Mobile drawer */}
      <div
        className={classNames(
          'fixed inset-0 z-40 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={classNames(
            'absolute inset-0 bg-black/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={classNames(
            'absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-surface py-6 transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="mb-8 flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white">
                <Wallet size={18} />
              </div>
              <span className="font-display text-lg font-semibold text-ink">Ledgerly</span>
            </div>
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="rounded-control p-1.5 text-ink-muted hover:bg-surface-alt"
            >
              <X size={18} />
            </button>
          </div>
          {NavItems}
        </aside>
      </div>
    </>
  );
}
