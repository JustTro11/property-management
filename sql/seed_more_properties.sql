
-- Additional 20 Properties
INSERT INTO properties (title, description, price, address, image_url, images, sqft, bedrooms, bathrooms, status)
VALUES 
(
  'The Glass Box', 
  'Minimalist glass structure surrounded by nature.', 
  3200, 
  '789 Pine Forest Ln, Portland, OR', 
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop'],
  1200, 2, 2, 'available'
),
(
  'Historic Brownstone', 
  'Classic 19th-century brownstone with modern interior.', 
  4500, 
  '123 State St, Boston, MA', 
  'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2670&auto=format&fit=crop'],
  2500, 3, 3, 'rented'
),
(
  'Skyline Luxury Apartment', 
  'High-rise apartment with breathtaking city views.', 
  5500, 
  '456 High St, New York, NY', 
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop'],
  1800, 2, 2, 'available'
),
(
  'Seaside Cottage', 
  'Charming cottage steps away from the sandy beach.', 
  2800, 
  '101 Ocean Dr, Miami, FL', 
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop'],
  1400, 3, 2, 'available'
),
(
  'Desert Oasis Villa', 
  'Modern villa with a private pool in the desert.', 
  6000, 
  '777 Desert Rd, Phoenix, AZ', 
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop'],
  3500, 4, 4, 'maintenance'
),
(
  'Lakefront Cabin', 
  'Rustic cabin with a dock on a pristine lake.', 
  3000, 
  '55 Lakeview Dr, Tahoe, CA', 
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2670&auto=format&fit=crop'],
  1600, 3, 2, 'available'
),
(
  'Urban Industrial Loft', 
  'Converted warehouse loft with open floor plan.', 
  3800, 
  '890 Warehouse St, Chicago, IL', 
  'https://images.unsplash.com/photo-1502005229766-3c8ef0af147a?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1502005229766-3c8ef0af147a?q=80&w=2670&auto=format&fit=crop'],
  2200, 2, 2, 'rented'
),
(
  'Country Farmhouse', 
  'Spacious farmhouse with acres of land.', 
  4000, 
  '321 Farm Ln, Nashville, TN', 
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop'],
  3000, 5, 3, 'available'
),
(
  'Modern Condo', 
  'Sleek condo in the heart of the city.', 
  2500, 
  '654 Main St, Austin, TX', 
  'https://images.unsplash.com/photo-1484154218962-a1c00207099b?q=80&w=2674&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1484154218962-a1c00207099b?q=80&w=2674&auto=format&fit=crop'],
  1000, 1, 1, 'available'
),
(
  'Mediterranean Villa', 
  'Stunning villa with ocean views and lush gardens.', 
  9000, 
  '987 Coast Blvd, Santa Barbara, CA', 
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2680&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2680&auto=format&fit=crop'],
  4000, 5, 5, 'available'
),
(
  'Mountain Chalet', 
  'Cozy chalet near ski slopes.', 
  3500, 
  '111 Ski Run Rd, Aspen, CO', 
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2670&auto=format&fit=crop'],
  2000, 3, 3, 'rented'
),
(
  'Victorian Mansion', 
  'Restored Victorian mansion with historic charm.', 
  7000, 
  '222 History Ln, San Francisco, CA', 
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop'],
  4500, 6, 4, 'available'
),
(
  'Beachfront Bungalow', 
  'Small bungalow right on the sand.', 
  2200, 
  '333 Sand St, San Diego, CA', 
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop'],
  900, 2, 1, 'available'
),
(
  'Suburban Family Home', 
  'Perfect family home with a big backyard.', 
  2800, 
  '444 Suburbia Dr, Dallas, TX', 
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'],
  2400, 4, 3, 'available'
),
(
  'Downtown Penthouse', 
  'Luxury penthouse in the city center.', 
  8500, 
  '555 City Center, Seattle, WA', 
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2671&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2671&auto=format&fit=crop'],
  3000, 3, 3, 'available'
),
(
  'Contemporary Townhouse', 
  'Modern townhouse with rooftop terrace.', 
  3400, 
  '666 Urban Ln, Denver, CO', 
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2670&auto=format&fit=crop'],
  1800, 3, 2, 'rented'
),
(
  'Rustic Log Cabin', 
  'Authentic log cabin in the woods.', 
  2000, 
  '777 Forest Rd, Montana', 
  'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=2674&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=2674&auto=format&fit=crop'],
  1500, 2, 1, 'available'
),
(
  'Tropical Villa', 
  'Exotic villa with lush surroundings.', 
  7500, 
  '888 Palm Dr, Key West, FL', 
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2670&auto=format&fit=crop'],
  3200, 4, 4, 'available'
),
(
  'Colonial Estate', 
  'Grand colonial estate with history.', 
  5000, 
  '999 History Rd, Virginia', 
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop'],
  4000, 5, 4, 'maintenance'
),
(
  'Tiny House', 
  'Minimalist tiny house for simple living.', 
  1200, 
  '100 Tiny Ln, Portland, OR', 
  'https://images.unsplash.com/photo-1525113990976-399835c43838?q=80&w=2664&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1525113990976-399835c43838?q=80&w=2664&auto=format&fit=crop'],
  400, 1, 1, 'available'
);
