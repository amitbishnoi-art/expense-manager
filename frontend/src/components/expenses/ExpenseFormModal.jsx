import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useAppData } from '../../context/DataContext';
import { formatDateInput, getErrorMessage } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const defaultValues = {
  type: 'expense',
  title: '',
  amount: '',
  category: '',
  date: formatDateInput(new Date()),
  paymentMethod: 'Debit Card',
  notes: '',
  isRecurring: false,
  recurringFrequency: '',
  tags: '',
};

export default function ExpenseFormModal({ open, onClose, onSaved, expense }) {
  const { meta } = useAppData();
  const isEdit = Boolean(expense?._id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const type = watch('type');
  const isRecurring = watch('isRecurring');
  const categories = type === 'income' ? meta.incomeCategories : meta.expenseCategories;

  useEffect(() => {
    if (!open) return;
    if (expense) {
      reset({
        type: expense.type,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: formatDateInput(expense.date),
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || '',
        isRecurring: expense.isRecurring || false,
        recurringFrequency: expense.recurringFrequency || '',
        tags: (expense.tags || []).join(', '),
      });
    } else {
      reset(defaultValues);
    }
  }, [open, expense, reset]);

  // Reset category when switching between expense/income since the lists differ
  useEffect(() => {
    if (!categories.includes(watch('category'))) {
      setValue('category', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      amount: Number(values.amount),
      recurringFrequency: values.isRecurring ? values.recurringFrequency || 'monthly' : null,
      tags: values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await api.put(`/expenses/${expense._id}`, payload);
        toast.success('Transaction updated');
      } else {
        await api.post('/expenses', payload);
        toast.success('Transaction added');
      }
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit transaction' : 'Add transaction'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('type', 'expense')}
            className={`rounded-control border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === 'expense' ? 'border-expense bg-expense/10 text-expense' : 'border-border text-ink-muted'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'income')}
            className={`rounded-control border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === 'income' ? 'border-income bg-income/10 text-income' : 'border-border text-ink-muted'
            }`}
          >
            Income
          </button>
        </div>

        <Input
          label="Title"
          placeholder={type === 'income' ? 'e.g. Monthly salary' : 'e.g. Weekly groceries'}
          error={errors.title?.message}
          {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Must be greater than 0' },
            })}
          />
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date', { required: 'Date is required' })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" error={errors.category?.message} {...register('category', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="Payment method" {...register('paymentMethod')}>
            {meta.paymentMethods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        <Input label="Notes (optional)" placeholder="Add any extra detail" {...register('notes')} />
        <Input label="Tags (optional, comma separated)" placeholder="e.g. work, urgent" {...register('tags')} />

        <div className="rounded-control border border-border bg-surface-alt px-3.5 py-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" className="h-4 w-4 rounded accent-brand" {...register('isRecurring')} />
            This is a recurring transaction
          </label>
          {isRecurring && (
            <Select className="mt-3" label="Frequency" {...register('recurringFrequency')}>
              {meta.recurringFrequencies.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
