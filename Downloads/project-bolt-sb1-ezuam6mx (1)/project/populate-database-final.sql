-- 🏠 Infiniti Casa - Final Database Population Script
-- This script works with the actual schema where user_profiles is the main user table

-- 🌟 Insert Luxury Properties (if not already inserted)
INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Bandra Art Loft',
  'Bandra West, Mumbai',
  'A stunning art-inspired loft in the heart of Bandra, featuring contemporary artwork, high ceilings, and panoramic city views. Perfect for creative professionals and art enthusiasts.',
  4,
  2,
  2,
  8500,
  'Art & Culture',
  'Contemporary',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3b?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3c?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Balcony", "Art Gallery", "Workspace"], "highlights": ["City View", "Art Collection", "High Ceilings", "Natural Light"]}',
  'This loft transformed my creative process. The art collection and natural light inspired me to create my best work yet. The location in Bandra is perfect for networking with other artists.',
  '[{"name": "Priya S.", "rating": 5, "comment": "Perfect for creative work!", "date": "2024-01-15"}]',
  'https://www.youtube.com/watch?v=example1',
  'https://www.youtube.com/watch?v=virtual1',
  ARRAY['Art Gallery Access', 'City Skyline Views', 'Creative Workspace', 'Artist Community']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Colaba Heritage Villa',
  'Colaba, Mumbai',
  'A beautifully restored heritage villa that combines colonial architecture with modern luxury. Experience the charm of old Bombay with contemporary comforts.',
  6,
  3,
  3,
  12000,
  'Heritage',
  'Colonial',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e3?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddd?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3d?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3e?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Garden", "Library", "Fireplace"], "highlights": ["Heritage Architecture", "Garden", "Library", "Fireplace"]}',
  'Staying in this heritage villa was like stepping back in time. The colonial architecture and period furniture create an authentic experience while maintaining modern comforts.',
  '[{"name": "Raj M.", "rating": 4, "comment": "Beautiful heritage experience!", "date": "2024-01-20"}]',
  'https://www.youtube.com/watch?v=example2',
  'https://www.youtube.com/watch?v=virtual2',
  ARRAY['Heritage Architecture', 'Private Garden', 'Antique Furniture', 'Historical Location']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Worli Zen Penthouse',
  'Worli, Mumbai',
  'A minimalist zen-inspired penthouse with panoramic sea views. Designed for ultimate relaxation and mindfulness, featuring Japanese-inspired interiors and a meditation garden.',
  4,
  2,
  2,
  15000,
  'Urban Zen',
  'Minimalist',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e4?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33dde?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3f?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3g?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Meditation Room", "Sea View", "Zen Garden"], "highlights": ["Sea View", "Meditation Space", "Minimalist Design", "Peaceful Atmosphere"]}',
  'The zen atmosphere and sea views helped me find inner peace. The meditation room and minimalist design create the perfect environment for mindfulness and relaxation.',
  '[{"name": "Meera P.", "rating": 5, "comment": "Zen paradise with sea views!", "date": "2024-01-25"}]',
  'https://www.youtube.com/watch?v=example3',
  'https://www.youtube.com/watch?v=virtual3',
  ARRAY['Sea Views', 'Meditation Room', 'Zen Garden', 'Minimalist Design']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Juhu Beach Studio',
  'Juhu, Mumbai',
  'A cozy studio apartment steps away from Juhu Beach. Perfect for solo travelers or couples who want to experience Mumbai''s famous beach culture and vibrant atmosphere.',
  2,
  1,
  1,
  5500,
  'Studio',
  'Beach',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e5?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddf?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3h?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3i?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Beach Access", "Balcony"], "highlights": ["Beach Proximity", "Sunset Views", "Local Culture", "Vibrant Atmosphere"]}',
  'Perfect location for experiencing Mumbai''s beach culture. The studio is cozy and well-equipped, and being so close to Juhu Beach made every day feel like a vacation.',
  '[{"name": "Amit K.", "rating": 4, "comment": "Perfect beach location!", "date": "2024-01-30"}]',
  'https://www.youtube.com/watch?v=example4',
  'https://www.youtube.com/watch?v=virtual4',
  ARRAY['Beach Access', 'Sunset Views', 'Local Culture', 'Compact Design']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Andheri Creative Hub',
  'Andheri West, Mumbai',
  'A modern creative workspace and living area designed for digital nomads and entrepreneurs. Features high-speed internet, meeting rooms, and a collaborative atmosphere.',
  3,
  1,
  1,
  7500,
  'Studio',
  'Modern',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e6?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddg?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3j?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3k?w=800'],
  '{"amenities": ["High-Speed WiFi", "Air Conditioning", "Kitchen", "Meeting Room", "Coworking Space"], "highlights": ["Coworking Space", "High-Speed Internet", "Meeting Facilities", "Entrepreneur Community"]}',
  'As a digital nomad, this space was perfect. The high-speed internet and coworking atmosphere helped me stay productive while meeting other entrepreneurs.',
  '[{"name": "Sneha R.", "rating": 5, "comment": "Perfect for remote work!", "date": "2024-02-05"}]',
  'https://www.youtube.com/watch?v=example5',
  'https://www.youtube.com/watch?v=virtual5',
  ARRAY['Coworking Space', 'High-Speed Internet', 'Meeting Rooms', 'Entrepreneur Community']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Powai Lake View',
  'Powai, Mumbai',
  'A spacious apartment with stunning views of Powai Lake. Perfect for families or groups who want to enjoy nature while staying close to the city center.',
  6,
  3,
  2,
  9500,
  'Urban Zen',
  'Nature',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e7?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddh?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3l?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3m?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Lake View", "Balcony", "Parking"], "highlights": ["Lake Views", "Nature", "Family-Friendly", "Peaceful Location"]}',
  'The lake views are absolutely breathtaking. It''s the perfect balance of nature and city life. Great for families who want to escape the hustle while staying connected.',
  '[{"name": "Vikram S.", "rating": 4, "comment": "Beautiful lake views!", "date": "2024-02-10"}]',
  'https://www.youtube.com/watch?v=example6',
  'https://www.youtube.com/watch?v=virtual6',
  ARRAY['Lake Views', 'Nature Setting', 'Family-Friendly', 'Peaceful Atmosphere']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'BKC Executive Suite',
  'Bandra Kurla Complex, Mumbai',
  'A luxurious executive suite in Mumbai''s premier business district. Perfect for business travelers who need comfort, convenience, and access to corporate facilities.',
  4,
  2,
  2,
  18000,
  'Art & Culture',
  'Luxury',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e8?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddi?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3n?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3o?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Business Center", "Gym", "Concierge"], "highlights": ["Business District", "Luxury Amenities", "Corporate Access", "Premium Location"]}',
  'Perfect for business travel. The location in BKC is ideal for meetings, and the luxury amenities make it feel like a 5-star hotel. Highly recommended for executives.',
  '[{"name": "Arjun M.", "rating": 5, "comment": "Perfect for business travel!", "date": "2024-02-15"}]',
  'https://www.youtube.com/watch?v=example7',
  'https://www.youtube.com/watch?v=virtual7',
  ARRAY['Business District', 'Luxury Amenities', 'Corporate Access', 'Premium Location']
) ON CONFLICT DO NOTHING;

