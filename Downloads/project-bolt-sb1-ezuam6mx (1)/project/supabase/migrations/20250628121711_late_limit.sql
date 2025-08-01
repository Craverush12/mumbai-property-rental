/*
  # Create Bookings Table

  1. New Tables
    - `bookings`
      - `id` (integer, primary key)
      - `property_id` (integer, foreign key to properties)
      - `user_id` (uuid, foreign key to auth.users)
      - `check_in` (date, check-in date)
      - `check_out` (date, check-out date)
      - `guests` (integer, number of guests)
      - `total_amount` (integer, total booking amount)
      - `status` (text, booking status)
      - `guest_details` (jsonb, guest information)
      - `special_requests` (text, special requests)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for users to read their own bookings
    - Add policy for users to create bookings
    - Add policy for admins to read all bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  guest_details JSONB NOT NULL DEFAULT '{}',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);