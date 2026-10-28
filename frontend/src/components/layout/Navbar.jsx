import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

export default function Navbar({ onMenuClick, onAddExpense, pageTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-control p-2 text-ink-muted hover:bg-surface-alt lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink sm:text-xl">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onAddExpense && (
          <Button size="sm" icon={Plus} onClick={onAddExpense} className="hidden sm:inline-flex">
            Add transaction
          </Button>
        )}
        {onAddExpense && (
          <button
            onClick={onAddExpense}
            aria-label="Add transaction"
            className="inline-flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white sm:hidden"
          >
            <Plus size={18} />
          </button>
        )}
        <ThemeToggle />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-control border border-border bg-surface py-1.5 pl-1.5 pr-2.5 hover:bg-surface-alt"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: user?.avatarColor || '#2F6F4E' }}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name}</span>
            <ChevronDown size={14} className="hidden text-ink-muted sm:inline" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-control border border-border bg-surface py-1.5 shadow-pop animate-slide-up">
              <div className="border-b border-border px-3.5 py-2">
                <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
                <p className="truncate text-xs text-ink-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-danger hover:bg-surface-alt"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
