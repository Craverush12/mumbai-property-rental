/*
  # Create Properties Table

  1. New Tables
    - `properties`
      - `id` (integer, primary key)
      - `name` (text, property name)
      - `location` (text, property location)
      - `description` (text, short description)
      - `guests` (integer, max guests)
      - `bedrooms` (integer, number of bedrooms)
      - `bathrooms` (integer, number of bathrooms)
      - `price` (integer, price per night in rupees)
      - `category` (text, property category)
      - `aesthetic` (text, design aesthetic)
      - `images` (text array, image URLs)
      - `features` (jsonb, property features)
      - `story` (text, property story/description)
      - `testimonials` (jsonb, guest testimonials)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for public read access
    - Add policy for authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  aesthetic TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  features JSONB NOT NULL DEFAULT '[]',
  story TEXT NOT NULL DEFAULT '',
  testimonials JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to properties
CREATE POLICY "Properties are publicly readable"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update properties (for admin)
CREATE POLICY "Authenticated users can manage properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();