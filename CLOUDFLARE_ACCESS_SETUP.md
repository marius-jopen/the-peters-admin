# Cloudflare Access Setup for Admin Panel

Cloudflare Access provides Zero Trust authentication for your admin panel without needing to build a custom auth system.

## What is Cloudflare Access?

Cloudflare Access is a Zero Trust security platform that:
- Protects your applications with authentication
- Works with Google, GitHub, email OTP, and more
- Free for up to 5 users (50 users on paid plan)
- No coding required - works at the network level

## Setup Steps

### 1. Enable Cloudflare Access

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Zero Trust** > **Access**
3. Click **Launch Zero Trust**

### 2. Create an Application

1. Go to **Access** > **Applications**
2. Click **Add an application**
3. Select **Self-hosted**

### 3. Configure Application

**Application Configuration:**
- **Application name**: `Peters Admin Panel`
- **Session Duration**: `24 hours` (or your preference)
- **Application domain**: 
  - Subdomain: `admin`
  - Domain: `your-domain.com`
  - Full URL: `https://admin.your-domain.com`

**Application Appearance (Optional):**
- App Launcher visibility: Hidden or Visible
- Custom logo: Upload if desired

### 4. Add Authentication Policy

Create a policy to control who can access the admin panel:

**Policy 1: Admin Users**
- **Policy name**: `Admin Access`
- **Action**: `Allow`
- **Session duration**: `24 hours`

**Include rules** (choose one or more):
- **Emails**: Add specific email addresses (e.g., `your@email.com`)
- **Email domains**: Add entire domains (e.g., `@yourcompany.com`)
- **GitHub**: Allow specific GitHub users/orgs
- **Google Workspace**: Allow users from your Google Workspace

**Example - Allow specific emails:**
```
Selector: Emails
Value: admin@example.com, owner@example.com
```

### 5. Configure Identity Providers

1. Go to **Settings** > **Authentication**
2. Click **Add new** under Login methods
3. Choose your preferred method:
   - **Google**: Easy for Gmail users
   - **GitHub**: Great for developers
   - **One-time PIN**: Email-based codes
   - **Microsoft Azure AD**: For enterprise
   
**For Google:**
1. Select Google
2. Click **Use Google Auth** (no setup needed)
3. Or configure custom Google OAuth if needed

**For GitHub:**
1. Select GitHub
2. Create a GitHub OAuth app
3. Add Client ID and Client Secret

### 6. Deploy Admin Panel to Cloudflare Pages

```bash
cd peters-server
npm run pages:build
wrangler pages deploy
```

Or connect via Git for auto-deployment:
1. Go to **Pages** in Cloudflare Dashboard
2. Click **Create a project**
3. Connect to GitHub
4. Select `peters-server` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`

### 7. Update DNS

If using a custom domain for admin:
1. Go to **DNS** in Cloudflare Dashboard
2. Add a CNAME record:
   - Type: `CNAME`
   - Name: `admin`
   - Target: `your-pages-project.pages.dev`
   - Proxy status: Proxied (orange cloud)

### 8. Test Access

1. Visit your admin panel URL (e.g., `https://admin.your-domain.com`)
2. You should be redirected to Cloudflare Access login
3. Choose your authentication method
4. After authentication, you'll be redirected to the admin panel

## Security Best Practices

1. **Use strong identity providers**: GitHub/Google are better than email OTP
2. **Limit access**: Only add emails/users who need admin access
3. **Enable MFA**: Require multi-factor authentication for identity providers
4. **Monitor access logs**: Check **Logs** > **Access** for login attempts
5. **Session duration**: Use shorter sessions (4-8 hours) for better security
6. **IP restrictions**: Add IP allow/block rules if needed

## Advanced Configuration

### Add Second Factor Authentication

1. In your Access policy, add a **Require** rule:
2. Select **Authentication Method**
3. Choose **Require MFA**

### IP Allowlist (Optional)

Add IP restrictions to only allow access from specific locations:

1. In your Access policy, add an **Include** rule
2. Select **IP ranges**
3. Add your office/home IP addresses

### Custom Login Page

1. Go to **Settings** > **Custom Pages**
2. Upload custom branding for the login page

## Troubleshooting

**Issue: "Access Denied" error**
- Check that your email is added to the Access policy
- Verify the policy action is "Allow"
- Check Access logs for details

**Issue: Not prompted for login**
- Ensure the Access application is enabled
- Check that the domain matches your deployment
- Clear browser cookies and try again

**Issue: 502 Bad Gateway**
- Your Pages deployment may not be ready
- Check Pages deployment status
- Verify build completed successfully

## Cost

- **Free tier**: Up to 5 users, 50 users on Free plan
- **Pro plan ($3/month)**: Unlimited users
- Perfect for small teams and solo developers

## Alternative: Simple Password Protection

If you prefer a simpler approach without Cloudflare Access, you can use Pages built-in basic auth:

1. Add `_headers` file to your build output:
```
/*
  X-Robots-Tag: noindex
  Basic-Auth: username:password
```

This provides basic password protection but is less secure than Cloudflare Access.

