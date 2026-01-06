-- Add images column as a text array
ALTER TABLE properties ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing image_url data to the new images array
UPDATE properties 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- (Optional) We can keep image_url for backwards compatibility or safe rollback, 
-- but ideally we would drop it later. For now, let's just make sure the new column is populated.
-- The application logic will prefer 'images' if available/not empty, else fallback to 'image_url'.
