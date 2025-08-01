/*
  # Seed Enhanced Data

  Add enhanced property data, amenities, and neighborhood guides
*/

-- Update existing properties with enhanced data
UPDATE properties SET 
  virtual_tour_url = 'https://example.com/virtual-tour/' || id,
  video_url = 'https://example.com/property-video/' || id,
  highlights = CASE 
    WHEN id = 1 THEN ARRAY['Private art studio with professional lighting', 'Rotating contemporary art exhibitions', 'Walking distance to Bandra''s art district', 'Cultural concierge services']
    WHEN id = 2 THEN ARRAY['Original Portuguese colonial architecture', 'Private tropical garden sanctuary', 'Heritage furniture and artifacts', 'Walking distance to heritage sites']
    WHEN id = 3 THEN ARRAY['Dedicated meditation pavilion', 'Indoor koi pond and water features', 'Japanese tea ceremony room', 'Minimalist luxury design']
    WHEN id = 4 THEN ARRAY['Grand colonial mansion architecture', 'Curated Indian art collection', 'Traditional courtyard with fountain', 'Personal butler service']
    WHEN id = 5 THEN ARRAY['Pure Scandinavian design aesthetic', 'Floor-to-ceiling windows', 'Cozy reading nook with books', 'Compact luxury living']
    WHEN id = 6 THEN ARRAY['360-degree Mumbai skyline views', 'Private rooftop infinity pool', 'Smart home automation', '24/7 luxury concierge']
    ELSE ARRAY[]::TEXT[]
  END;

-- Insert property amenities
INSERT INTO property_amenities (property_id, category, name, description, icon) VALUES
-- Bandra Art House amenities
(1, 'Creative', 'Art Studio', 'Professional lighting and easels for creative work', 'Palette'),
(1, 'Technology', 'Gallery Lighting', 'Museum-quality lighting system', 'Lightbulb'),
(1, 'Service', 'Cultural Concierge', 'Access to Mumbai''s art galleries and exhibitions', 'Users'),
(1, 'Comfort', 'High-Speed WiFi', 'Fiber optic internet connection', 'Wifi'),
(1, 'Kitchen', 'Gourmet Kitchen', 'Fully equipped modern kitchen', 'ChefHat'),

-- Bandra Cottage amenities
(2, 'Heritage', 'Colonial Architecture', 'Authentic 1900s Portuguese design', 'Home'),
(2, 'Outdoor', 'Private Garden', 'Lush tropical garden with heritage trees', 'Trees'),
(2, 'Culture', 'Vintage Library', 'Curated Mumbai history collection', 'BookOpen'),
(2, 'Comfort', 'Modern Amenities', 'Contemporary comforts within heritage walls', 'Star'),
(2, 'Kitchen', 'Heritage Kitchen', 'Traditional design with modern appliances', 'ChefHat'),

-- City Zen amenities
(3, 'Wellness', 'Meditation Pavilion', 'Dedicated zen space with city views', 'Mountain'),
(3, 'Water', 'Koi Pond', 'Indoor water features for tranquility', 'Waves'),
(3, 'Culture', 'Tea Ceremony Room', 'Traditional Japanese tea space', 'Coffee'),
(3, 'Design', 'Minimalist Interiors', 'Clutter-free spaces for mental clarity', 'Minimize'),
(3, 'Technology', 'Smart Home', 'Automated lighting and climate control', 'Smartphone'),

-- India House amenities
(4, 'Heritage', 'Colonial Mansion', 'Grand architecture with Indian elements', 'Building'),
(4, 'Art', 'Heritage Artifacts', 'Curated Indian art and antiques', 'Palette'),
(4, 'Outdoor', 'Courtyard Garden', 'Traditional Indian courtyard with fountain', 'Fountain'),
(4, 'Service', 'Butler Service', 'Traditional Indian hospitality', 'UserCheck'),
(4, 'Luxury', 'Premium Furnishing', 'Antique furniture and luxury textiles', 'Crown'),

-- Little White Studio amenities
(5, 'Design', 'Scandinavian Aesthetic', 'Pure white design with wood accents', 'Home'),
(5, 'Comfort', 'Reading Nook', 'Cozy corner with curated books', 'BookOpen'),
(5, 'Light', 'Natural Lighting', 'Floor-to-ceiling windows', 'Sun'),
(5, 'Quality', 'Premium Materials', 'High-quality finishes in compact space', 'Award'),
(5, 'Kitchen', 'Compact Kitchen', 'Efficient design with premium appliances', 'ChefHat'),

-- Sky Lounge amenities
(6, 'Views', 'Panoramic Views', '360-degree Mumbai skyline and sea views', 'Eye'),
(6, 'Luxury', 'Sky Terrace', 'Private rooftop with infinity pool', 'Waves'),
(6, 'Technology', 'Smart Automation', 'Fully automated luxury systems', 'Smartphone'),
(6, 'Service', 'Concierge Service', '24/7 luxury concierge and valet', 'Bell'),
(6, 'Entertainment', 'Home Theater', 'Premium entertainment system', 'Monitor');

