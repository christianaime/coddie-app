# Stripe Payments Integration

This template includes comprehensive Stripe payments integration for your Next.js app with subscription management.

## Environment Setup

1. Copy the environment variables from `env.stripe.example` to your `.env.local` file:
   ```bash
   cp env.stripe.example .env.local
   ```

2. Get your Stripe keys from the [Stripe Dashboard](https://dashboard.stripe.com/):
   - `STRIPE_PUBLISHABLE_KEY`: Found in Developers > API keys (starts with `pk_`)
   - `STRIPE_SECRET_KEY`: Found in Developers > API keys (starts with `sk_`)
   - `STRIPE_WEBHOOK_SECRET`: Created when setting up webhook endpoint (starts with `whsec_`)

3. Create products and prices in Stripe Dashboard:
   - Go to Products in your Stripe Dashboard
   - Create products for your subscription plans
   - Copy the Price IDs to your environment variables

## What's Included

### Server Actions
- `createHostedCheckoutSessionAndRedirect()` - Redirect users to Stripe Checkout
- `createCustomerPortalSessionAndRedirect()` - Access Stripe Customer Portal
- `createHostedCheckoutSessionAndGetUrl()` - Get checkout URL without redirect

### Components
- `PricingCards` - Display subscription plans with checkout buttons
- `CustomerPortalButton` - Button to access subscription management

### API Routes
- `/api/stripe/webhook` - Handle Stripe webhook events automatically

### Pages
- `/return` - Success page after payment completion

### Utilities
- `stripe.ts` - Core Stripe functionality and session management

## Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret to your environment variables

## Usage Examples

### Basic Subscription Checkout
```tsx
import { createHostedCheckoutSessionAndRedirect } from '@/lib/stripe/actions'

function SubscribeButton() {
  const handleSubscribe = async () => {
    await createHostedCheckoutSessionAndRedirect('pro-monthly')
  }

  return <button onClick={handleSubscribe}>Subscribe</button>
}
```

### Pricing Cards Component
```tsx
import PricingCards from '@/components/stripe/PricingCards'

export default function PricingPage() {
  return (
    <div>
      <h1>Choose Your Plan</h1>
      <PricingCards />
    </div>
  )
}
```

### Customer Portal Access
```tsx
import CustomerPortalButton from '@/components/stripe/CustomerPortalButton'

export default function SettingsPage() {
  return (
    <div>
      <h2>Subscription Management</h2>
      <CustomerPortalButton />
    </div>
  )
}
```

## Database Integration

The webhook handlers assume you have a `profiles` table with these columns:
- `id` (matches user ID from auth)
- `stripe_customer_id`
- `subscription_id`
- `subscription_status`
- `subscription_plan`
- `updated_at`

Example SQL for Supabase:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  stripe_customer_id TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  subscription_plan TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Testing

1. Use Stripe's test mode for development
2. Use test card numbers from [Stripe's documentation](https://stripe.com/docs/testing)
3. Test successful payment: `4242424242424242`
4. Test failed payment: `4000000000000002`

## Security Notes

- Never expose your secret key in client-side code
- Always validate webhook signatures
- Use HTTPS in production
- Store sensitive data server-side only

## Subscription Features

- **Automatic billing** - Stripe handles recurring payments
- **Prorated upgrades** - Users can change plans anytime
- **Failed payment handling** - Automatic retry logic
- **Customer portal** - Self-service subscription management
- **Webhooks** - Real-time event processing

## Going Live

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint with production URL
4. Test with real payment methods
5. Set up monitoring and alerts

## Troubleshooting

**Webhook not receiving events:**
- Check webhook URL is publicly accessible
- Verify webhook secret matches environment variable
- Check Stripe Dashboard for delivery attempts

**Payment not completing:**
- Check browser console for errors
- Verify all environment variables are set
- Test with different cards/browsers

**Customer portal not working:**
- Ensure customer exists in Stripe
- Check user is authenticated
- Verify customer portal is enabled in Stripe settings

## Documentation

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Customer Portal Guide](https://stripe.com/docs/billing/subscriptions/customer-portal)