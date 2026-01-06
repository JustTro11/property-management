create table properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric not null,
  address text not null,
  image_url text,
  sqft integer,
  bedrooms integer,
  bathrooms integer,
  status text default 'available' check (status in ('available', 'rented', 'maintenance'))
);

-- Turn on Row Level Security
alter table properties enable row level security;

-- Create a policy that allows anyone to view properties
create policy "Public properties are viewable by everyone"
  on properties for select
  using ( true );

-- Create a policy that allows only authenticated users to insert/update/delete
create policy "Authenticated users can modify properties"
  on properties for all
  using ( auth.role() = 'authenticated' );
