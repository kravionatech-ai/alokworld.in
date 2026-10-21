# alokworld.in - Production Deployment & Operational Guide

This document provides complete instructions for deploying, securing, and maintaining the **alokworld.in** Next.js application in a production environment.

---

## 1. Production Environment Variables (`.env.local`)

Ensure the following variables are defined in your production hosting environment (e.g. VPS, Vercel, or Docker container):

```bash
# Database Connection (MongoDB)
MONGODB_URI=mongodb://localhost:27017/alokworld

# JWT Authentication Secret (Use a secure 64+ char random token)
JWT_SECRET=super_secret_jwt_key_change_in_production_alokworld_2026

# Seed Superadmin Account (Automatically initialized if no admin exists)
INITIAL_ADMIN_EMAIL=admin@alokworld.in
INITIAL_ADMIN_PASSWORD=AdminSecure@2026

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Transactional Email API Key
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=admin@alokworld.in

# Canonical Hostname
NEXT_PUBLIC_SITE_URL=https://alokworld.in
```

---

## 2. Server Setup & Process Management (PM2)

### 2.1 Installation
```bash
# Clone and enter directory
git clone <repo-url> /var/www/alokworldin
cd /var/www/alokworldin

# Install dependencies
npm ci

# Build the production application
npm run build

# Install PM2 globally
npm install -g pm2
```

### 2.2 PM2 Ecosystem File (`ecosystem.config.js`)
Create `ecosystem.config.js` in the repository root:

```javascript
module.exports = {
  apps: [
    {
      name: "alokworld",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "800M",
      autorestart: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
```

### 2.3 Starting the Service
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 3. Reverse Proxy & HTTPS Configuration (Nginx)

Place this configuration in `/etc/nginx/sites-available/alokworld.in`:

```nginx
# 1. Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name alokworld.in www.alokworld.in;
    return 301 https://alokworld.in$request_uri;
}

# 2. Redirect www to apex domain over HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.alokworld.in;

    ssl_certificate /etc/letsencrypt/live/alokworld.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alokworld.in/privkey.pem;

    return 301 https://alokworld.in$request_uri;
}

# 3. Main Application Server Proxy
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name alokworld.in;

    ssl_certificate /etc/letsencrypt/live/alokworld.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alokworld.in/privkey.pem;

    # SSL hardening
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Payload limits (allows 5MB uploads + overhead)
    client_max_body_size 6M;

    # Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/alokworld.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Automated Database Backup & Retention

Create `/opt/scripts/backup-mongodb.sh`:

```bash
#!/bin/bash
set -e

BACKUP_ROOT="/var/backups/alokworld"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_ROOT/alokworld_$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

# Run dump
mongodump --db alokworld --out "$BACKUP_PATH" --quiet

# Archive and compress
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_ROOT" "alokworld_$TIMESTAMP"
rm -rf "$BACKUP_PATH"

# Retention: Delete archives older than 14 days
find "$BACKUP_ROOT" -name "alokworld_*.tar.gz" -type f -mtime +14 -delete

echo "[$(date)] Backup completed: $BACKUP_PATH.tar.gz"
```

Make executable and add to crontab:
```bash
chmod +x /opt/scripts/backup-mongodb.sh
# Run nightly at 02:00 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/scripts/backup-mongodb.sh >> /var/log/mongodb_backup.log 2>&1") | crontab -
```

---

## 5. Security Checklist Before Going Live

- [x] **Rate Limiting**: Enabled on `/api/auth` (10 per 15 min) and `/api/contact` (5 per 10 min).
- [x] **HTTP Security Headers**: HSTS, `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin` active in `next.config.mjs`.
- [x] **XSS Sanitization**: Input sanitized via `sanitize-html` across member biographies, page content CMS, and contact messages.
- [x] **Upload Validation**: File size (5MB max) and MIME type checks enforced server-side.
- [x] **Privacy Consent**: Contact numbers and email addresses masked server-side unless explicit consent is granted.
- [x] **Robots & Sitemap**: Admin paths protected with `noindex`; public routes registered in dynamic XML sitemap with canonical slugs.
- [x] **Custom 404 & Error Boundaries**: Implemented in `src/app/not-found.js` and `src/app/error.js`.
