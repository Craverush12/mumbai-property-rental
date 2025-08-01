/*
  # Enhanced Features for Infiniti Casa

  1. New Tables
    - `user_preferences` - Store user suggestion preferences for analytics
    - `property_reviews` - Store detailed property reviews
    - `booking_payments` - Track payment information
    - `property_amenities` - Detailed amenity tracking
    - `neighborhood_guides` - Local area information

  2. Enhanced Tables
    - Add columns to existing tables for better functionality
    - Add indexes for performance

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies
*/

-- User Preferences Table for Analytics
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  suggested_property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  converted_to_booking BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Reviews Table
CREATE TABLE IF NOT EXISTS property_reviews (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  photos TEXT[] DEFAULT '{}',
  verified_stay BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Booking Payments Table
CREATE TABLE IF NOT EXISTS booking_payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_gateway TEXT DEFAULT 'razorpay',
  gateway_response JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property Amenities Table
CREATE TABLE IF NOT EXISTS property_amenities (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Neighborhood Guides Table
CREATE TABLE IF NOT EXISTS neighborhood_guides (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT,
  distance_meters INTEGER,
  rating DECIMAL(2,1),
  price_range TEXT,
  opening_hours JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to existing tables
DO $$
BEGIN
  -- Add virtual tour and video URLs to properties
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'virtual_tour_url'
  ) THEN
    ALTER TABLE properties ADD COLUMN virtual_tour_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE properties ADD COLUMN video_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'highlights'
  ) THEN
    ALTER TABLE properties ADD COLUMN highlights TEXT[] DEFAULT '{}';
  END IF;

  -- Add payment tracking to bookings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'confirmation_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN confirmation_code TEXT UNIQUE;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_guides ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "User preferences are publicly readable for analytics"
  ON user_preferences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert user preferences"
  ON user_preferences
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policies for property_reviews
CREATE POLICY "Property reviews are publicly readable"
  ON property_reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON property_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON property_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for booking_payments
CREATE POLICY "Users can read their own payment records"
  ON booking_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage payment records"
  ON booking_payments
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for property_amenities
CREATE POLICY "Property amenities are publicly readable"
  ON property_amenities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage amenities"
  ON property_amenities
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for neighborhood_guides
CREATE POLICY "Neighborhood guides are publicly readable"
  ON neighborhood_guides
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage guides"
  ON neighborhood_guides
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_rating ON property_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking_id ON booking_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_payments_status ON booking_payments(status);
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_neighborhood_guides_property_id ON neighborhood_guides(property_id);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_property_reviews_updated_at
  BEFORE UPDATE ON property_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_payments_updated_at
  BEFORE UPDATE ON booking_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'IC' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate confirmation codes for bookings
CREATE OR REPLACE FUNCTION set_booking_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := generate_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_confirmation_code_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_confirmation_code();