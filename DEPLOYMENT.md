# Deployment Guide - Peters Admin Panel (Backend)

Complete guide to deploying your admin panel to Cloudflare Pages with authentication.

## 📋 Prerequisites

- Cloudflare account (free tier works)
- Admin panel code in `peters-server` directory
- D1 database already set up from frontend deployment
- Git repository

## 🚀 Deployment Steps

### 1. Build and Deploy

```bash
cd peters-server
wrangler login
npm run pages:build
wrangler pages deploy
```

Choose a project name like `peters-admin`.

### 2. Configure D1 Database Binding

The admin panel uses the SAME database as the frontend.

Update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "peters-world-db"
database_id = "your-database-id-from-frontend"
```

### 3. Set Environment Variables

In Cloudflare Dashboard:
1. Go to **Pages** > **peters-admin** > **Settings** > **Environment variables**

Add:
```
USE_D1=true
```

### 4. Setup Authentication

Choose one of the following methods:

#### Option A: Cloudflare Access (Recommended)

See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md) for detailed instructions.

**Quick setup:**
1. Go to **Zero Trust** > **Access** > **Applications**
2. Click **Add an application** > **Self-hosted**
3. Configure:
   - Application name: `Peters Admin`
   - Domain: `admin.yourdomain.com` (or `peters-admin.pages.dev`)
4. Add policy:
   - Name: `Admin Users`
   - Action: `Allow`
   - Include: Your email address
5. Save and test

#### Option B: Simple Password Protection

For testing only, add a `_headers` file:

```bash
echo "/*
  X-Robots-Tag: noindex
  Basic-Auth: admin:your-secure-password-here" > _headers
```

Then redeploy. This provides basic HTTP auth.

### 5. Custom Domain (Optional)

1. Go to **Pages** > **peters-admin** > **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `admin.yourdomain.com`
4. DNS will be configured automatically if on Cloudflare

### 6. Redeploy with Database Binding

```bash
npm run deploy
```

## 🔐 Access Control

### Add/Remove Admin Users

With Cloudflare Access:

1. Go to **Zero Trust** > **Access** > **Applications**
2. Click your admin application
3. Edit the policy
4. Add/remove emails under **Include** rules

### Monitor Access

View login attempts:
- **Zero Trust** > **Logs** > **Access**

## 🛠️ Managing Products

### Via Admin Panel (Recommended)

1. Login to `https://admin.yourdomain.com`
2. Navigate to **Products**
3. Click **Add Product** or edit existing products
4. Changes are saved directly to D1 database
5. Frontend updates automatically

### Via Wrangler CLI

```bash
# Add a product via SQL
wrangler d1 execute peters-world-db --command="
INSERT INTO products (id, slug, title, price_cents, currency, category, image, description, available)
VALUES ('new-product', 'new-product-slug', 'New Product', 1999, 'EUR', 'category', '/products/image.jpg', 'Description', 1)
" --remote

# Update a product
wrangler d1 execute peters-world-db --command="
UPDATE products SET price_cents = 2499 WHERE id = 'new-product'
" --remote

# Delete a product
wrangler d1 execute peters-world-db --command="
DELETE FROM products WHERE id = 'new-product'
" --remote
```

## 📊 Database Operations

### View All Products

```bash
wrangler d1 execute peters-world-db --command="SELECT id, title, price_cents, available FROM products" --remote
```

### Backup Database

```bash
# Full backup
wrangler d1 export peters-world-db --output=backup.sql --remote
```

### Restore Database

```bash
wrangler d1 execute peters-world-db --file=backup.sql --remote
```

## 🔄 Git Integration (Auto-Deploy)

### Setup

1. Go to **Pages** > **peters-admin**
2. Click **Settings** > **Builds & deployments**
3. Click **Connect to Git**
4. Select your repository and `peters-server` directory
5. Configure:
   - **Production branch**: `main`
   - **Build command**: `npm run pages:build`
   - **Build output**: `.vercel/output/static`
   - **Root directory**: `peters-server` (if in monorepo)

### Auto-Deploy

Now every push to main will automatically rebuild and deploy:

```bash
git add .
git commit -m "Update admin panel"
git push origin main
```

## 🐛 Troubleshooting

### Cannot Login

**Issue**: Redirected but can't access admin
- Check Cloudflare Access policy includes your email
- Clear browser cookies
- Check Access logs in Zero Trust dashboard

**Issue**: "Unauthorized" error
- Verify Cloudflare Access is enabled
- Check middleware.ts is deployed
- Try incognito mode

### Database Errors

**Issue**: "Database not found"
- Verify `database_id` in wrangler.toml matches frontend
- Check D1 binding is configured
- Redeploy after updating wrangler.toml

**Issue**: "Failed to fetch products"
- Ensure `USE_D1=true` in environment variables
- Check database has data
- Verify API routes are working

### Build Errors

**Issue**: Build fails on deployment
- Run `npm install` locally first
- Check Node version (should be 20+)
- Clear build cache in Cloudflare Dashboard

## 🎨 Customization

### Change Branding

Edit `app/page.tsx` and other pages to customize:
- Colors and styles (in Tailwind classes)
- Logo and branding
- Navigation structure

### Add Features

The admin panel is built with Next.js 15 and can be extended:

- Add user management
- Add order tracking
- Integrate Stripe webhooks
- Add analytics dashboards
- Image upload to R2

## 🔒 Security Best Practices

1. **Always use Cloudflare Access** - Don't rely on basic auth in production
2. **Enable MFA** - Require multi-factor authentication for admins
3. **Audit logs** - Regularly check Access logs
4. **Limit access** - Only add users who need admin access
5. **Use production keys** - Separate Stripe keys for prod/dev

## 💡 Tips

### Development

Run locally:
```bash
npm run dev
```

Admin panel runs on `http://localhost:3001` (port 3001 to avoid conflict with frontend on 3000).

### Testing Changes

Deploy to preview environment first:
```bash
wrangler pages deploy --branch=preview
```

### Environment Variables

For local development, create `.dev.vars`:
```
USE_D1=false
```

This uses JSON fallback instead of D1 locally.

## 📈 Monitoring

### Function Logs

View real-time logs:
```bash
wrangler pages deployment tail --project-name=peters-admin
```

### Analytics

Check usage:
- **Pages** > **peters-admin** > **Analytics**

## 💰 Costs

- **Cloudflare Pages**: Free (500 builds/month)
- **Cloudflare Access**: Free (up to 5 users)
- **D1 Database**: Free tier (shared with frontend)

**Total: FREE!** 🎉

## 🆘 Support

- See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md) for auth help
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)

