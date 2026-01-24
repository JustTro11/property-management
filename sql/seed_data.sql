-- Add new columns if they don't exist (Idempotent-ish check via DO block)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'lat') THEN
        ALTER TABLE properties ADD COLUMN lat double precision;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'lng') THEN
        ALTER TABLE properties ADD COLUMN lng double precision;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'address1') THEN
        ALTER TABLE properties ADD COLUMN address1 text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'address2') THEN
        ALTER TABLE properties ADD COLUMN address2 text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'city') THEN
        ALTER TABLE properties ADD COLUMN city text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'state') THEN
        ALTER TABLE properties ADD COLUMN state text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'zip') THEN
        ALTER TABLE properties ADD COLUMN zip text;
    END IF;
END $$;

-- Create Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Add policies safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Allow public insert to analytics') THEN
        CREATE POLICY "Allow public insert to analytics" ON analytics FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Allow admin select analytics') THEN
        CREATE POLICY "Allow admin select analytics" ON analytics FOR SELECT USING (true);
    END IF;
END $$;

-- Clear existing data to avoid duplicates/conflicts
TRUNCATE properties CASCADE;

-- Insert Seed Data matching Mock Data but allowing DB to generate UUIDs
-- Note: If you want strictly matching IDs for testing, you might need to insert them explicitly if the ID column allows it.
-- Assuming ID is UUID DEFAULT gen_random_uuid(), we just let it generate.
INSERT INTO properties (title, description, price, address, address1, city, state, zip, image_url, images, sqft, bedrooms, bathrooms, status, lat, lng, amenities)
VALUES 
(
    'Modern Downtown Loft',
    'Experience the pulse of the city in this stunning modern loft. Featuring high ceilings, exposed brick, and floor-to-ceiling windows, this unit offers the perfect blend of industrial charm and contemporary luxury. The open-concept living area is perfect for entertaining, while the state-of-the-art kitchen will inspire your inner chef. Amenities include a rooftop terrace, fitness center, and 24/7 concierge service.',
    3500,
    '123 Main St, City Center',
    '123 Main St', 'City Center', 'CA', '90012',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop'],
    1200,
    2,
    2,
    'available',
    34.052235,
    -118.243683,
    ARRAY['Pool', 'Gym', 'Concierge', 'Rooftop']
),
(
    'Secluded Hilltop Villa',
    'Escape to your own private sanctuary in this secluded hilltop villa. Surrounded by lush greenery and offering panoramic views of the city, this property is the epitome of luxury living. Features include a gourmet kitchen, spacious master suite with private balcony, and a resort-style pool and spa. The perfect retreat for those seeking privacy and tranquility.',
    5200,
    '45 Skyline Dr, Beverly Hills',
    '45 Skyline Dr', 'Beverly Hills', 'CA', '90210',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop'],
    2800,
    4,
    3,
    'available',
    34.073620,
    -118.400352,
    ARRAY['Pool', 'Spa', 'Gourmet Kitchen', 'Parking']
),
(
    'Oceanfront Glass Home',
    'Live the dream in this breathtaking oceanfront glass home. With direct beach access and uninterrupted views of the Pacific Ocean, this property is truly one-of-a-kind. The modern design features floor-to-ceiling glass walls, an open floor plan, and high-end finishes throughout. Enjoy the sunset from your private deck or take a dip in the ocean just steps from your door.',
    8500,
    '789 Pacific Coast Hwy, Malibu',
    '789 Pacific Coast Hwy', 'Malibu', 'CA', '90265',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop'],
    3500,
    3,
    4,
    'rented',
    34.025922,
    -118.779757,
    ARRAY['Beach Access', 'Deck', 'Parking', 'WiFi']
),
(
    'Eco-Friendly Forest Cabin',
    'Reconnect with nature in this charming eco-friendly forest cabin. Nestled among towering pines, this cabin offers a peaceful retreat from the hustle and bustle of city life. The sustainable design features solar panels, rainwater harvesting, and locally sourced materials. Inside, you''ll find a cozy living area with a wood-burning stove, a fully equipped kitchen, and comfortable sleeping quarters.',
    2800,
    '88 Pine Cone Way, Portland',
    '88 Pine Cone Way', 'Portland', 'OR', '97201',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop'],
    950,
    2,
    1,
    'maintenance',
    45.5152,
    -122.6784,
    ARRAY['Solar Panels', 'Wood Stove', 'Garden', 'WiFi']
),
(
    'Historic Brownstone',
    'Charming historic brownstone in the heart of the city. This beautifully restored home features original woodwork, high ceilings, and a private garden. The spacious living areas are perfect for entertaining, and the updated kitchen offers modern conveniences while maintaining the home''s historic character. Located within walking distance of shops, restaurants, and parks.',
    4200,
    '321 Cobblestone Ln, Boston',
    '321 Cobblestone Ln', 'Boston', 'MA', '02108',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop'],
    2100,
    3,
    2,
    'available',
    42.3601,
    -71.0589,
    ARRAY['Garden', 'Fireplace', 'WiFi', 'Parking']
),
(
    'Minimalist Concrete House',
    'Stunning minimalist concrete house designed by an award-winning architect. This unique property features clean lines, open spaces, and large windows that flood the home with natural light. The industrial-chic aesthetic is complemented by high-end finishes and appliances. Enjoy the private courtyard and rooftop deck with city views.',
    6000,
    '555 Industrial Ave, Seattle',
    '555 Industrial Ave', 'Seattle', 'WA', '98101',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop'],
    2500,
    3,
    3,
    'available',
    47.6062,
    -122.3321,
    ARRAY['Rooftop', 'Courtyard', 'Smart Home', 'Garage']
),
(
    'Lakeside Cottage',
    'Cozy lakeside cottage with stunning water views. This charming retreat is perfect for a weekend getaway or year-round living. Features include a wrap-around porch, private dock, and stone fireplace. The open-concept living area is perfect for gathering with friends and family.',
    2200,
    '777 Lakeview Dr, Austin',
    '777 Lakeview Dr', 'Austin', 'TX', '78701',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'],
    1100,
    2,
    1,
    'rented',
    30.2672,
    -97.7431,
    ARRAY['Dock', 'Fireplace', 'Porch', 'WiFi']
);
