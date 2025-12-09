# 🚀 Quick Start - Deploy Admin Panel

## Prerequisites

✅ You've already deployed the frontend (peters-world)  
✅ You have the database_id from the frontend deployment

If not, deploy the frontend first!

---

## Deploy in 3 Steps

### Step 1: Deploy Admin Panel

```bash
cd /Users/mariusjopen/Websites/Github/peters/peters-server
npm install
npm run pages:build
wrangler pages deploy
```

Choose project name: `peters-admin`

### Step 2: Configure Database

Edit `wrangler.toml` - uncomment and add your database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "peters-world-db"
database_id = "paste-your-database-id-here"
```

To find your database_id:
```bash
wrangler d1 list
```

### Step 3: Add Environment Variables

1. Go to https://dash.cloudflare.com
2. Click **Pages** → **peters-admin** → **Settings** → **Environment variables**
3. Add:

```
USE_D1 = true
```

Then redeploy:
```bash
npm run deploy
```

---

## Setup Authentication

### Option A: Cloudflare Access (Recommended)

1. Go to https://dash.cloudflare.com → **Zero Trust**
2. Click **Access** → **Applications** → **Add an application**
3. Select **Self-hosted**
4. Configure:
   - **Name**: Peters Admin
   - **Domain**: `peters-admin.pages.dev` (or your custom domain)
5. Add policy:
   - **Name**: Admins
   - **Action**: Allow
   - **Include**: Your email address
6. Click **Save**

Now when you visit your admin URL, you'll need to login! 🔐

**Detailed guide**: See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md)

### Option B: Simple Password (Testing Only)

For quick testing, add basic auth:

1. Create `_headers` file in build output
2. Add:
```
/*
  Basic-Auth: admin:your-password-here
```

Not recommended for production!

---

## Access Your Admin Panel

Visit: `https://peters-admin.pages.dev`

Or add a custom domain:
1. **Pages** → **peters-admin** → **Custom domains**
2. Add: `admin.yourdomain.com`

---

## What Can You Do?

✅ View all products  
✅ Add new products  
✅ Edit products  
✅ Delete products  
✅ Toggle product availability  
✅ View analytics (coming soon)

All changes are saved to the D1 database and appear on your shop instantly!

---

## Troubleshooting

### "Database not found"

Make sure you:
1. Added `database_id` in `wrangler.toml`
2. Set `USE_D1=true` in environment variables
3. Redeployed after changes

### Can't login

If using Cloudflare Access:
1. Check your email is in the Access policy
2. Clear browser cookies
3. Check Access logs in Zero Trust dashboard

### Changes don't appear

After editing `wrangler.toml` or environment variables, you must redeploy:
```bash
npm run deploy
```

---

## Next Steps

- [ ] Add custom domain for admin panel
- [ ] Setup Cloudflare Access with your team's emails
- [ ] Add more products via admin interface
- [ ] Setup Stripe webhooks for order tracking

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed configuration!

