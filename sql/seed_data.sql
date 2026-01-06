-- Clear existing data to avoid duplicates/conflicts
TRUNCATE properties;

-- Insert Seed Data with Multiple Images
INSERT INTO properties (title, description, price, address, image_url, images, sqft, bedrooms, bathrooms, status)
VALUES 
(
  'Sunset Boulevard Penthouse', 
  'Luxurious penthouse with panoramic city views and private pool.', 
  12000, 
  '888 Sunset Blvd, Los Angeles, CA', 
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop', 
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2670&auto=format&fit=crop'
  ],
  4500, 
  4, 
  5, 
  'available'
),
(
  'Cozy Arts District Loft', 
  'Industrial chic loft with high ceilings and exposed brick.', 
  2800, 
  '453 Traction Ave, Los Angeles, CA', 
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop', 
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop'
  ],
  1100, 
  1, 
  1, 
  'rented'
),
(
  'Modern Hills Estate', 
  'Architectural masterpiece with infinity pool.', 
  15000, 
  '1420 Blue Jay Way, Los Angeles, CA', 
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop', 
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2670&auto=format&fit=crop'
  ],
  5200, 
  5, 
  6, 
  'available'
),
(
  'Malibu Beach House', 
  'Direct beach access with stunning ocean views.', 
  18000, 
  '222 PCH, Malibu, CA', 
  'https://images.unsplash.com/photo-1430285561322-7808604715df?q=80&w=2670&auto=format&fit=crop', 
  ARRAY[
    'https://images.unsplash.com/photo-1430285561322-7808604715df?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop'
  ],
  4000, 
  4, 
  5, 
  'available'
);
