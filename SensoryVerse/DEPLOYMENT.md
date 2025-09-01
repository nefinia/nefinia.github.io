# SensoryVerse Deployment Guide

This guide covers various deployment options for the SensoryVerse platform, from local development to production hosting.

## Quick Start

### Local Development
```bash
# Navigate to SensoryVerse directory
cd SensoryVerse

# Option 1: Python HTTP Server
python3 -m http.server 8080

# Option 2: Node.js HTTP Server
npx http-server -p 8080 -c-1

# Option 3: PHP Built-in Server
php -S localhost:8080

# Access at http://localhost:8080
```

## Production Deployment Options

### 1. GitHub Pages (Free)

**Pros**: Free hosting, automatic SSL, GitHub integration  
**Cons**: Static sites only, limited customization

```bash
# If using this repository structure:
# 1. Enable GitHub Pages in repository settings
# 2. Set source to main branch / SensoryVerse folder
# 3. Access at: https://yourusername.github.io/repository-name/SensoryVerse/
```

### 2. Netlify (Recommended)

**Pros**: Easy deployment, CDN, form handling, serverless functions  
**Cons**: Free tier limitations

```bash
# Method 1: Drag & Drop
# 1. Zip the SensoryVerse folder
# 2. Drag to netlify.com/drop
# 3. Get instant URL

# Method 2: Git Integration
# 1. Connect GitHub repository
# 2. Set build directory to "SensoryVerse"
# 3. Deploy automatically on commits
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  base = "SensoryVerse"
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/quiz"
  to = "/quiz.html"
  status = 200

[[redirects]]
  from = "/games"
  to = "/games.html"
  status = 200
```

### 3. Vercel

**Pros**: Excellent performance, serverless functions, analytics  
**Cons**: Free tier limitations

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from SensoryVerse directory
cd SensoryVerse
vercel

# Follow prompts for configuration
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "routes": [
    { "src": "/quiz", "dest": "/quiz.html" },
    { "src": "/games", "dest": "/games.html" },
    { "src": "/(.*)", "dest": "/$1" }
  ],
  "headers": [
    {
      "source": "(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 4. AWS S3 + CloudFront

**Pros**: Highly scalable, professional-grade, full AWS ecosystem  
**Cons**: More complex setup, costs can grow

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://sensoryverse-app

# Upload files
aws s3 sync . s3://sensoryverse-app --delete

# Configure static website hosting
aws s3 website s3://sensoryverse-app --index-document index.html
```

### 5. Custom Domain Setup

#### DNS Configuration
```
# A Record
@ -> Your hosting provider IP

# CNAME Record  
www -> Your hosting provider domain

# Optional subdirectories
app.yourdomain.com -> hosting-provider
```

#### SSL Certificate
Most modern hosting providers (Netlify, Vercel, GitHub Pages) provide automatic SSL certificates via Let's Encrypt.

## Environment-Specific Configurations

### Development
```javascript
// Add to any JS file for debugging
const isDevelopment = window.location.hostname === 'localhost';
if (isDevelopment) {
  console.log('Development mode');
  // Enable detailed logging
}
```

### Production Optimizations

#### 1. Asset Optimization
```bash
# Minify CSS (optional)
npx clean-css-cli -o style.min.css style.css

# Optimize images
npx imagemin images/* --out-dir=images/optimized

# Compress JavaScript (if needed)
npx terser script.js -o script.min.js
```

#### 2. Performance Headers
```html
<!-- Add to <head> of HTML files -->
<link rel="dns-prefetch" href="//storage.ko-fi.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<meta name="theme-color" content="#00f2ff">
```

#### 3. Analytics Integration
```javascript
// Google Analytics 4 (add to all pages)
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## Monitoring & Maintenance

### Health Checks
```javascript
// Add to index.html for basic health monitoring
const healthCheck = {
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  status: 'healthy'
};

// Log for monitoring services
console.log('Health:', healthCheck);
```

### Error Tracking
```javascript
// Basic error tracking
window.addEventListener('error', function(e) {
  // Send to error tracking service
  console.error('Error:', e.error);
  // Optional: Send to external service like Sentry
});
```

### Backup Strategy
```bash
# Regular backups (run weekly)
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf "sensoryverse-backup-$DATE.tar.gz" SensoryVerse/
# Upload to cloud storage
```

## Security Considerations

### Content Security Policy
```html
<!-- Add to <head> of all HTML files -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://storage.ko-fi.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

### Privacy & GDPR Compliance
- Add privacy policy page
- Implement cookie consent
- Provide data export/deletion options
- Audit third-party integrations (Ko-fi)

## Scaling Considerations

### Traffic Growth
- Monitor page load times
- Implement CDN for global users
- Consider moving to dedicated hosting
- Plan for database integration if needed

### Feature Expansion
- Modular code organization
- API-first architecture for future mobile apps
- User authentication system
- Backend services for data persistence

## Troubleshooting

### Common Issues

#### Audio Not Working
- Check browser permissions
- Verify HTTPS for production (required for audio)
- Test across different browsers

#### Ko-fi Widget Errors
- Verify Ko-fi account settings
- Check network/ad blockers
- Consider fallback donation links

#### Performance Issues
- Optimize images and assets
- Enable compression on hosting
- Minimize JavaScript execution
- Use browser caching headers

---

*This deployment guide should be updated as the platform evolves and new hosting requirements emerge.*