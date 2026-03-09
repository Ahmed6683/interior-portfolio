# 🏛️ Interior Designer Portfolio — Supabase Edition (v2)

Full-stack portfolio with **Next.js 14 (App Router)**, **Supabase** (Auth · Postgres · Storage), **Tailwind CSS**, and **Framer Motion**.

---

## ✨ What's New in v2

| Feature | v1 (Firebase) | v2 (Supabase) |
|---------|---------------|---------------|
| Database | Firestore (NoSQL) | Postgres + RLS |
| Storage | Firebase Storage | Supabase Storage |
| Auth | Firebase Auth | Supabase Auth |
| Route protection | Client `AdminGuard` component | **Next.js Middleware** (server-side) |
| Real-time | `onSnapshot` hooks | `supabase.channel()` subscriptions |
| Image delivery | Firebase CDN | Supabase Storage CDN + `next/image` |
| Schema | Schemaless docs | Typed SQL tables |

---

## 📁 Full Project Structure

```
portfolio-supabase/
├── app/
│   ├── layout.js                    # Fonts · providers
│   ├── page.js                      # Public homepage
│   ├── globals.css                  # CSS design tokens
│   ├── admin/
│   │   ├── layout.js                # Sidebar shell (non-login pages)
│   │   ├── page.js                  # /admin  → Login
│   │   ├── dashboard/page.js        # /admin/dashboard → Content editor
│   │   ├── gallery/page.js          # /admin/gallery   → Image CRUD
│   │   └── settings/page.js        # /admin/settings  → WhatsApp
│   └── api/
│       └── auth/callback/route.js   # Supabase OAuth redirect
│
├── components/
│   ├── Navbar.jsx                   # Sticky nav + EN/AR toggle
│   ├── sections/
│   │   ├── HeroSection.jsx          # Parallax · dynamic text from DB
│   │   ├── AboutSection.jsx         # Bio paragraphs from DB · stats
│   │   ├── PortfolioGallery.jsx     # Filterable grid · Lightbox
│   │   └── BeforeAfterSection.jsx  # Multi-project slider
│   ├── ui/
│   │   ├── BeforeAfterSlider.jsx    # Pointer-drag compare widget
│   │   ├── Lightbox.jsx             # Full-screen viewer · keyboard nav
│   │   └── WhatsAppButton.jsx       # Sticky button · DB-toggled
│   └── admin/
│       └── AdminSidebar.jsx         # Dashboard navigation
│
├── context/
│   └── LanguageContext.jsx          # RTL/LTR toggle · localStorage
│
├── hooks/
│   └── useSupabase.js               # All data + auth hooks
│
├── lib/
│   ├── supabase/client.js           # Browser · Server · Middleware clients
│   └── i18n.js                      # Full EN + AR translations
│
├── supabase/
│   └── schema.sql                   # Tables · RLS policies · Storage
│
├── middleware.js                    # Route protection (server-side)
├── next.config.js                   # Image remote patterns
├── tailwind.config.js
├── .env.example
└── package.json
```

---

## 🚀 Setup Guide

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **Anon key** from Settings → API

### Step 2 — Run the Database Schema

Open **SQL Editor** in your Supabase dashboard → **New Query** → paste the contents of `supabase/schema.sql` → Run.

This creates:
- `portfolio` table (gallery images)
- `site_settings` table (singleton row for all editable content)
- `before_after` table (comparison pairs)
- Row Level Security policies
- Storage bucket `gallery` with public read access

### Step 3 — Create an Admin User

Go to **Authentication** → **Users** → **Add User** → enter email + password.

> This account is used to log in at `/admin`.

### Step 4 — Install Dependencies

```bash
npm install
```

### Step 5 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Step 6 — Add Local Images

Place demo images in `public/images/`:
```
public/images/
├── hero.jpg
├── about.jpg
├── portfolio/
│   ├── p1.jpg … p9.jpg
└── ba/
    ├── living-before.jpg / living-after.jpg
    ├── kitchen-before.jpg / kitchen-after.jpg
    └── master-before.jpg / master-after.jpg
```

> Tip: Use [Unsplash](https://unsplash.com/s/photos/interior) for high-quality free placeholders.

### Step 7 — Run

```bash
npm run dev
# Public site → http://localhost:3000
# Admin       → http://localhost:3000/admin
```

---

## 🔐 Auth & Security

| Mechanism | Detail |
|-----------|--------|
| **Middleware** | `middleware.js` runs server-side on every `/admin/*` request — unauthenticated users are redirected to `/admin` before the page even renders |
| **RLS Policies** | All write operations on Postgres tables require `auth.role() = 'authenticated'` |
| **Storage Policies** | Only authenticated users can upload/delete; public reads allowed |
| **Session refresh** | Middleware calls `getSession()` on every request to keep JWTs fresh |

---

## 🗄️ Database Schema

### `portfolio`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title_en` | text | English title |
| `title_ar` | text | Arabic title |
| `image_url` | text | Supabase Storage public URL |
| `storage_path` | text | Internal path for deletion |
| `category` | text | all / residential / commercial / hospitality |
| `sort_order` | int | Manual ordering |
| `created_at` | timestamptz | Auto-set |

### `site_settings` (singleton — id = 1)
| Column | Notes |
|--------|-------|
| `hero_name_en/ar` | Designer name |
| `hero_headline_en/ar` | Main headline |
| `hero_description_en/ar` | Subheadline |
| `about_bio1_en/ar` | About paragraph 1 |
| `about_bio2_en/ar` | About paragraph 2 |
| `whatsapp_number` | Full number incl. country code |
| `show_whatsapp` | boolean toggle |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--ivory` | `#F7F3EE` |
| `--charcoal` | `#1A1917` |
| `--gold` | `#C9A96E` |
| Display font | Cormorant Garamond |
| Body font | Jost (EN) / Cairo (AR) |

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database, Storage, Auth client |
| `@supabase/ssr` | Server-side + middleware Supabase clients |
| `@supabase/auth-helpers-nextjs` | Cookie-based session management |
| `next@14` | App Router, Image optimization |
| `framer-motion@11` | Page animations, parallax, spring transitions |

---

## ☁️ Deploy to Vercel

```bash
npx vercel
```

Set these environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

In Supabase → Authentication → URL Configuration, add your Vercel domain to **Redirect URLs**.