-- Insert neighborhood guides
INSERT INTO neighborhood_guides (property_id, category, title, description, location_name, distance_meters, rating, price_range, images) VALUES
-- Bandra Art House neighborhood
(1, 'Dining', 'Toto''s Garage', 'Iconic Bandra restaurant with European cuisine', 'Toto''s Garage, Bandra West', 300, 4.5, '₹₹₹', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(1, 'Culture', 'Bandra Art Gallery', 'Contemporary art space showcasing local artists', 'Chapel Road, Bandra West', 150, 4.7, '₹', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(1, 'Shopping', 'Linking Road', 'Famous shopping street for fashion and accessories', 'Linking Road, Bandra West', 500, 4.2, '₹₹', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']),

-- Bandra Cottage neighborhood
(2, 'Heritage', 'Mount Mary Church', 'Historic Catholic church with stunning architecture', 'Mount Mary Church, Bandra West', 400, 4.8, 'Free', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(2, 'Dining', 'Candies', 'Legendary Bandra cafe serving continental cuisine', 'Pali Hill, Bandra West', 250, 4.4, '₹₹', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(2, 'Nature', 'Bandstand Promenade', 'Scenic waterfront walkway with sea views', 'Bandstand, Bandra West', 600, 4.6, 'Free', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']),

-- City Zen neighborhood
(3, 'Business', 'Phoenix Mills', 'Premium shopping and business complex', 'Phoenix Mills, Lower Parel', 200, 4.5, '₹₹₹', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(3, 'Dining', 'Trishna', 'Award-winning seafood restaurant', 'Lower Parel', 300, 4.8, '₹₹₹₹', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(3, 'Wellness', 'The Yoga Institute', 'Historic yoga center for meditation', 'Lower Parel', 400, 4.7, '₹₹', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']),

-- India House neighborhood
(4, 'Heritage', 'Gateway of India', 'Iconic Mumbai monument and tourist attraction', 'Apollo Bunder, Colaba', 300, 4.9, 'Free', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(4, 'Luxury', 'Taj Mahal Palace Hotel', 'Legendary luxury hotel and dining destination', 'Apollo Bunder, Colaba', 200, 4.8, '₹₹₹₹', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(4, 'Shopping', 'Colaba Causeway', 'Vibrant street market for souvenirs and fashion', 'Colaba Causeway', 400, 4.3, '₹₹', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']),

-- Little White Studio neighborhood
(5, 'Cafe', 'Elbow Room', 'Cozy cafe perfect for work and relaxation', 'Bandra West', 100, 4.6, '₹₹', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(5, 'Culture', 'Prithvi Theatre', 'Iconic theater showcasing contemporary plays', 'Juhu', 800, 4.7, '₹₹', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(5, 'Beach', 'Juhu Beach', 'Famous Mumbai beach for sunset walks', 'Juhu', 1000, 4.2, 'Free', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']),

-- Sky Lounge neighborhood
(6, 'Dining', 'Worli Social', 'Trendy restaurant with Mumbai skyline views', 'Worli', 300, 4.5, '₹₹₹', ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg']),
(6, 'Landmark', 'Bandra-Worli Sea Link', 'Iconic cable-stayed bridge with stunning views', 'Worli', 100, 4.9, 'Free', ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
(6, 'Shopping', 'Palladium Mall', 'Luxury shopping destination', 'Lower Parel', 500, 4.4, '₹₹₹', ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg']);

-- Insert sample reviews
INSERT INTO property_reviews (property_id, user_id, rating, title, review_text, verified_stay) VALUES
(1, NULL, 5, 'Artistic Paradise in Mumbai', 'The Art House exceeded all expectations. Living surrounded by rotating art exhibitions was like staying in a private gallery. The studio space was perfect for my creative work.', true),
(1, NULL, 5, 'Cultural Immersion at its Best', 'Perfect location in Bandra''s art district. The cultural concierge helped us discover amazing local galleries and artist studios. Truly authentic Mumbai experience.', true),
(2, NULL, 5, 'Heritage Charm with Modern Comfort', 'The Cottage is a beautiful blend of old-world charm and modern amenities. The private garden is a peaceful oasis in busy Mumbai.', true),
(3, NULL, 5, 'Zen Sanctuary in the City', 'City Zen provided the perfect escape from Mumbai''s intensity. The meditation pavilion and minimalist design created such a calming atmosphere.', true),
(4, NULL, 5, 'Royal Treatment in Colaba', 'India House is absolutely magnificent. The colonial architecture and personal butler service made us feel like royalty in the heart of Mumbai.', true),
(5, NULL, 5, 'Perfect Romantic Getaway', 'The Little White Studio was ideal for our romantic weekend. The Scandinavian design and cozy reading nook created such an intimate atmosphere.', true),
(6, NULL, 5, 'Luxury Redefined', 'Sky Lounge offers unparalleled luxury with breathtaking views. The rooftop infinity pool and smart home features are world-class.', true);