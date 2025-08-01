/*
  # Create Property Suggestions Table

  1. New Tables
    - `property_suggestions`
      - `id` (integer, primary key)
      - `user_preferences` (jsonb, user preference data)
      - `suggested_property_id` (integer, foreign key to properties)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `property_suggestions` table
    - Add policy for public access (anonymous suggestions)
*/

CREATE TABLE IF NOT EXISTS property_suggestions (
  id SERIAL PRIMARY KEY,
  user_preferences JSONB NOT NULL DEFAULT '{}',
  suggested_property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow public access for suggestions (can be anonymous)
CREATE POLICY "Property suggestions are publicly accessible"
  ON property_suggestions
  FOR ALL
  TO public
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_property_suggestions_property_id ON property_suggestions(suggested_property_id);