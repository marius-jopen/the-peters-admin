import Link from 'next/link'
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 mt-2">Sales and performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Revenue</span>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold">€0.00</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Orders</span>
              <ShoppingCart className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Customers</span>
              <Users className="text-purple-600" size={20} />
            </div>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">Total customers</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Conversion</span>
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Analytics Coming Soon
          </h2>
          <p className="text-blue-800">
            Integrate with Stripe webhooks to track sales, orders, and customer data.
          </p>
        </div>
      </div>
    </div>
  )
}