INSERT INTO properties (name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials, virtual_tour_url, video_url, highlights) VALUES
(
  'Khar Bohemian House',
  'Khar, Mumbai',
  'A charming bohemian-style house with eclectic decor and a vibrant atmosphere. Perfect for creative souls who appreciate unique design and artistic expression.',
  5,
  2,
  2,
  6800,
  'Heritage',
  'Bohemian',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e9?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddj?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3p?w=800', 'https://images.unsplash.com/photo-1560448204-5c3b6c2b3b3q?w=800'],
  '{"amenities": ["WiFi", "Air Conditioning", "Kitchen", "Garden", "Art Studio", "Music Room"], "highlights": ["Bohemian Decor", "Artistic Atmosphere", "Garden", "Creative Space"]}',
  'This bohemian house is a work of art itself. The eclectic decor and artistic atmosphere inspired my creativity. The garden is perfect for morning coffee and evening gatherings.',
  '[{"name": "Zara K.", "rating": 5, "comment": "Artistic and inspiring!", "date": "2024-02-20"}]',
  'https://www.youtube.com/watch?v=example8',
  'https://www.youtube.com/watch?v=virtual8',
  ARRAY['Bohemian Decor', 'Artistic Atmosphere', 'Private Garden', 'Creative Space']
) ON CONFLICT DO NOTHING;

