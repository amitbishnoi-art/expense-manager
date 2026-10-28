// A stable, distinct palette for category-based charts. Chosen to work
// on both the light paper background and the dark ink background.
export const CATEGORY_COLORS = [
  '#2F6F4E', // brand green
  '#C2542C', // rust
  '#B8862E', // amber
  '#3E7CB1', // steel blue
  '#8B5FBF', // violet
  '#4F8A6D', // sage
  '#C2456B', // berry
  '#5C6BC0', // indigo
  '#D08A3E', // ochre
  '#4A9E9E', // teal
  '#9C6B4F', // clay
  '#7C8471', // olive
  '#B65C8A', // orchid
  '#5B7A99', // slate blue
];

export const colorForIndex = (i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length];

const CURRENCY_LOCALE = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  PKR: 'en-PK',
  INR: 'en-IN',
  CAD: 'en-CA',
  AUD: 'en-AU',
  JPY: 'ja-JP',
};

export const formatCurrency = (amount, currency = 'USD') => {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] || 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
};

export const formatDateInput = (date) => {
  const d = date ? new Date(date) : new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0];
};

export const classNames = (...args) => args.filter(Boolean).join(' ');

export const getErrorMessage = (error) => {
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

export const percentChange = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
