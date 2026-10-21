# Samaj Community Directory (alokworld.in)

Full-Stack Samaj Community Directory platform built with Next.js App Router, MongoDB, Mongoose, Cloudinary, Resend, and Tailwind CSS.

---

## 🎨 Color Palette Implemented

The application strictly implements the supplied custom palette:
- `#FFF6CC` (Primary Background & Cream Highlights)
- `#100C66` (Primary Navy Text, Header, & Accents)
- `#2D4A6B` (Slate Secondary & Border Elements)
- `#4B8A8A` (Teal Icons, Meta & Details)
- `#8BBCE8` (Sky Blue Borders, Badges & Secondary Accents)
- `#E4D329` (Gold / Yellow Accent Badges & Action Buttons)

---

## 🚀 Key Features

### 1. Client Directory Portal (`/`)
- **Central Directory Grid:** Two-column responsive layout inspired by Samaj Directory platforms, featuring a central member cards grid and an informative sidebar.
- **Search & Filters:** Real-time search across member names, occupations, organizations, and tags, with location/city dropdown filtering and pagination.
- **Consent-Protected Profiles:** Displays only contact details (phone, email, full address) that the member has consented to publish.
- **Member Profile Pages (`/member/[id]`):** Dedicated profile page with role, occupation, address, tags, and sanitized rich-text biography.
- **Secretariat Contact Form (`/contact`):** Allows community members to submit registration inquiries, updates, and feedback.

### 2. Admin Management Panel (`/admin`)
- **Authentication:** Secure cookie-based JWT authorization (`/admin/login`).
- **Member Management:**
  - Create, view, edit, approve, publish, unpublish, and delete member profiles.
  - Granular privacy checkboxes: `Publish on Directory`, `Show Phone Publicly`, `Show Email Publicly`, `Show Full Address`.
  - Rich-text editor formatting for biography with server-side HTML sanitization (`sanitize-html`).
- **Cloudinary Media Uploads:** Direct secure upload endpoint (`/api/upload`) with fallback image URL entry.
- **Site & SEO Settings:** Manage navigation titles, announcement banner, sidebar notices, business spotlight advertisement banner, and meta descriptions.
- **Inquiry Management:** View and review inquiries sent via the public contact form.

### 3. SEO & Discoverability
- Dynamic `sitemap.xml` generated automatically at `/sitemap.xml`.
- Search engine directives configured at `/robots.txt` (disallowing sensitive admin and API routes).
- OpenGraph metadata and canonical URLs configured for `alokworld.in`.

---

## 🛠️ Environment Configuration (`.env.local`)

Refer to [`.env.example`](file:///c:/Users/pc/Desktop/alokworldin/.env.example):

```env
# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/alokworld

# JWT Secret for Admin Sessions
JWT_SECRET=super_secret_jwt_key_change_in_production_alokworld_2026

# Default Initial Admin Credentials
INITIAL_ADMIN_EMAIL=admin@alokworld.in
INITIAL_ADMIN_PASSWORD=AdminSecure@2026

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend Transactional Email
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=admin@alokworld.in

# Website Canonical Domain
NEXT_PUBLIC_SITE_URL=https://alokworld.in
```

---

## 💻 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Access Admin Portal:**
   - URL: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Default Email: `admin@alokworld.in`
   - Default Password: `AdminSecure@2026`

4. **Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deployment to alokworld.in (Vercel / VPS / Node Server)

1. **Vercel Deployment:**
   - Link your GitHub or Git repository to Vercel.
   - In **Project Settings > Environment Variables**, add the environment variables from `.env.example`.
   - Set the custom domain `alokworld.in` and configure DNS CNAME/A records as guided by Vercel.

2. **Self-Hosted VPS (Node.js + PM2 + Nginx):**
   ```bash
   git clone <repo>
   npm install
   npm run build
   pm2 start npm --name "alokworld" -- start
   ```
   - Configure Nginx reverse proxy to forward traffic from `alokworld.in` to `http://localhost:3000`.
   - Obtain SSL via Let's Encrypt Certbot:
     ```bash
     sudo certbot --nginx -d alokworld.in -d www.alokworld.in
     ```
