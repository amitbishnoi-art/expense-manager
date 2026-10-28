import { useState } from 'react';
import { Search, SlidersHorizontal, Download, X } from 'lucide-react';
import { useAppData } from '../../context/DataContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const emptyFilters = {
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  order: 'desc',
};

export { emptyFilters };

export default function ExpenseFilters({ filters, onChange, onExport }) {
  const { meta } = useAppData();
  const [expanded, setExpanded] = useState(false);
  const categories = filters.type === 'income' ? meta.incomeCategories : meta.expenseCategories;

  const update = (patch) => onChange({ ...filters, ...patch });
  const hasActiveFilters =
    filters.type || filters.category || filters.startDate || filters.endDate || filters.search;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            icon={SlidersHorizontal}
            onClick={() => setExpanded((v) => !v)}
          >
            Filters
          </Button>
          <Button type="button" variant="outline" size="md" icon={Download} onClick={onExport}>
            Export
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            label="Type"
            value={filters.type}
            onChange={(e) => update({ type: e.target.value, category: '' })}
          >
            <option value="">All types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
          <Select label="Category" value={filters.category} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="From"
            type="date"
            value={filters.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
          />
          <Input
            label="To"
            type="date"
            value={filters.endDate}
            onChange={(e) => update({ endDate: e.target.value })}
          />
          <Select
            label="Sort by"
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              update({ sortBy, order });
            }}
          >
            <option value="date-desc">Date (newest)</option>
            <option value="date-asc">Date (oldest)</option>
            <option value="amount-desc">Amount (high-low)</option>
            <option value="amount-asc">Amount (low-high)</option>
            <option value="title-asc">Title (A-Z)</option>
          </Select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChange(emptyFilters)}
              className="flex items-center gap-1 self-end text-xs font-medium text-ink-muted hover:text-danger"
            >
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
