import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

function LoginMessage({ searchParams }: { searchParams: { message?: string } }) {
  if (!searchParams.message) return null

  return (
    <div className="max-w-md mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-700 text-sm">{searchParams.message}</p>
    </div>
  )
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginMessage searchParams={searchParams} />
        </Suspense>
        <LoginForm />
      </div>
    </div>
  )
}