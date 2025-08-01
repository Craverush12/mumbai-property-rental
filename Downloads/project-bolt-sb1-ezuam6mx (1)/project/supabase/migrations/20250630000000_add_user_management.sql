/*
  # Add User Management Tables

  This migration adds the missing user management functionality:
  - Custom user profiles table
  - Newsletter subscriptions
  - User preferences and settings
  - User activity tracking
*/

-- Custom User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  preferred_language TEXT DEFAULT 'en',
  marketing_consent BOOLEAN DEFAULT false,
  newsletter_subscribed BOOLEAN DEFAULT false,
  profile_image_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'unsubscribed', 'bounced')),
  subscription_source TEXT DEFAULT 'website',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Activity Log Table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- User Booking History View
CREATE OR REPLACE VIEW user_booking_history AS
SELECT 
  b.id as booking_id,
  b.user_id,
  p.id as property_id,
  p.name as property_name,
  p.location as property_location,
  b.check_in,
  b.check_out,
  b.guests,
  b.total_amount,
  b.status as booking_status,
  b.confirmation_code,
  b.created_at as booking_created_at
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.user_id IS NOT NULL;

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for newsletter_subscriptions
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own newsletter subscription"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
  ON user_activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
  ON user_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  activity_type TEXT,
  activity_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_data)
  VALUES (auth.uid(), activity_type, activity_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 