-- 👥 Insert User Profiles (these will work with your schema)
INSERT INTO user_profiles (id, full_name, phone, date_of_birth, nationality, profile_image_url, bio, preferred_language, marketing_consent, newsletter_subscribed, preferences) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Priya Sharma',
  '+919876543210',
  '1990-05-15',
  'Indian',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
  'Digital nomad and travel enthusiast. Love exploring new cultures and cuisines.',
  'en',
  true,
  true,
  '{"preferred_categories": ["Art & Culture", "Urban Zen"], "budget_range": [5000, 15000], "amenities": ["WiFi", "Kitchen"]}'
) ON CONFLICT DO NOTHING;

INSERT INTO user_profiles (id, full_name, phone, date_of_birth, nationality, profile_image_url, bio, preferred_language, marketing_consent, newsletter_subscribed, preferences) VALUES
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Raj Malhotra',
  '+919876543211',
  '1985-08-22',
  'Indian',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'Business executive who appreciates luxury and comfort while traveling.',
  'en',
  true,
  false,
  '{"preferred_categories": ["Art & Culture"], "budget_range": [10000, 20000], "amenities": ["Business Center", "Gym"]}'
) ON CONFLICT DO NOTHING;

INSERT INTO user_profiles (id, full_name, phone, date_of_birth, nationality, profile_image_url, bio, preferred_language, marketing_consent, newsletter_subscribed, preferences) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Meera Patel',
  '+919876543212',
  '1992-12-10',
  'Indian',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'Artist and creative professional. Always looking for inspiring spaces.',
  'en',
  true,
  true,
  '{"preferred_categories": ["Art & Culture", "Heritage"], "budget_range": [4000, 12000], "amenities": ["Art Studio", "Natural Light"]}'
) ON CONFLICT DO NOTHING;

-- 📅 Insert Sample Bookings (now these should work with user_profiles)
INSERT INTO bookings (property_id, user_id, check_in, check_out, guests, total_amount, special_requests, confirmation_code, status, guest_details, payment_status) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', '2024-02-15', '2024-02-18', 2, 25500, 'Early check-in if possible', 'BK20240215001', 'confirmed', '{"guest_name": "Priya Sharma", "phone": "+919876543210", "email": "priya@example.com"}', 'completed') ON CONFLICT DO NOTHING;

INSERT INTO bookings (property_id, user_id, check_in, check_out, guests, total_amount, special_requests, confirmation_code, status, guest_details, payment_status) VALUES
(2, '550e8400-e29b-41d4-a716-446655440002', '2024-02-20', '2024-02-25', 4, 60000, 'Late check-out requested', 'BK20240220001', 'confirmed', '{"guest_name": "Raj Malhotra", "phone": "+919876543211", "email": "raj@example.com"}', 'completed') ON CONFLICT DO NOTHING;

INSERT INTO bookings (property_id, user_id, check_in, check_out, guests, total_amount, special_requests, confirmation_code, status, guest_details, payment_status) VALUES
(3, '550e8400-e29b-41d4-a716-446655440003', '2024-02-10', '2024-02-12', 2, 30000, 'Quiet room preferred', 'BK20240210001', 'confirmed', '{"guest_name": "Meera Patel", "phone": "+919876543212", "email": "meera@example.com"}', 'completed') ON CONFLICT DO NOTHING;

-- 💳 Insert Payment Records
INSERT INTO booking_payments (booking_id, payment_id, payment_method, amount, currency, status, payment_gateway, gateway_response) VALUES
(1, 'pay_1234567890', 'card', 25500, 'INR', 'completed', 'razorpay', '{"transaction_id": "txn_123456", "status": "success"}') ON CONFLICT DO NOTHING;

INSERT INTO booking_payments (booking_id, payment_id, payment_method, amount, currency, status, payment_gateway, gateway_response) VALUES
(2, 'pay_1234567891', 'card', 60000, 'INR', 'completed', 'razorpay', '{"transaction_id": "txn_123457", "status": "success"}') ON CONFLICT DO NOTHING;

INSERT INTO booking_payments (booking_id, payment_id, payment_method, amount, currency, status, payment_gateway, gateway_response) VALUES
(3, 'pay_1234567892', 'upi', 30000, 'INR', 'completed', 'razorpay', '{"transaction_id": "txn_123458", "status": "success"}') ON CONFLICT DO NOTHING;

