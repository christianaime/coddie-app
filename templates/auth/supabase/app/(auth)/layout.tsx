import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create an account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Optional: Add a header with logo/branding */}
      <div className="absolute top-0 left-0 p-6">
        <div className="flex items-center">
          {/* Replace with your logo */}
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-900">
            Coddie App
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex min-h-screen">
        {/* Left side - Optional decorative content */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Coddie App
            </h1>
            <p className="text-lg text-gray-600">
              Build amazing applications with our powerful platform.
              Get started in minutes with authentication, database, and more.
            </p>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </main>

      {/* Optional: Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <p className="text-sm text-gray-500">
          © 2024 Coddie App. All rights reserved.
        </p>
      </div>
    </div>
  )
}