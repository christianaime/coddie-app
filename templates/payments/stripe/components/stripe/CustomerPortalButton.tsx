'use client'

import { createCustomerPortalSessionAndRedirect } from '@/lib/stripe/actions'

interface CustomerPortalButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function CustomerPortalButton({
  className = "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors",
  children = "Manage Subscription"
}: CustomerPortalButtonProps) {
  const handlePortalAccess = async () => {
    try {
      await createCustomerPortalSessionAndRedirect()
    } catch (error) {
      console.error('Error accessing customer portal:', error)
      alert('Failed to access customer portal. Please try again.')
    }
  }

  return (
    <button
      onClick={handlePortalAccess}
      className={className}
    >
      {children}
    </button>
  )
}