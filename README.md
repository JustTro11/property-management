# LuxeLiving Property Manager

LuxeLiving is a premium property rental management application built with **Next.js 16** and **React 19**. It features fully comprehensive internationalization (i18n), seamless light/dark mode theming, and a robust admin dashboard powered by Supabase.

## 🌟 Key Features

### 🎨 UI/UX & Theming
- **Premium Design**: Modern, responsive UI with glassmorphism effects and smooth animations.
- **Dark Mode Default**: Fully themed for both light and dark modes, defaulting to a sleek dark interface.
- **Tailwind CSS 4**: Utilizes the latest Tailwind features including `@custom-variant` for class-based dark mode.
- **Semantic Colors**: consistent theming using CSS variables (`bg-bg-primary`, `text-text-primary`).

### 🌍 Internationalization (i18n)
- **Multi-language Support**:
  - 🇺🇸 English (`en`)
  - 🇪🇸 Spanish (`es`)
  - 🇨🇳 Simplified Chinese (`zh`)
  - 🇹🇼 Traditional Chinese (`zh-TW`)
- **Locale Routing**: Automatic routing handling (`/en/properties`, `/zh-TW/properties`).
- **Locale Switcher**: Polished dropdown with flag icons and animations.

### 🏢 Property Management
- **Public Listings**: Advanced filtering by price, bedrooms, and status.
- **Admin Dashboard**: Protected route for property CRUD operations.
- **Image Management**: multiple image uploads with gallery view.
- **Status Tracking**: Manage property availability (Available, Rented, Maintenance).

### 🔐 Authentication & Security
- **Supabase Auth**: Secure email/password authentication.
- **Row Level Security (RLS)**: Database policies ensuring public can only view, while admins can edit.
- **Middleware Protection**: Server-side route protection for admin areas.

## 🛠 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Core**: React 19.2, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl 4.7
- **Icons**: Lucide React
- **Email**: Resend + React Email

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/JustTro11/property-management.git
   cd property-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=your_email@example.com
   ```

4. **Database Migration**
   Run the SQL scripts in `sql/` against your Supabase project in this order:
   1. `schema.sql` (Tables & RLS)
   2. `migration_uuid.sql` (Extensions)
   3. `migration_images.sql` (Columns)
   4. `seed_data.sql` (Initial Data - 20+ properties)

5. **Run Development Server**
   ```bash
   npm run dev
   # Windows users: if you encounter permission errors, try:
   # cmd /c npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── properties/     # Listings & Details
│   │   └── ...
│   └── globals.css         # Tailwind 4 & CSS Variables
├── components/
│   ├── ThemeToggle.tsx     # Dark mode toggle
│   ├── LocaleSwitcher.tsx  # Language selector
│   └── ...
├── messages/               # Translation files (en, es, zh, zh-TW)
├── lib/                    # Supabase & Navigation utilities
└── sql/                    # Database migrations
```

## 📜 License

This project is licensed under the MIT License.
