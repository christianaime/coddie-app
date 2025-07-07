'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createCheckoutSession, createCustomerPortalSession, getCustomerByUserId } from '@/utils/stripe/stripe'
import { createClient } from '@/utils/supabase/server'

// Plan types that map to environment variables
type PlanType = 'pro-monthly' | 'pro-yearly'

const getPriceIdFromPlan = (planType: PlanType): string => {
  const priceIds = {
    'pro-monthly': process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    'pro-yearly': process.env.STRIPE_PRICE_ID_PRO_YEARLY,
  }

  const priceId = priceIds[planType]
  if (!priceId) {
    throw new Error(`Price ID not found for plan: ${planType}`)
  }

  return priceId
}

export async function createHostedCheckoutSessionAndRedirect(planType: PlanType): Promise<never> {
  const priceId = getPriceIdFromPlan(planType)
  const checkoutUrl = await createHostedCheckoutSessionAndGetUrl(priceId)
  redirect(checkoutUrl)
}

export async function createHostedCheckoutSessionAndGetUrl(priceId: string): Promise<string> {
  const headersList = await headers()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to make a purchase')
  }

  if (!user.email) {
    throw new Error('User does not have an email address')
  }

  // Use the same name extraction logic as AuthWrapper for consistency
  const customerName = user.user_metadata?.full_name ||
                      user.user_metadata?.given_name ||
                      user.user_metadata?.first_name ||
                      user.user_metadata?.name ||
                      undefined;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000";

  const origin = headersList.get('origin') || baseUrl
  const successUrl = `${origin}/return?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/settings`;

  const checkoutParams = {
    returnUrl: successUrl,
    cancelUrl: cancelUrl,
    email: user.email,
    userId: user.id,
    name: customerName,
    priceId: priceId,
  }

  const session = await createCheckoutSession(checkoutParams)

  if (!session.url) {
    throw new Error('Failed to generate Stripe checkout session URL')
  }

  return session.url
}

export async function createCustomerPortalSessionAndRedirect(): Promise<never> {
  const headersList = await headers()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to access the customer portal')
  }

  // Get Stripe customer
  const customer = await getCustomerByUserId(user.id)
  if (!customer) {
    throw new Error('No Stripe customer found for this user')
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000";

  const origin = headersList.get('origin') || baseUrl
  const returnUrl = `${origin}/settings`

  const session = await createCustomerPortalSession(customer.id, returnUrl)

  if (!session.url) {
    throw new Error('Failed to generate Stripe customer portal session URL')
  }

  redirect(session.url)
}