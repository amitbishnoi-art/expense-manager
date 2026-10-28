import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-control border border-border bg-surface px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-medium text-ink">{label}</p>
      <p className={value >= 0 ? 'text-income' : 'text-expense'}>Net: {formatCurrency(value, currency)}</p>
    </div>
  );
}

export default function TrendAreaChart({ data }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const chartData = data.map((d) => ({ ...d, net: d.income - d.expense }));

  return (
    <Card>
      <h3 className="mb-1 font-display text-base font-semibold text-ink">Net savings trend</h3>
      <p className="mb-4 text-xs text-ink-muted">Income minus expenses, per month</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--color-brand))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="rgb(var(--color-brand))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgb(var(--color-border))" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'rgb(var(--color-ink-muted))' }}
              axisLine={{ stroke: 'rgb(var(--color-border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'rgb(var(--color-ink-muted))' }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area
              type="monotone"
              dataKey="net"
              stroke="rgb(var(--color-brand))"
              strokeWidth={2}
              fill="url(#netFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
