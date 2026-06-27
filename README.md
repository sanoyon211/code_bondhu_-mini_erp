# Code Bondhu Mini ERP

A lightweight, modern Enterprise Resource Planning (ERP) minimal viable product designed for small businesses to manage products, customers, suppliers, purchases, and sales efficiently.

## Features
- **Auth:** Secure authentication system.
- **Dashboard metrics:** Real-time overview of key business metrics.
- **CRUD Operations:** Full management for products, customers, and suppliers.
- **Purchase:** Record purchases with automatic stock increase.
- **Sales:** Process sales with stock validation, automatic stock deduction, and invoice generation.
- **Reports:** View and print detailed reports across modules.

## Tech Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

## Environment Variables
To connect to your Supabase backend, create a `.env` file in the root directory and add the following variables:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd code-bondhu-mini-erp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   Create a `.env` file and set up your Supabase URL and Key as shown in the Environment Variables section.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Known Limitations
- For this one-day MVP, purchases and sales currently handle only one product per transaction to maintain stability and simplicity.
- In a full production scenario, this should be upgraded to use proper database transactions (e.g., using Supabase RPCs) to handle multi-product carts and robust stock management.

## AI-Assisted Workflow
See `AI_USAGE.md` for AI prompts, workflow, and debug logs.
