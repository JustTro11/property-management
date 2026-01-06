-- Enable the UUID extension if not already enabled (standard for UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Option 1: If you don't care about preserving "1, 2, 3" mapping (since they are ints and incompatible with UUIDs anyway),
-- we will basically replace the column.

-- 1. Add the new UUID column with a default value
ALTER TABLE properties ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();

-- 2. Drop the old primary key constraint
ALTER TABLE properties DROP CONSTRAINT properties_pkey;

-- 3. Drop the old integer ID column
ALTER TABLE properties DROP COLUMN id;

-- 4. Rename the new column to 'id'
ALTER TABLE properties RENAME COLUMN new_id TO id;

-- 5. Set the new column as the Primary Key
ALTER TABLE properties ADD PRIMARY KEY (id);

-- 6. Verify seed data inserts still work (they rely on default value)
-- Note: If you have foreign keys in other tables pointing to properties.id, 
-- those would need to be dropped and recreated/migrated too. 
-- Assuming no foreign keys for now based on current schema.
