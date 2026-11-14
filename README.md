# 🍽️ Sazón Latino — Restaurant Order Management System

A web-based order management system (POS) built for **Sazón Latino**, a Latin American restaurant. It covers the full service flow: taking orders at the table, sending them to the kitchen and bar printers, closing the bill and analysing sales.

**🔗 Live demo:** https://sazon-latino-five.vercel.app

> UI language: Spanish (built for a Spanish-speaking team).

---

## ✨ Features

- **Table management** — see which tables are free or occupied, open a table and add items to its order
- **Orders** — create orders, add or change items, view order details and status
- **Kitchen view** — dedicated screen with incoming orders for the kitchen
- **Menu management** — products and categories with prices
- **Receipts** — generate the bill (boleta) for each table
- **Users & roles** — admin and waiter roles, PIN-based login, activate/deactivate staff
- **Dashboard & reports** — revenue, paid orders, average ticket, sales by category and product, per-waiter performance, order history, staff consumption tracked separately
- **Excel export** — export orders for the selected period
- **Thermal printing** — kitchen/bar tickets and receipts printed automatically on Epson TM-T88V printers, including opening the cash drawer
- **Installable PWA** — works as an app on tablets and phones

## 🧱 Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix) |
| State & data | TanStack React Query, React Hook Form, Zod |
| Backend / DB | Supabase (PostgreSQL, auth, SQL triggers) |
| Charts & export | Recharts, ExcelJS |
| Printing | Node.js + TypeScript middleware sending raw ESC/POS commands |
| Testing | Vitest, Testing Library, Playwright |
| Deployment | Vercel |

## 🖨️ Printer middleware

The `printer-middleware/` folder contains a small local Node.js server that receives print requests from the browser over HTTP and sends them as raw ESC/POS commands to the restaurant's thermal printers.

- Routes each ticket to the right printer (`cocina` = kitchen, `barra` = bar/cashier) using `printers.config.json`
- Endpoints for kitchen/bar tickets, receipts (with optional cash drawer opening), printer status and config reload
- SQL triggers automatically assign the destination (kitchen or bar) for each item

See [`printer-middleware/README.md`](printer-middleware/README.md) for setup.

## 🚀 Run locally

```bash
git clone https://github.com/ringeledev/sazon-latino.git
cd sazon-latino
npm install
npm run dev
```

You need a Supabase project. Add your keys in a `.env` file:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 👤 Author

**Matias Ringele** — Junior Software Developer
[GitHub](https://github.com/ringeledev) · ringelematias86@gmail.com

Built with the help of AI-assisted development tools (Lovable, Claude).
