'use client'

import { createHostedCheckoutSessionAndRedirect } from '@/lib/stripe/actions'

const plans = [
  {
    name: 'Pro Monthly',
    price: '$29',
    interval: 'month',
    planType: 'pro-monthly' as const,
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
  },
  {
    name: 'Pro Yearly',
    price: '$290',
    interval: 'year',
    planType: 'pro-yearly' as const,
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      '2 months free',
    ],
    popular: true,
  },
]

export default function PricingCards() {
  const handleSubscribe = async (planType: 'pro-monthly' | 'pro-yearly') => {
    try {
      await createHostedCheckoutSessionAndRedirect(planType)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">
          Start your subscription and unlock all features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.planType}
            className={`relative bg-white rounded-lg shadow-lg p-6 ${
              plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.interval}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.planType)}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              }`}
            >
              Subscribe to {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}