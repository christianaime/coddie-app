<div align="center">
  <img src="/assets/coddie-logo.svg" alt="Coddie CLI Demo" width="800"/>

  # 🚀 Coddie CLI

  ### The fastest way to scaffold production-ready Next.js apps

  [![npm version](https://badge.fury.io/js/coddie-command.svg)](https://www.npmjs.com/package/coddie-command)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  **Stop wasting hours. Start building your ideas and ship fast**

  [Getting Started](#-getting-started) • [Features](#-features) • [Examples](#-examples)
</div>

---

## Getting Started

```bash
npx coddie-create-app my-awesome-app
```
That's it! In under 2 minutes, you'll have a production-ready Next.js app with authentication, payments, monitoring, and more as boilerplate

## What You Get
**Authentication Ready**
- Supabase Auth with social providers
- Clerk authentication with beautiful components
- Pre-built login/signup pages and middleware

**Payment Integration**
- Stripe checkout and customer portal
- Webhook handling and subscription management
- Ready-to-use pricing components

**Beautiful UI**
- ShadCN UI components pre-configured
- Tailwind CSS with custom design system
- Responsive and accessible by default

**Production Monitoring**
- Sentry error tracking and performance monitoring
- Real-time error alerts and session replay
- Production-ready observability

**Developer Experience**
- TypeScript configured with strict mode
- ESLint and Prettier for code quality
- Editor-specific configs (VS Code, Cursor, Windsurf)
- Git best practices and workflows

## Features
**Authentication Options**
- Supabase Auth: Email, OAuth (Google, GitHub, etc.), Magic Links
- Clerk: Social logins, magic links, phone verification
- None: Skip auth for simple projects

**Payment Processing**
- Stripe Integration: Subscriptions, one-time payments, customer portal
- Webhook handling for secure payment processing
- Pre-built pricing page components

**UI & Styling**
- ShadCN UI: Modern, accessible component library
- Tailwind CSS: Utility-first styling
- Dark/Light Mode: Built-in theme switching

**Monitoring & Analytics**
- Sentry: Error tracking, performance monitoring, session replay
- Production-ready observability setup

**Editor Configurations**
- Get full rules to guide you when coding. Just between Cursor, VS Code and Windsurf as your editor.

## Interactive Setup
```bash
npx coddie-create-app
```
The CLI will guide you through:

- Project name and location
- Authentication provider (Supabase, Clerk, or None)
- UI components (ShadCN UI)
- Error monitoring (Sentry)
- Payment processing (Stripe)
- Editor configuration (VS Code, Cursor, Windsurf)

## 🚀 Examples
### Quick Start
```bash
# Create a simple blog
npx coddie-create-app my-blog

# Create a SaaS app with auth and payments
npx coddie-create-app my-saas --next
```
### What's Generated
```
my-app/
├── app/
│   ├── (auth)/           # Auth pages and layout
│   ├── dashboard/        # Protected dashboard
│   ├── api/             # API routes (webhooks, etc.)
│   └── page.tsx         # Landing page
├── components/
│   ├── auth/            # Authentication components
│   ├── ui/              # ShadCN UI components
│   └── stripe/          # Payment components
├── lib/
│   ├── auth/            # Auth utilities
│   └── stripe/          # Payment utilities
├── .env.example         # Environment variables template
├── middleware.ts        # Auth and routing middleware
└── README.md           # Service-specific setup guides
```

## 📦 Installation
### One-time Use
```bash
npx coddie-create-app my-app
```

## 🔧 Configuration
After creation, follow the generated setup guides:

- **Environment Variables**: Copy `.env.example` to `.env.local`
- **Authentication**: Follow `README.supabase.md` or `README.clerk.md`
- **Payments**: Follow `README.stripe.md` for Stripe setup
- **Monitoring**: Sentry will be configured automatically

## What Next?
- Now you have a boilerplate to start building your app. You now have to start building your app. Do so by going to https://app.coddie.dev and just describe what you want to build. Coddie will give you production ready plans and project rules tailored to your app. This is the best way to start building your app and ship your SAAS fast.

### Development Setup
```bash
git clone https://github.com/yourusername/coddie-command.git
cd coddie-command
npm install
npm run dev
```

## 📄 License
MIT © Coddie

<div align="center">
  <p>Christian @ Coddie</p>
  <p>
    <a href="https://github.com/christianaime">Star on GitHub</a>
    <a href="https://x.com/_ChristianAime">Follow on X</a>
  </p>
</div>