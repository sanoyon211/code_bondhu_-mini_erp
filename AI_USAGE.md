# AI Usage Documentation

## Tools Used
- **Gemini 3.1 Pro (via Antigravity IDE):** Used for step-by-step code generation, file creation, and debugging.
- **NotebookLM / Chat Assistant:** Requirement breakdown, architecture planning, and step-by-step guidance workflow.

## Development Workflow
1. Broke the assessment into 10 smaller, manageable modules.
2. Designed the Supabase SQL schema and strictly defined TypeScript interfaces first.
3. Generated one feature at a time using specific prompts for the Gemini agent.
4. Ran the app locally after each feature and tested the UI/UX.
5. Manually reviewed generated code for type safety (avoiding `any`), security, and status badge color correctness.
6. Fixed bugs using targeted prompts instead of regenerating the full app.

## Important Manual Decisions
- Used Supabase instead of MongoDB to finish faster with built-in Auth + Postgres Database.
- Kept purchase and sale records to one product per transaction for a stable one-day MVP, avoiding complex cart logic.
- Used authenticated-user RLS (Row Level Security) policies for assessment simplicity and browser-safe access.
- Added known limitations in the README for production honesty.

## Example Prompts
Here are a few actual prompts used during the development process:

**1. Project Setup:**
> "I want you to act as a senior frontend architect. We are going to build a one-day Mini ERP system MVP. Tech Stack: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, and Supabase. Please execute the commands in the terminal to create the project, install dependencies, and setup Tailwind + shadcn/ui..."

**2. Product CRUD & UI Requirements:**
> "Act as a senior frontend architect. We need to implement the Products CRUD page (src/pages/Products.tsx). Theme: shadcn 'Slate'. Status Badges: Strictly use Green for 'In Stock', Yellow/Warning for 'Low Stock', and Red for 'Out of Stock'. Use a shadcn <Table> for the data list. Show a 'Loading' state during fetch..."

**3. Purchase & Stock Increment Logic:**
> "We need to implement the Purchase flow and automatic Stock Increment logic. Implement createPurchaseWithStockUpdate(payload). This function MUST insert a purchase record AND update the selected product's stock (current stock + purchase quantity). Throw clear errors if anything fails."

## Bugs Fixed
- **VITE Environment Variable:** Fixed VITE environment variable name mismatch during Supabase client initialization.
- **Stock Update Logic:** Fixed an issue where the frontend product table was not immediately refetching after a successful sale/purchase.
- **Protected Route:** Fixed a redirect loop in the protected route by cleanly managing the Supabase auth session loading state.