import { Wallet } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Register() {
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
          <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-muted">Start building a clearer picture of your spending.</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
