# WedPlan — Wedding Planning Platform (Frontend Client)

WedPlan is a role-based wedding planning platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Stripe integration.

## Important Features
- **Public Discovery**: Browse wedding services across 6 major wedding categories with search, category filtering, and price sorting.
- **Service Details**: Full gallery display, vendor background, starting prices, and direct booking inquiry request form.
- **Role-Based Authentication**: Better Auth / JWT authentication with Customer and Vendor registration and Google OAuth sign-in.
- **Vendor Dashboard**:
  - Portfolio overview metrics (Total Services, Active Services, Pending Requests, Accepted Bookings).
  - Add new wedding services with ImgBB-compatible image hosting.
  - Free Plan (up to 3 active services) vs Premium Plan (unlimited services).
  - Review, accept, and reject booking inquiries.
  - Upgrade to Premium via Stripe Checkout.
- **Customer Dashboard**:
  - Inquiries overview (Total, Pending, Accepted, Rejected).
  - View booking history and cancel pending requests.
- **Admin Dashboard**:
  - Platform statistics overview.
  - User management (search, role filtering, block/unblock accounts).
  - Service moderation queue (approve/reject/delete listings).
  - Audit platform Stripe transactions.
- **Design & Polish**:
  - Dark luxury wedding theme with consistent spacing and typography.
  - Responsive layout for desktop, tablet, and mobile.
  - Framer Motion animations and custom toast notifications.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Payment**: Stripe Checkout (Test Mode)

## Installation & Running Locally
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Evaluation Accounts
- **Admin**: `admin@wedplan.com` / `WedPlan@2026`
- **Vendor**: `elena@royalphoto.com` / `WedPlan@2026`
- **Customer**: `sarah.j@gmail.com` / `WedPlan@2026`
