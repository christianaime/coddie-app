import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export interface CheckoutSessionParams {
  returnUrl: string
  cancelUrl: string
  email: string
  userId: string
  name?: string
  priceId: string
}

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const { returnUrl, cancelUrl, email, userId, name, priceId } = params

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: returnUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    client_reference_id: userId,
    metadata: {
      userId: userId,
    },
    // Optionally create customer with name
    ...(name && {
      customer_creation: 'always' as const,
      customer_update: {
        name: 'auto' as const,
      },
    }),
    // Enable customer portal access
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    automatic_tax: {
      enabled: true,
    },
  })

  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getCustomerByUserId(userId: string): Promise<Stripe.Customer | null> {
  const customers = await stripe.customers.list({
    limit: 1,
    metadata: {
      userId: userId,
    },
  })

  return customers.data.length > 0 ? customers.data[0] : null
}

export async function getSubscriptionsByCustomerId(customerId: string): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  })

  return subscriptions.data
}

export { stripe }