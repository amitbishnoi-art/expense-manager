import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-control border border-border bg-surface px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-medium text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

export default function MonthlyBarChart({ data }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  return (
    <Card>
      <h3 className="mb-1 font-display text-base font-semibold text-ink">Income vs. expenses</h3>
      <p className="mb-4 text-xs text-ink-muted">Last 12 months</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid vertical={false} stroke="rgb(var(--color-border))" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'rgb(var(--color-ink-muted))' }}
              axisLine={{ stroke: 'rgb(var(--color-border))' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'rgb(var(--color-ink-muted))' }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: 'rgb(var(--color-surface-alt))' }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: 'rgb(var(--color-ink-muted))' }}
            />
            <Bar dataKey="income" name="Income" fill="rgb(var(--color-income))" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="expense" name="Expense" fill="rgb(var(--color-expense))" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
