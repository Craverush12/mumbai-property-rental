-- Production Database Setup for Infiniti Casa
-- This migration sets up the production database with proper RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE user_role AS ENUM ('guest', 'admin', 'property_manager');

-- Create properties table with RLS
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    bedrooms INTEGER NOT NULL CHECK (bedrooms > 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category VARCHAR(100) NOT NULL,
    aesthetic VARCHAR(100) NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    features JSONB NOT NULL DEFAULT '{}',
    story TEXT NOT NULL,
    testimonials JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table with phone-based authentication
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    date_of_birth DATE,
    nationality VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    marketing_consent BOOLEAN DEFAULT false,
    newsletter_subscribed BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    role user_role DEFAULT 'guest',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    status booking_status DEFAULT 'pending',
    guest_details JSONB NOT NULL DEFAULT '{}',
    special_requests TEXT,
    payment_id VARCHAR(255),
    payment_status VARCHAR(50),
    confirmation_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure check_out is after check_in
    CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Create property_suggestions table
CREATE TABLE IF NOT EXISTS property_suggestions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_preferences JSONB NOT NULL,
    suggested_property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_source VARCHAR(100),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique user-property combinations
    UNIQUE(user_id, property_id)
);

-- Create OTP verification table for phone authentication
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_aesthetic ON properties(aesthetic);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON otp_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties (public read, admin write)
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (is_active = true);

CREATE POLICY "Properties are insertable by admins" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
        )
    );

CREATE POLICY "Properties are updatable by admins" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
        )
    );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookings" ON bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
        )
    );

-- RLS Policies for user_favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activity" ON user_activity_log
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for property_suggestions
CREATE POLICY "Users can view own suggestions" ON property_suggestions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own suggestions" ON property_suggestions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for newsletter_subscriptions (public insert, admin read)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for otp_verifications (restricted)
CREATE POLICY "OTP can be created for any phone" ON otp_verifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "OTP can be verified by phone owner" ON otp_verifications
    FOR SELECT USING (phone = (SELECT phone FROM user_profiles WHERE id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS VARCHAR(20) AS $$
BEGIN
    RETURN 'IC' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflicts(
    p_property_id INTEGER,
    p_check_in DATE,
    p_check_out DATE,
    p_booking_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM bookings 
        WHERE property_id = p_property_id
        AND status != 'cancelled'
        AND (
            (check_in <= p_check_out AND check_out >= p_check_in)
            OR (p_check_in <= check_out AND p_check_out >= check_in)
        )
        AND (p_booking_id IS NULL OR id != p_booking_id)
    );
END;
$$ LANGUAGE plpgsql;

-- Create view for user booking history
CREATE OR REPLACE VIEW user_booking_history AS
SELECT 
    b.id as booking_id,
    b.user_id,
    b.property_id,
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
JOIN properties p ON b.property_id = p.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 