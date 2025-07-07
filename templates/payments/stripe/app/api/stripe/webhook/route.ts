import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/utils/stripe/stripe'
import { createClient } from '@/utils/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)

  // Get user ID from metadata
  const userId = session.metadata?.userId || session.client_reference_id
  if (!userId) {
    console.error('No user ID found in checkout session')
    return
  }

  // Update user's subscription status in your database
  const supabase = createClient()

  // Example: Update user profile with subscription info
  const { error } = await supabase
    .from('profiles')
    .update({
      stripe_customer_id: session.customer,
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user profile:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)

  // Get customer and find user
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer

  if (customer.metadata?.userId) {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_plan: subscription.items.data[0]?.price.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.metadata.userId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)

  // Similar to created, but handle status changes
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer

  if (customer.metadata?.userId) {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        subscription_plan: subscription.items.data[0]?.price.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.metadata.userId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer

  if (customer.metadata?.userId) {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.metadata.userId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id)

  // Handle successful recurring payments
  if (invoice.subscription) {
    // Update payment history or send confirmation email
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)

  // Handle failed payments - send notification, update status, etc.
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer

    if (customer.metadata?.userId) {
      // You might want to send an email or update the user's status
      console.log(`Payment failed for user: ${customer.metadata.userId}`)
    }
  }
}