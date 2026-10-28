import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Lock, Palette } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { getErrorMessage } from '../utils/helpers';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { meta } = useAppData();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name,
      currency: user?.currency,
      monthlyIncomeGoal: user?.monthlyIncomeGoal || 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put('/auth/profile', {
        ...values,
        monthlyIncomeGoal: Number(values.monthlyIncomeGoal),
      });
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <User size={17} className="text-brand" />
        <h3 className="font-display text-base font-semibold text-ink">Profile details</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
        />
        <Input label="Email" value={user?.email} disabled className="cursor-not-allowed opacity-70" />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Currency" {...register('currency')}>
            {meta.currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Monthly income goal"
            type="number"
            min="0"
            step="0.01"
            {...register('monthlyIncomeGoal', { min: 0 })}
          />
        </div>
        <Button type="submit" loading={isSubmitting}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    try {
      await api.put('/auth/password', values);
      toast.success('Password updated');
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Lock size={17} className="text-brand" />
        <h3 className="font-display text-base font-semibold text-ink">Change password</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Current password"
          type="password"
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Required' })}
        />
        <Input
          label="New password"
          type="password"
          hint="At least 8 characters with an uppercase letter and a number"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'Required',
            minLength: { value: 8, message: 'At least 8 characters' },
            pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: 'Include an uppercase letter and a number' },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            validate: (v) => v === newPassword || 'Passwords do not match',
          })}
        />
        <Button type="submit" variant="secondary" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </Card>
  );
}

function AppearanceCard() {
  const { theme } = useTheme();
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Palette size={17} className="text-brand" />
        <h3 className="font-display text-base font-semibold text-ink">Appearance</h3>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Theme</p>
          <p className="text-xs text-ink-muted">Currently using {theme} mode</p>
        </div>
        <ThemeToggle />
      </div>
    </Card>
  );
}

export default function Profile() {
  return (
    <Layout pageTitle="Profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileForm />
          <AppearanceCard />
        </div>
        <PasswordForm />
      </div>
    </Layout>
  );
}
