/**
 * Migration script to migrate products from JSON to Cloudflare D1
 * Run this after setting up your D1 database
 * 
 * Usage:
 * 1. Create D1 database: wrangler d1 create peters-world-db
 * 2. Run schema: wrangler d1 execute peters-world-db --file=./db/schema.sql
 * 3. Run this migration: npx tsx scripts/migrate-to-d1.ts
 */

import products from '../data/products.json'

interface Product {
  id: string
  slug: string
  title: string
  priceCents: number
  currency: string
  category: string
  image: string
  images?: string[]
  description: string
  details?: string[]
  specs?: Record<string, string>
  shipping?: string
  available: boolean
}

function generateSQLInserts() {
  const statements: string[] = []

  for (const product of products as unknown as Product[]) {
    // Insert product
    statements.push(`
-- Product: ${product.title}
INSERT INTO products (id, slug, title, price_cents, currency, category, image, description, shipping, available)
VALUES (
  '${escapeSql(product.id)}',
  '${escapeSql(product.slug)}',
  '${escapeSql(product.title)}',
  ${product.priceCents},
  '${product.currency}',
  '${escapeSql(product.category)}',
  '${escapeSql(product.image)}',
  '${escapeSql(product.description)}',
  ${product.shipping ? `'${escapeSql(product.shipping)}'` : 'NULL'},
  ${product.available ? 1 : 0}
);`)

    // Insert details
    if (product.details && product.details.length > 0) {
      product.details.forEach((detail, index) => {
        statements.push(`
INSERT INTO product_details (product_id, detail, sort_order)
VALUES ('${escapeSql(product.id)}', '${escapeSql(detail)}', ${index});`)
      })
    }

    // Insert specs
    if (product.specs) {
      Object.entries(product.specs).forEach(([key, value]) => {
        statements.push(`
INSERT INTO product_specs (product_id, spec_key, spec_value)
VALUES ('${escapeSql(product.id)}', '${escapeSql(key)}', '${escapeSql(value)}');`)
      })
    }

    // Insert images
    if (product.images && product.images.length > 0) {
      product.images.forEach((image, index) => {
        statements.push(`
INSERT INTO product_images (product_id, image_url, sort_order)
VALUES ('${escapeSql(product.id)}', '${escapeSql(image)}', ${index});`)
      })
    }

    statements.push('') // Empty line for readability
  }

  return statements.join('\n')
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

// Generate and print SQL
const sql = generateSQLInserts()
console.log('-- Generated SQL for migrating products to D1')
console.log('-- Run with: wrangler d1 execute peters-world-db --file=./db/migrate-data.sql')
console.log('')
console.log(sql)

// Also save to file
import { writeFileSync } from 'fs'
import { join } from 'path'

const outputPath = join(process.cwd(), 'db', 'migrate-data.sql')
writeFileSync(outputPath, sql)
console.log(`\n✅ SQL written to ${outputPath}`)
console.log('\nTo migrate, run:')
console.log('wrangler d1 execute peters-world-db --file=./db/migrate-data.sql')

