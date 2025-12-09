#!/bin/bash

# Upload existing product images to Cloudflare R2
# Run this script to migrate images from /public/products/ to R2

echo "🖼️  Uploading product images to R2..."
echo ""

# Upload each product image
wrangler r2 object put product-images/calendar-2024-2025.png --file=public/products/calendar-2024-2025.png
wrangler r2 object put product-images/calendar-2026.jpg --file=public/products/calendar-2026.jpg
wrangler r2 object put product-images/calendar-2026-slide-1.jpg --file=public/products/calendar-2026-slide-1.jpg
wrangler r2 object put product-images/calendar-2026-slide-2.jpg --file=public/products/calendar-2026-slide-2.jpg
wrangler r2 object put product-images/calendar-2026-slide-3.jpg --file=public/products/calendar-2026-slide-3.jpg

wrangler r2 object put product-images/pillow-1.jpg --file=public/products/pillow-1.jpg
wrangler r2 object put product-images/pillow-2.jpg --file=public/products/pillow-2.jpg
wrangler r2 object put product-images/pillow-3.png --file=public/products/pillow-3.png

wrangler r2 object put product-images/postcard-set-1.jpg --file=public/products/postcard-set-1.jpg
wrangler r2 object put product-images/postcard-set-2.jpg --file=public/products/postcard-set-2.jpg

wrangler r2 object put product-images/poster.jpg --file=public/products/poster.jpg

wrangler r2 object put product-images/original-1.jpg --file=public/products/original-1.jpg
wrangler r2 object put product-images/original-2.jpg --file=public/products/original-2.jpg

echo ""
echo "✅ All product images uploaded to R2!"
echo ""
echo "Images are now at:"
echo "https://product-images.your-account.r2.cloudflarestorage.com/filename"
echo ""
echo "Or serve via your app:"
echo "https://the-peters-world.pages.dev/api/images/filename"

