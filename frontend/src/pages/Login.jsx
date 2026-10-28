import { Wallet } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-control bg-brand text-white">
            <Wallet size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to keep tracking your money.</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-muted">
          Demo login: demo@expensetracker.app / Demo1234 (after running the seed script)
        </p>
      </div>
    </div>
  );
}
