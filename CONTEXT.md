# Property Manager - Project Context

## Overview

**LuxeLiving** is a luxury property rental management application built with Next.js 16 and React 19. It features internationalization (i18n) support, Supabase for backend/database, and email notifications via Resend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Frontend** | React 19.2.3, TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **i18n** | next-intl 4.7.0 |
| **Email** | Resend + React Email |
| **Icons** | Lucide React |
| **Forms** | React Hook Form |

## Project Structure

```
property-manager/
├── app/
│   ├── [locale]/           # Localized routes (en, es, zh)
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard (protected)
│   │   ├── login/          # Authentication page
│   │   └── properties/     # Property listings & details
│   ├── api/
│   │   └── send-email/     # Tour request email API
│   └── globals.css
├── components/
│   ├── AdminPropertyForm.tsx   # CRUD form for properties
│   ├── AuthForm.tsx            # Login/signup form
│   ├── BookTourModal.tsx       # Tour scheduling modal
│   ├── Hero.tsx                # Landing page hero
│   ├── Navbar.tsx              # Navigation with locale switcher
│   ├── Pagination.tsx          # List pagination
│   ├── PropertyActions.tsx     # Share/book actions
│   ├── PropertyCard.tsx        # Property grid card
│   ├── PropertyFilters.tsx     # Search, price, beds, status filters
│   ├── PropertyGallery.tsx     # Image gallery viewer
│   └── emails/
│       └── TourRequestEmail.tsx # Email template
├── lib/
│   ├── navigation.ts       # next-intl navigation helpers
│   ├── supabaseClient.ts   # Browser Supabase client
│   └── supabaseServer.ts   # Server-side Supabase client
├── messages/               # i18n translation files
│   ├── en.json             # English
│   ├── es.json             # Spanish
│   └── zh.json             # Chinese
├── sql/                    # Database migrations
│   ├── schema.sql          # Properties table + RLS policies
│   ├── migration_uuid.sql  # UUID migration
│   ├── migration_images.sql # Images array column
│   ├── seed_data.sql       # Initial properties
│   └── seed_more_properties.sql
├── types/
│   └── index.ts            # TypeScript interfaces
├── i18n/
│   └── request.ts          # next-intl config
└── middleware.ts           # Locale detection & routing
```

## Data Model

### Property

```typescript
interface Property {
  id: string;               // UUID
  created_at?: string;
  title: string;
  description: string;
  price: number;            // Monthly rent
  address: string;
  image_url: string;        // Primary image
  images: string[];         // Gallery images
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  status: 'available' | 'rented' | 'maintenance';
}
```

## Key Features

### Internationalization (i18n)
- **Supported locales**: English (`en`), Spanish (`es`), Chinese (`zh`)
- **Locale routing**: `/en/properties`, `/es/properties`, `/zh/properties`
- **Middleware**: Auto-detects browser locale, redirects accordingly
- **Translation files**: `messages/*.json`

> **Important**: When modifying translations, update ALL locale files simultaneously per project rules.

### Authentication
- Supabase Auth integration
- Protected admin routes
- Row Level Security (RLS) on properties table:
  - Public read access
  - Authenticated users can modify

### Property Listings
- **Filters**: Search, price range, bedrooms, status
- **Pagination**: Configurable page size
- **Sorting**: By availability status (Available → Maintenance → Rented)
- **Status badges**: Localized status display

### Admin Dashboard
- Property CRUD operations
- Image management
- Status control

### Tour Booking
- Modal form with validation (react-hook-form)
- Email notifications via Resend API
- Custom React Email template

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (Email)
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=recipient-for-tour-requests
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Database Setup

Run SQL files in order against your Supabase project:
1. `sql/schema.sql` - Create properties table with RLS
2. `sql/migration_uuid.sql` - UUID extension
3. `sql/migration_images.sql` - Images array column
4. `sql/seed_data.sql` - Initial property data
