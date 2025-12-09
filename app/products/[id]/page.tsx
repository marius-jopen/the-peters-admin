import Link from 'next/link'
import { ProductForm } from '@/components/ProductForm'

export const runtime = 'edge'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // TODO: Fetch product from database
  // For now, using mock data
  const isNew = id === 'new'

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>

        <ProductForm productId={isNew ? undefined : id} />
      </div>
    </div>
  )
}

