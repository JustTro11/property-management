# Property Manager Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement interactive map, user engagement features, advanced search, and refactoring to improve the property management platform.

**Architecture:** 
- **Map View:** Client-side rendering with `react-leaflet` (dynamically imported to avoid SSR issues).
- **State:** Local state for View Mode (Map/List). LocalStorage for Favorites/Recently Viewed.
- **Data:** Update `Property` model to include coordinates and amenities.
- **Refactoring:** Service layer pattern for data fetching.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (or Mock Data), React Leaflet.

---

### Task 1: Add Coordinates to Data Model

**Files:**
- Modify: `types/index.ts`
- Modify: `lib/mockData.ts`

**Step 1: Update Property Interface**

Add `lat` and `lng` to the `Property` interface.

```typescript
export interface Property {
    // ... existing fields
    lat: number;
    lng: number;
}
```

**Step 2: Update Mock Data**

Add valid coordinates for existing mock properties.

**Step 3: Verification**

Run `npm run build` to ensure type safety.

---

### Task 2: Install Map Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Dependencies**

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Step 2: Verification**

Check `package.json` for installed packages.

---

### Task 3: Implement MapView Component

**Files:**
- Create: `components/MapView.tsx`

**Step 1: Create MapView Component**

Need to handle Leaflet CSS and dynamic import.

```tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/types'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/images/marker-icon.png', // We might need to handle icons
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Or use a default CDN icon for simplicity in this plan
// ...

interface MapViewProps {
    properties: Property[]
}

export default function MapView({ properties }: MapViewProps) {
    // ... implementation
}
```

**Step 2: Verification**

Create a simple test page or storybook if available, but for now we will integrate it in the next task and verify there.

---

### Task 4: Integrate Map View into Properties Page

**Files:**
- Modify: `app/[locale]/properties/page.tsx`
- Create: `components/PropertiesContent.tsx`

**Step 1: Update Page to Client Component or Add Client Wrapper**

Since `page.tsx` is async/server component, we should probably keep it that way for SEO and data fetching.
We should create a `PropertiesContent.tsx` client component that handles the View Mode and renders either the Grid or the Map.

- Create: `components/PropertiesContent.tsx`
- Move list rendering logic to `PropertiesContent.tsx`
- Add Toggle State

**Step 2: Use PropertiesContent in Page**

Update `app/[locale]/properties/page.tsx` to pass data to `PropertiesContent`.

**Step 3: Verification**

Run the app `npm run dev` and navigate to `/properties`. Toggle between List and Map.

---

### Task 5: User Engagement - Favorites

**Files:**
- Create: `hooks/useFavorites.ts`
- Create: `components/FavoriteButton.tsx`
- Modify: `components/PropertyCard.tsx`

**Step 1: Implement Hook**

Use `localStorage` to store list of property IDs.

**Step 2: Implement Button**

Heart icon that toggles state.

**Step 3: Add to Card**

Overlay on Property Card image.

**Step 4: Verification**

Click heart on a property, refresh page, verify it remains selected.

---

### Task 6: User Engagement - Recently Viewed

**Files:**
- Create: `components/RecentlyViewed.tsx`
- Modify: `app/[locale]/properties/[id]/page.tsx`

**Step 1: Track Views**

In `[id]/page.tsx` (or a client component inside it), add `useEffect` to save ID to `localStorage`.

**Step 2: Display Section**

Implement `RecentlyViewed` component that fetches details for stored IDs (might need a new API endpoint or just filter from known list if available, or fetch individually).
*Simplification:* For now, we rely on the `mockData` or existing Supabase client to fetch by IDs.

**Step 3: Verification**

Visit a property. Go back to home/list. Check "Recently Viewed" section.

---

### Task 7: Advanced Features - Amenities Filtering

**Files:**
- Modify: `types/index.ts` (Add `amenities: string[]`)
- Modify: `lib/mockData.ts`
- Modify: `components/PropertyFilters.tsx`
- Modify: `app/[locale]/properties/page.tsx`

**Step 1: Update Data Model**

Add `amenities` to `Property`.

**Step 2: Update Filters UI**

Add Checkboxes for common amenities (Pool, Gym, WiFi, Parking).

**Step 3: Update Filtering Logic**

In `page.tsx`, filter properties that contain ALL selected amenities.

**Step 4: Verification**

Select "Pool". Verify only properties with Pool are shown.

---

### Task 8: Advanced Features - Dynamic Metadata

**Files:**
- Modify: `app/[locale]/properties/[id]/page.tsx`

**Step 1: Implement generateMetadata**

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
    // fetch property
    // return { title: property.title, openGraph: { ... } }
}
```

**Step 2: Verification**

Use a tool or inspect `<head>` tag to verify OG tags.

---

### Task 9: Refactoring - Service Layer

**Files:**
- Create: `lib/services/propertyService.ts`
- Modify: `app/[locale]/properties/page.tsx`
- Modify: `app/[locale]/properties/[id]/page.tsx`

**Step 1: Extract Logic**

Move Supabase/Mock logic from pages to `getProperties`, `getPropertyById`.

**Step 2: Use Service**

Replace inline logic in pages with service calls.

**Step 3: Verification**

Run all tests. Ensure app still functions identical to before.

---

### Task 10: Refactoring - Environment Validation

**Files:**
- Create: `lib/env.ts`

**Step 1: Create Validation**

Check for `NEXT_PUBLIC_SUPABASE_URL` etc. Throw error if missing (or log warning if optional).

**Step 2: Use in App**

Import `env` variables from this file instead of `process.env`.

**Step 3: Verification**

Temporarily unset a required var and verify it fails fast or warns.
