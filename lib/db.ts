// Database helper functions for Cloudflare D1
// This will work both with local JSON (development) and D1 (production)

import type { Product } from '@/types'

// For now, we'll use JSON in development
// This will be updated to use D1 in production
const USE_DATABASE = process.env.USE_D1 === 'true'

// Type for D1 database binding
export interface Env {
  DB?: D1Database
}

/**
 * Get all products from database or JSON fallback
 */
export async function getAllProducts(env?: Env): Promise<Product[]> {
  if (USE_DATABASE && env?.DB) {
    return getProductsFromD1(env.DB)
  }
  
  // Fallback to JSON file
  const products = await import('@/data/products.json')
  return products.default as unknown as Product[]
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string, env?: Env): Promise<Product | null> {
  if (USE_DATABASE && env?.DB) {
    return getProductFromD1BySlug(slug, env.DB)
  }
  
  // Fallback to JSON file
  const products = await import('@/data/products.json')
  const product = (products.default as unknown as Product[]).find(p => p.slug === slug)
  return product || null
}

/**
 * Get products from D1 database
 */
async function getProductsFromD1(db: D1Database): Promise<Product[]> {
  const { results: products } = await db
    .prepare('SELECT * FROM products WHERE available = 1 ORDER BY created_at DESC')
    .all()

  if (!products || products.length === 0) {
    return []
  }

  // Fetch related data for each product
  const productsWithDetails = await Promise.all(
    products.map(async (product: any) => {
      const [details, specs, images] = await Promise.all([
        db.prepare('SELECT detail FROM product_details WHERE product_id = ? ORDER BY sort_order')
          .bind(product.id)
          .all(),
        db.prepare('SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?')
          .bind(product.id)
          .all(),
        db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order')
          .bind(product.id)
          .all(),
      ])

      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        priceCents: product.price_cents,
        currency: product.currency,
        category: product.category,
        image: product.image,
        images: images.results?.map((img: any) => img.image_url) || [],
        description: product.description,
        details: details.results?.map((d: any) => d.detail) || [],
        specs: specs.results?.reduce((acc: any, spec: any) => {
          acc[spec.spec_key] = spec.spec_value
          return acc
        }, {}) || {},
        shipping: product.shipping,
        available: product.available === 1,
      }
    })
  )

  return productsWithDetails
}

/**
 * Get a single product from D1 by slug
 */
async function getProductFromD1BySlug(slug: string, db: D1Database): Promise<Product | null> {
  const product: any = await db
    .prepare('SELECT * FROM products WHERE slug = ? AND available = 1 LIMIT 1')
    .bind(slug)
    .first()

  if (!product) {
    return null
  }

  const [details, specs, images] = await Promise.all([
    db.prepare('SELECT detail FROM product_details WHERE product_id = ? ORDER BY sort_order')
      .bind(product.id)
      .all(),
    db.prepare('SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?')
      .bind(product.id)
      .all(),
    db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order')
      .bind(product.id)
      .all(),
  ])

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    priceCents: product.price_cents,
    currency: product.currency,
    category: product.category,
    image: product.image,
    images: images.results?.map((img: any) => img.image_url) || [],
    description: product.description,
    details: details.results?.map((d: any) => d.detail) || [],
    specs: specs.results?.reduce((acc: any, spec: any) => {
      acc[spec.spec_key] = spec.spec_value
      return acc
    }, {}) || {},
    shipping: product.shipping,
    available: product.available === 1,
  }
}

/**
 * Create or update a product (for admin panel)
 */
export async function upsertProduct(product: Product, env: Env): Promise<void> {
  if (!env.DB) {
    throw new Error('Database not available')
  }

  const db = env.DB

  // Start a transaction by running multiple statements
  // Delete existing related data
  await db.prepare('DELETE FROM product_details WHERE product_id = ?').bind(product.id).run()
  await db.prepare('DELETE FROM product_specs WHERE product_id = ?').bind(product.id).run()
  await db.prepare('DELETE FROM product_images WHERE product_id = ?').bind(product.id).run()

  // Insert or update the product
  await db
    .prepare(`
      INSERT INTO products (id, slug, title, price_cents, currency, category, image, description, shipping, available, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        slug = excluded.slug,
        title = excluded.title,
        price_cents = excluded.price_cents,
        currency = excluded.currency,
        category = excluded.category,
        image = excluded.image,
        description = excluded.description,
        shipping = excluded.shipping,
        available = excluded.available,
        updated_at = CURRENT_TIMESTAMP
    `)
    .bind(
      product.id,
      product.slug,
      product.title,
      product.priceCents,
      product.currency,
      product.category,
      product.image,
      product.description,
      product.shipping || null,
      product.available ? 1 : 0
    )
    .run()

  // Insert details
  if (product.details && product.details.length > 0) {
    for (let i = 0; i < product.details.length; i++) {
      await db
        .prepare('INSERT INTO product_details (product_id, detail, sort_order) VALUES (?, ?, ?)')
        .bind(product.id, product.details[i], i)
        .run()
    }
  }

  // Insert specs
  if (product.specs) {
    for (const [key, value] of Object.entries(product.specs)) {
      await db
        .prepare('INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?)')
        .bind(product.id, key, value)
        .run()
    }
  }

  // Insert images
  if (product.images && product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      await db
        .prepare('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)')
        .bind(product.id, product.images[i], i)
        .run()
    }
  }
}

/**
 * Delete a product (for admin panel)
 */
export async function deleteProduct(productId: string, env: Env): Promise<void> {
  if (!env.DB) {
    throw new Error('Database not available')
  }

  await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(productId).run()
  // Related data will be deleted automatically due to CASCADE
}

