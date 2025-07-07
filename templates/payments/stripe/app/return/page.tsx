import { redirect } from 'next/navigation'
import { stripe } from '@/utils/stripe/stripe'

interface ReturnPageProps {
  searchParams: {
    session_id?: string
  }
}

export default async function ReturnPage({ searchParams }: ReturnPageProps) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect('/')
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
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
            </div>

            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Payment Successful!
            </h1>

            <p className="text-green-700 mb-6">
              Thank you for your subscription. Your account has been activated and you now have access to all pro features.
            </p>

            <div className="bg-white border border-green-200 rounded-md p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600">
                Session ID: {session.id}
              </p>
              <p className="text-sm text-gray-600">
                Amount: ${(session.amount_total! / 100).toFixed(2)} {session.currency?.toUpperCase()}
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/dashboard"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Go to Dashboard
              </a>

              <div>
                <a
                  href="/settings"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Manage Subscription
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-yellow-800 mb-4">
              Payment Pending
            </h1>

            <p className="text-yellow-700 mb-6">
              Your payment is being processed. You'll receive a confirmation email once it's complete.
            </p>

            <a
              href="/"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      )
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)

    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Something went wrong
          </h1>

          <p className="text-red-700 mb-6">
            We couldn't verify your payment. Please contact support if you think this is an error.
          </p>

          <a
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }
}