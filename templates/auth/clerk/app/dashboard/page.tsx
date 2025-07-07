import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Profile Information</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-600">Name:</span>{' '}
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Email:</span>{' '}
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">User ID:</span>{' '}
                {user?.id}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Joined:</span>{' '}
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Update Profile
              </button>
              <button className="w-full text-left px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                View Settings
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                Manage Account
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-blue-600">Active Sessions</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-green-600">Account Security</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {user?.emailAddresses?.length || 0}
              </div>
              <div className="text-sm text-purple-600">Email Addresses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}