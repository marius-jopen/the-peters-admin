import Link from 'next/link'
import { Package, Settings, BarChart } from 'lucide-react'

export default function AdminHome() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Peter's World Admin</h1>
          <p className="text-gray-600">Manage your shop and products</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products Card */}
          <Link
            href="/products"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-12 h-12 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">3</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600 text-sm">
              Manage your product catalog, prices, and availability
            </p>
          </Link>

          {/* Settings Card */}
          <Link
            href="/settings"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 text-sm">
              Configure shop settings and integrations
            </p>
          </Link>

          {/* Analytics Card */}
          <Link
            href="/analytics"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600 text-sm">
              View sales data and performance metrics
            </p>
          </Link>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Quick Start</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Connect your Cloudflare D1 database to manage products</li>
            <li>• Configure authentication in Cloudflare Access</li>
            <li>• Deploy to Cloudflare Pages for instant updates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

