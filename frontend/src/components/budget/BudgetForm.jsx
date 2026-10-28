import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import { useAppData } from '../../context/DataContext';
import { getErrorMessage } from '../../utils/helpers';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function BudgetForm({ onSaved, existingCategories }) {
  const { meta } = useAppData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { category: '', monthlyLimit: '', alertThreshold: 80 } });

  const onSubmit = async (values) => {
    try {
      await api.post('/budgets', { ...values, monthlyLimit: Number(values.monthlyLimit), alertThreshold: Number(values.alertThreshold) });
      toast.success(existingCategories.includes(values.category) ? 'Budget updated' : 'Budget created');
      reset({ category: '', monthlyLimit: '', alertThreshold: 80 });
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-ink">Set a monthly budget</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Select label="Category" error={errors.category?.message} {...register('category', { required: 'Required' })}>
          <option value="">Select category</option>
          {meta.expenseCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="Monthly limit"
          type="number"
          step="0.01"
          min="1"
          placeholder="e.g. 300"
          error={errors.monthlyLimit?.message}
          {...register('monthlyLimit', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })}
        />
        <Input
          label="Alert at (%)"
          type="number"
          min="1"
          max="100"
          {...register('alertThreshold', { min: 1, max: 100 })}
        />
        <div className="flex items-end">
          <Button type="submit" icon={Plus} loading={isSubmitting} className="w-full">
            Save budget
          </Button>
        </div>
      </form>
    </Card>
  );
}
