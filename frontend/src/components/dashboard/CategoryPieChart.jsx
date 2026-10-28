import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { colorForIndex, formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

function CustomTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-control border border-border bg-surface px-3 py-2 text-xs shadow-pop">
      <p className="font-medium text-ink">{item.name}</p>
      <p className="text-ink-muted">{formatCurrency(item.value, currency)}</p>
    </div>
  );
}

export default function CategoryPieChart({ data }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  if (!data?.length) {
    return (
      <Card>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Spending by category</h3>
        <p className="mb-4 text-xs text-ink-muted">This month</p>
        <EmptyState
          icon={PieIcon}
          title="No expenses yet"
          description="Add a transaction this month to see the breakdown."
        />
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <Card>
      <h3 className="mb-1 font-display text-base font-semibold text-ink">Spending by category</h3>
      <p className="mb-2 text-xs text-ink-muted">This month · {formatCurrency(total, currency)} total</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={colorForIndex(index)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: 'rgb(var(--color-ink-muted))', lineHeight: '22px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
