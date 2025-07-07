'use client'

import { useUser, UserButton } from '@clerk/nextjs'

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <a
          href="/sign-in"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign In
        </a>
        <a
          href="/sign-up"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!
      </span>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8"
          }
        }}
      />
    </div>
  )
}