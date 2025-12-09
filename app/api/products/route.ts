import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, upsertProduct } from '@/lib/db'

export const runtime = 'edge'

// GET all products
export async function GET() {
  try {
    // @ts-ignore - Cloudflare env will be available in production
    const products = await getAllProducts(process.env)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    
    // @ts-ignore - Cloudflare env will be available in production
    await upsertProduct(product, process.env)
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT update existing product
export async function PUT(request: NextRequest) {
  try {
    const product = await request.json()
    
    // @ts-ignore - Cloudflare env will be available in production
    await upsertProduct(product, process.env)
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

