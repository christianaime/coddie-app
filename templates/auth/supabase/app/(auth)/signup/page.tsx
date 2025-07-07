import { Suspense } from 'react'
import SignupForm from '@/components/auth/SignupForm'

function SignupMessage({ searchParams }: { searchParams: { message?: string } }) {
  if (!searchParams.message) return null

  const isError = searchParams.message.includes('Error') || searchParams.message.includes('Invalid')

  return (
    <div className={`max-w-md mx-auto mb-4 p-4 border rounded-md ${
      isError
        ? 'bg-red-50 border-red-200'
        : 'bg-green-50 border-green-200'
    }`}>
      <p className={`text-sm ${
        isError ? 'text-red-700' : 'text-green-700'
      }`}>
        {searchParams.message}
      </p>
    </div>
  )
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Get started with your free account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <SignupMessage searchParams={searchParams} />
        </Suspense>
        <SignupForm />
      </div>
    </div>
  )
}