-- ⭐ Insert Property Reviews
INSERT INTO property_reviews (property_id, user_id, booking_id, rating, title, review_text, photos, verified_stay, helpful_votes) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', 1, 5, 'Perfect Art-Inspired Getaway', 'The Bandra Art Loft exceeded all expectations. The art collection is stunning and the location is perfect for exploring Bandra. The high ceilings and natural light create an inspiring atmosphere.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'], true, 12) ON CONFLICT DO NOTHING;

INSERT INTO property_reviews (property_id, user_id, booking_id, rating, title, review_text, photos, verified_stay, helpful_votes) VALUES
(2, '550e8400-e29b-41d4-a716-446655440002', 2, 4, 'Beautiful Heritage Experience', 'The Colaba Heritage Villa is a perfect blend of history and comfort. The colonial architecture is preserved beautifully while providing all modern amenities. The garden is a peaceful retreat.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e3?w=400'], true, 8) ON CONFLICT DO NOTHING;

INSERT INTO property_reviews (property_id, user_id, booking_id, rating, title, review_text, photos, verified_stay, helpful_votes) VALUES
(3, '550e8400-e29b-41d4-a716-446655440003', 3, 5, 'Zen Paradise with Sea Views', 'The Worli Zen Penthouse is absolutely magical. The sea views are breathtaking and the zen atmosphere helped me find complete peace. The meditation room is perfect for daily practice.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e4?w=400'], true, 15) ON CONFLICT DO NOTHING;

-- ❤️ Insert User Favorites
INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1) ON CONFLICT DO NOTHING;

INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 3) ON CONFLICT DO NOTHING;

INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', 2) ON CONFLICT DO NOTHING;

INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', 7) ON CONFLICT DO NOTHING;

INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440003', 1) ON CONFLICT DO NOTHING;

INSERT INTO user_favorites (user_id, property_id) VALUES
('550e8400-e29b-41d4-a716-446655440003', 8) ON CONFLICT DO NOTHING;

-- 🏪 Insert Neighborhood Guides
INSERT INTO neighborhood_guides (property_id, category, title, description, location_name, distance_meters, rating, price_range, opening_hours, contact_info, images) VALUES
(1, 'Restaurants', 'Bandra''s Best Cafes', 'Discover the trendiest cafes and restaurants in Bandra West, from artisanal coffee shops to fine dining experiences.', 'Bandra West', 500, 4.5, '₹₹-₹₹₹', '{"monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "7:00-23:00", "saturday": "8:00-23:00", "sunday": "8:00-22:00"}', '{"phone": "+91-22-2645-1234", "email": "info@bandracafes.com"}', ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400']) ON CONFLICT DO NOTHING;

INSERT INTO neighborhood_guides (property_id, category, title, description, location_name, distance_meters, rating, price_range, opening_hours, contact_info, images) VALUES
(2, 'Attractions', 'Colaba''s Historical Sites', 'Explore the rich history of Colaba with visits to Gateway of India, Taj Mahal Palace, and other iconic landmarks.', 'Colaba', 800, 4.8, 'Free-₹₹', '{"monday": "6:00-18:00", "tuesday": "6:00-18:00", "wednesday": "6:00-18:00", "thursday": "6:00-18:00", "friday": "6:00-18:00", "saturday": "6:00-18:00", "sunday": "6:00-18:00"}', '{"phone": "+91-22-2202-1234", "email": "tourism@mumbai.gov.in"}', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']) ON CONFLICT DO NOTHING;

INSERT INTO neighborhood_guides (property_id, category, title, description, location_name, distance_meters, rating, price_range, opening_hours, contact_info, images) VALUES
(3, 'Wellness', 'Worli''s Wellness Centers', 'Find your inner peace at Worli''s premium wellness centers, yoga studios, and meditation spaces.', 'Worli', 300, 4.6, '₹₹-₹₹₹', '{"monday": "6:00-21:00", "tuesday": "6:00-21:00", "wednesday": "6:00-21:00", "thursday": "6:00-21:00", "friday": "6:00-21:00", "saturday": "7:00-20:00", "sunday": "7:00-20:00"}', '{"phone": "+91-22-2493-1234", "email": "wellness@worli.com"}', ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400']) ON CONFLICT DO NOTHING;

-- 📧 Insert Newsletter Subscriptions
INSERT INTO newsletter_subscriptions (email, full_name, subscription_status, subscription_source, preferences) VALUES
('priya@example.com', 'Priya Sharma', 'active', 'website', '{"interests": ["Art & Culture", "Travel Tips"], "frequency": "weekly"}') ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscriptions (email, full_name, subscription_status, subscription_source, preferences) VALUES
('raj@example.com', 'Raj Malhotra', 'active', 'website', '{"interests": ["Luxury Travel", "Business"], "frequency": "monthly"}') ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscriptions (email, full_name, subscription_status, subscription_source, preferences) VALUES
('meera@example.com', 'Meera Patel', 'active', 'website', '{"interests": ["Art & Culture", "Creative Spaces"], "frequency": "weekly"}') ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscriptions (email, full_name, subscription_status, subscription_source, preferences) VALUES
('guest@example.com', 'Guest User', 'active', 'website', '{"interests": ["Travel", "Culture"], "frequency": "monthly"}') ON CONFLICT DO NOTHING;

-- 📊 Insert User Activity Log
INSERT INTO user_activity_log (user_id, activity_type, ip_address, user_agent, activity_data) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'property_view', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"property_id": 1, "duration": 120}') ON CONFLICT DO NOTHING;

INSERT INTO user_activity_log (user_id, activity_type, ip_address, user_agent, activity_data) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'booking_created', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"booking_id": 1, "property_id": 1}') ON CONFLICT DO NOTHING;

INSERT INTO user_activity_log (user_id, activity_type, ip_address, user_agent, activity_data) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'property_view', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '{"property_id": 2, "duration": 180}') ON CONFLICT DO NOTHING;

