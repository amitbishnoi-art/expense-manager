# Ledgerly — MERN Expense Tracker

A full-stack expense & income management app built with **MongoDB, Express, React and Node (MERN)**. It has a proper JWT auth system with server-side validation, an interactive charts-based dashboard, monthly budgets with overspend alerts, CSV export, and a light/dark, fully responsive UI.

![stack](https://img.shields.io/badge/stack-MERN-2F6F4E) ![license](https://img.shields.io/badge/license-MIT-informational)

---

## ✨ Features

**Core (requested)**
- Full authentication — register/login with JWT, bcrypt-hashed passwords, and input validation on both the client (react-hook-form) and server (express-validator)
- Add, edit, delete expenses with categories like *Groceries*, *Utilities*, *Rent*, *Transportation*, etc.
- Interactive dashboard with charts: category breakdown (pie), income vs. expense (bar), net savings trend (area) — all built with Recharts and powered by MongoDB aggregation pipelines
- Light / dark mode with no flash-of-wrong-theme, persisted per browser, and fully responsive layout (mobile drawer nav, stacked cards, responsive tables)

**Added on top, because a tracker is more useful with these**
- **Income tracking**, not just expenses — see true net balance, not just spend
- **Monthly budgets per category** with progress bars and a 3-state status (on track / nearing limit / over budget)
- **Recurring transaction flag** (weekly/biweekly/monthly/yearly) for bills and subscriptions
- **Powerful transaction list** — search, filter by type/category/date range, sort, pagination
- **CSV export** of all transactions
- **Multi-currency support** (USD, EUR, GBP, PKR, INR, CAD, AUD, JPY) with proper `Intl` formatting
- **Rate limiting** on auth endpoints + input sanitization (`express-mongo-sanitize`) + `helmet` security headers
- **Seed script** to populate a demo account with 6 months of realistic sample data
- Toast notifications, empty states, loading states, and confirm-before-delete dialogs throughout

---

## 🧱 Tech stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 18 (Vite), React Router v6, Tailwind CSS, Recharts, React Hook Form, Axios, React Toastify, Lucide icons |
| Backend    | Node.js, Express, Mongoose |
| Database   | MongoDB |
| Auth       | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator (server), react-hook-form (client) |
| Security   | helmet, express-rate-limit, express-mongo-sanitize, cors |

---

## 📁 Project structure

```
expense-tracker-mern/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route logic (auth, expenses, budgets)
│   ├── middleware/                # auth guard, validation, error handler, rate limiter
│   ├── models/                    # User, Expense, Budget (Mongoose schemas)
│   ├── routes/                    # /api/auth, /api/expenses, /api/budgets, /api/meta
│   ├── utils/                     # token generation, shared constants, seed script
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js           # axios instance with JWT + 401 interceptors
    │   ├── components/            # ui/, layout/, auth/, dashboard/, expenses/, budget/
    │   ├── context/                # AuthContext, ThemeContext, DataContext
    │   ├── pages/                  # Dashboard, Expenses, Budget, Profile, Login, Register
    │   └── utils/helpers.js
    └── index.html
```

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `CLIENT_URL` — the frontend's URL (defaults to `http://localhost:5173`)

Start the API:

```bash
npm run dev        # nodemon, auto-restarts on changes
# or
npm start           # plain node
```

The API runs on `http://localhost:5000` by default. Visit `http://localhost:5000/api/health` to confirm it's up.

**Optional — seed demo data:**

```bash
npm run seed
```

This creates a demo account (`demo@expensetracker.app` / `Demo1234`) with 6 months of sample income/expenses and a few budgets, so the dashboard isn't empty on first look.

### 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # optional — defaults already work with the Vite proxy
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no extra CORS setup is needed locally.

### 3. Log in

- Register a new account, **or**
- Run the backend seed script and log in with `demo@expensetracker.app` / `Demo1234`

---

## 🔌 API overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in, returns JWT |
| GET | `/auth/me` | Current user profile *(protected)* |
| PUT | `/auth/profile` | Update name/currency/income goal *(protected)* |
| PUT | `/auth/password` | Change password *(protected)* |
| GET | `/expenses` | List transactions — supports `type`, `category`, `startDate`, `endDate`, `search`, `sortBy`, `order`, `page`, `limit` |
| POST | `/expenses` | Create a transaction |
| GET | `/expenses/:id` | Get one transaction |
| PUT | `/expenses/:id` | Update a transaction |
| DELETE | `/expenses/:id` | Delete a transaction |
| GET | `/expenses/stats` | Dashboard aggregates: monthly totals, category breakdown, 12-month trend, recent transactions |
| GET | `/expenses/export` | Download all transactions as CSV |
| GET | `/budgets` | List budgets with current-month spend & status |
| POST | `/budgets` | Create/update a budget for a category |
| DELETE | `/budgets/:id` | Delete a budget |
| GET | `/meta` | Category/payment-method/currency enums used to build dropdowns |

---

## 🎨 Design notes

The UI uses a warm "ledger" palette (paper background, ink text, deep green brand color) with **Space Grotesk** for headings/numbers and **Inter** for body text. Income and expenses always use the same semantic colors (green/rust) across every chart, badge and list so the app stays easy to scan at a glance. Both themes are implemented with CSS custom properties, so adding a new accent or adjusting contrast only requires editing `src/index.css`.

---

## 🔒 Security notes

- Passwords are hashed with bcrypt (12 salt rounds) and never returned by the API
- JWTs expire after 7 days by default (`JWT_EXPIRES_IN` in `.env`)
- All write endpoints validate and sanitize input server-side — the frontend validation is a UX convenience, not the source of truth
- Auth endpoints are rate-limited to slow down brute-force attempts
- Every expense/budget query is scoped to `req.user._id`, so users can only ever see or modify their own data

---

## 📦 Building for production

```bash
# Backend — just run with NODE_ENV=production and a process manager (pm2, etc.)
cd backend && NODE_ENV=production npm start

# Frontend — produces a static build in frontend/dist
cd frontend && npm run build
```

Serve `frontend/dist` with any static host (Vercel, Netlify, nginx...) and point `VITE_API_URL` at your deployed backend URL before building.

---

## License

MIT — do whatever you'd like with this as a starting point for your own project.
