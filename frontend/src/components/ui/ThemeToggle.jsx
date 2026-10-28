import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-surface-alt transition-colors ${className}`}
    >
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-surface shadow-card transition-transform duration-200 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {isDark ? <Moon size={14} className="text-brand" /> : <Sun size={14} className="text-warn" />}
      </span>
    </button>
  );
}