INSERT INTO user_activity_log (user_id, activity_type, ip_address, user_agent, activity_data) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'review_submitted', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '{"review_id": 3, "property_id": 3}') ON CONFLICT DO NOTHING;

-- 🎯 Insert Property Suggestions
INSERT INTO property_suggestions (suggested_property_id, user_preferences) VALUES
(1, '{"user_interests": ["Art & Culture"], "budget_range": [5000, 15000], "location_preference": "Bandra"}') ON CONFLICT DO NOTHING;

INSERT INTO property_suggestions (suggested_property_id, user_preferences) VALUES
(3, '{"user_interests": ["Wellness", "Peace"], "budget_range": [8000, 20000], "location_preference": "Worli"}') ON CONFLICT DO NOTHING;

INSERT INTO property_suggestions (suggested_property_id, user_preferences) VALUES
(2, '{"user_interests": ["History", "Heritage"], "budget_range": [10000, 15000], "location_preference": "Colaba"}') ON CONFLICT DO NOTHING;

-- 🏠 Insert Property Amenities
INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(1, 'Entertainment', 'Art Gallery', 'Private art collection with rotating exhibitions', '🎨', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(1, 'Workspace', 'Creative Studio', 'Dedicated workspace for artists and creators', '🎭', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(2, 'Outdoor', 'Private Garden', 'Beautiful colonial-style garden with seating', '🌿', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(2, 'Entertainment', 'Library', 'Curated collection of books and periodicals', '📚', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(3, 'Wellness', 'Meditation Room', 'Peaceful space for meditation and yoga', '🧘', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(3, 'Outdoor', 'Zen Garden', 'Japanese-inspired meditation garden', '🌸', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(4, 'Location', 'Beach Access', 'Direct access to Juhu Beach', '🏖️', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(4, 'Entertainment', 'Sunset Deck', 'Perfect spot for evening relaxation', '🌅', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(5, 'Business', 'Meeting Room', 'Professional meeting space with AV equipment', '💼', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(5, 'Technology', 'High-Speed WiFi', 'Fiber-optic internet for seamless work', '📶', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(6, 'Nature', 'Lake View', 'Panoramic views of Powai Lake', '🏞️', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(6, 'Outdoor', 'Balcony', 'Spacious balcony with lake views', '🌊', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(7, 'Business', 'Business Center', 'Full-service business facilities', '🏢', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(7, 'Fitness', 'Gym Access', '24/7 access to fitness center', '💪', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(8, 'Creative', 'Art Studio', 'Dedicated space for artistic pursuits', '🎨', true) ON CONFLICT DO NOTHING;

INSERT INTO property_amenities (property_id, category, name, description, icon, available) VALUES
(8, 'Entertainment', 'Music Room', 'Soundproof room with instruments', '🎵', true) ON CONFLICT DO NOTHING;

-- ✅ Success Message
SELECT 'Database populated successfully! 🎉' as message; 