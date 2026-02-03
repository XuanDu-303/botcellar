# Botcellar

A full-featured e-commerce platform built with Next.js 15 and MongoDB.

## Features

- **Authentication** — Email/password and Google OAuth via NextAuth v5
- **Product Catalog** — Browse, search, and filter products with Elasticsearch
- **Shopping Cart** — Persistent cart with quantity management
- **Checkout** — Stripe and PayPal payment integration
- **Order Management** — Track orders with status updates
- **User Accounts** — Profile management, order history, browsing history
- **Admin Dashboard** — Manage products, orders, users, and web pages
- **AI Chatbot** — Customer support via Google Dialogflow
- **Internationalization** — English (US) and Vietnamese support
- **Email Notifications** — Transactional emails via Resend
- **Image Uploads** — Product images via Uploadthing
- **Reviews** — Product ratings and reviews

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Search | Elasticsearch |
| Auth | NextAuth v5 (Auth.js) |
| Styling | Tailwind CSS v4 + Radix UI |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Payments | Stripe, PayPal |
| Email | Resend + React Email |
| Uploads | Uploadthing |
| AI | Google Dialogflow |
| i18n | next-intl |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Elasticsearch instance (local or cloud)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd botcellar

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# App
NEXT_PUBLIC_APP_NAME=Botcellar
NEXT_PUBLIC_APP_SLOGAN=Spend less, enjoy more.
NEXT_PUBLIC_APP_DESCRIPTION=An e-commerce platform built with Next.js and MongoDB

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_APP_SECRET=your_paypal_app_secret

# Email
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=your_sender_email
SENDER_NAME=support

# Uploads
UPLOADTHING_TOKEN=your_uploadthing_token

# Search
ELASTICSEARCH_NODE=your_elasticsearch_url
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key

# Chatbot
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
DIALOGFLOW_SERVICE_ACCOUNT_JSON=your_dialogflow_service_account_json
```

### Development

```bash
# Run the development server
npm run dev

# Seed the database
npm run seed

# Index products in Elasticsearch
npm run es:index

# Preview emails
npm run email
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Stripe Webhooks (Local)

To test Stripe webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Project Structure

```
botcellar/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── (auth)/         # Auth pages (sign-in, sign-up, etc.)
│   │   ├── (home)/         # Home page
│   │   ├── (root)/         # Main pages (cart, product, search, account)
│   │   └── admin/          # Admin dashboard
│   └── api/                # API routes
├── components/
│   ├── shared/             # Shared components
│   └── ui/                 # UI primitives (shadcn/ui)
├── lib/
│   ├── actions/            # Server actions
│   ├── db/                 # Database models and connection
│   ├── dialogflow/         # Chatbot integration
│   ├── elastic/            # Elasticsearch client
│   └── scripts/            # Utility scripts
├── messages/               # i18n translation files
├── emails/                 # Email templates
└── public/                 # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database |
| `npm run es:index` | Index all products in Elasticsearch |
| `npm run email` | Preview email templates |

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## License

MIT
