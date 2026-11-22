# WedPlan — Wedding Planning Platform (Frontend Client)

WedPlan is a premier, role-based wedding planning platform designed to connect couples with high-end wedding venues, photographers, florists, caterers, and stylists.

## Important Features
- **Public Discovery & Exploration**:
  - Filter and browse wedding services across 6 core wedding categories (*Photography & Videography, Wedding Venues, Decoration & Florist, Catering Services, Makeup & Styling, Wedding Fashion*).
  - Real-time search by service name, category filtering, location filtering, and price sorting (Ascending / Descending).
  - Dynamic individual service pages (`/services/[id]`) with high-resolution image galleries, starting pricing, and vendor details.
- **Role-Based Authentication**:
  - Role selection at registration for both **Customer** and **Vendor** accounts.
  - Official Google OAuth 2.0 integration for seamless one-click authentication.
  - Role-based route protection: URL tampering across roles is blocked both on the client and with server-side JWT verification.
- **Vendor Dashboard**:
  - **Overview Metrics**: Total Services, Active/Approved Services, Pending Requests, Accepted Bookings, and Current Subscription Plan.
  - **Service Management (My Services)**: View service details, update services with live modal editing, delete services, view approval status (Pending/Approved/Rejected), and toggle service availability (Active/Inactive).
  - **Add Service**: Direct upload using ImgBB API or image URL, title, category, price, location, and description.
  - **Free vs. Premium Quota Rule**: Free tier vendors are limited to a maximum of 3 active services. Premium vendors enjoy unlimited active service publishing.
  - **Booking Requests Workflow**: Vendors review client inquiries (Customer name/email, event date, venue location, special message) and can **Accept** or **Reject** pending bookings.
  - **Stripe Subscription**: Upgrade to Premium for $49/year via Stripe Checkout.
- **Customer Dashboard**:
  - Track submitted inquiries, booking dates, locations, and vendor confirmations.
  - Ability to cancel pending requests before they are confirmed.
- **Admin Dashboard**:
  - Platform overview counters (Total Users, Vendors, Customers, Services, Pending Approvals, Transactions).
  - User Directory: Search users, filter by role, view account details, and block/unblock accounts.
  - Service Moderation Queue: Review, approve, reject, or delete services.
  - Platform Transactions: Audit all Stripe checkout subscription payments.
- **Design & UI/UX**:
  - Dark Mode and Light Mode support with an instant toggle switch in the navbar.
  - Styled with Tailwind CSS and ShadCN-inspired reusable UI components.
  - Smooth Framer Motion animations and interactive toast notifications.

## Technology Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & ShadCN Patterns
- **Authentication**: JWT & @react-oauth/google
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Stripe Checkout (Test Mode)

## Live Website Link
- **Frontend Application**: [https://wedplan-client-six.vercel.app](https://wedplan-client-six.vercel.app)
- **Backend API Server**: [https://wedplan-server-pi.vercel.app](https://wedplan-server-pi.vercel.app)

## Client and Server Repository Links
- **Client Repository**: [https://github.com/maisha6/wedplan-client](https://github.com/maisha6/wedplan-client)
- **Server Repository**: [https://github.com/maisha6/wedplan-server](https://github.com/maisha6/wedplan-server)

## Installation Instructions
1. Clone the client repository:
   ```bash
   git clone https://github.com/maisha6/wedplan-client.git
   cd wedplan-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run the Project Locally
1. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
2. Start the local Next.js development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Evaluation Test Accounts
Demo account credentials are available on request from the project owner. Please do not commit real credentials to this repository.
