-- Seed Properties for Infiniti Casa
-- This migration populates the database with 8 curated boutique properties

-- Clear existing data (for development)
DELETE FROM properties WHERE id > 0;
ALTER SEQUENCE properties_id_seq RESTART WITH 1;

-- Property 1: Art & Culture - Purple/Pink aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Artisan Loft & Gallery',
    'Kala Ghoda, Fort',
    'A stunning loft space that doubles as a contemporary art gallery. This unique property features rotating exhibitions, an artist studio, and panoramic views of Mumbai''s historic Fort district. Perfect for art enthusiasts and cultural explorers.',
    4,
    2,
    2,
    8500.00,
    'Art & Culture',
    'contemporary art gallery',
    ARRAY[
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Art Gallery Access", "Artist Studio", "Exhibition Space", "High-Speed WiFi", "Kitchen", "Balcony", "Air Conditioning", "Security"], "highlights": ["Rotating Art Exhibitions", "Cultural District Location", "Artist Meet & Greets", "Gallery Tours"]}',
    'Nestled in the heart of Mumbai''s art district, this loft tells the story of creativity and culture. Once a colonial warehouse, it has been transformed into a living gallery where every wall speaks of artistic expression. Guests can interact with local artists, attend gallery openings, and immerse themselves in Mumbai''s vibrant art scene.',
    '[
        {"name": "Priya Sharma", "rating": 5, "comment": "As an art collector, this was a dream come true. The rotating exhibitions and artist interactions made my stay unforgettable."},
        {"name": "David Chen", "rating": 5, "comment": "The perfect blend of luxury accommodation and cultural immersion. The gallery space is breathtaking."}
    ]'
);

-- Property 2: Heritage - Gold/Amber aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Colonial Garden Villa',
    'Colaba, South Mumbai',
    'A meticulously restored colonial villa with a private tropical garden. This heritage property features original architectural details, vintage furnishings, and a peaceful garden oasis in the heart of bustling Colaba. Experience the grandeur of old Bombay.',
    6,
    3,
    3,
    12000.00,
    'Heritage',
    'colonial grandeur',
    ARRAY[
        'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2506924/pexels-photo-2506924.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2506925/pexels-photo-2506925.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Private Garden", "Vintage Furnishings", "Library", "Butler Service", "High Tea Service", "Air Conditioning", "Security", "Parking"], "highlights": ["Colonial Architecture", "Historical Significance", "Garden Parties", "Heritage Tours"]}',
    'Built in 1923, this colonial villa has witnessed the transformation of Bombay into Mumbai. Each room tells a story of the city''s rich history, from the original teak woodwork to the stained glass windows. The garden, planted by the original British owners, continues to bloom with century-old trees and exotic flowers.',
    '[
        {"name": "Margaret Thompson", "rating": 5, "comment": "A magical step back in time. The colonial charm and garden tranquility made our family vacation extraordinary."},
        {"name": "Rajesh Mehta", "rating": 5, "comment": "Perfect for our anniversary celebration. The heritage atmosphere and butler service exceeded all expectations."}
    ]'
);

-- Property 3: Urban Zen - Blue/Cyan aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Minimalist Sky Suite',
    'Lower Parel, Central Mumbai',
    'A zen-inspired minimalist suite with floor-to-ceiling windows offering panoramic city views. This urban sanctuary features clean lines, natural materials, and a meditation space. Perfect for business travelers and wellness seekers.',
    2,
    1,
    1,
    6800.00,
    'Urban Zen',
    'minimalist zen',
    ARRAY[
        'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2581923/pexels-photo-2581923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2581924/pexels-photo-2581924.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Meditation Space", "Yoga Studio", "Floor-to-Ceiling Windows", "Smart Home System", "Air Purification", "High-Speed WiFi", "Kitchen", "Balcony"], "highlights": ["City Skyline Views", "Wellness Programs", "Business Facilities", "Zen Atmosphere"]}',
    'Designed as an urban retreat, this sky suite embodies the philosophy of less is more. Every element has been carefully curated to create a sense of calm and clarity. The meditation space, with its panoramic views, offers a perfect escape from the city''s hustle while keeping you connected to its energy.',
    '[
        {"name": "Sarah Johnson", "rating": 5, "comment": "The perfect business retreat. The zen atmosphere helped me focus and the city views were inspiring."},
        {"name": "Amit Patel", "rating": 5, "comment": "A true urban sanctuary. The minimalist design and meditation space made my stay incredibly peaceful."}
    ]'
);

-- Property 4: Studio - Green/Teal aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Creative Studio Loft',
    'Bandra West',
    'A vibrant creative studio loft designed for artists, writers, and digital nomads. This contemporary space features a dedicated workspace, art supplies, and a rooftop terrace. Perfect for creative professionals and solo travelers.',
    2,
    1,
    1,
    5200.00,
    'Studio',
    'creative contemporary',
    ARRAY[
        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Dedicated Workspace", "Art Supplies", "Rooftop Terrace", "High-Speed WiFi", "Kitchen", "Air Conditioning", "Security", "Creative Library"], "highlights": ["Artist Community", "Creative Workshops", "Rooftop Events", "Digital Nomad Friendly"]}',
    'This studio loft was created for the creative soul. Located in the artistic heart of Bandra, it serves as both a living space and a creative workshop. The rooftop terrace hosts regular art events and creative meetups, making it a hub for Mumbai''s creative community.',
    '[
        {"name": "Anita Reddy", "rating": 5, "comment": "As a freelance designer, this was the perfect workspace. The creative atmosphere and artist community were inspiring."},
        {"name": "Marcus Chen", "rating": 5, "comment": "The rooftop terrace and creative workshops made my stay unforgettable. Perfect for digital nomads."}
    ]'
);

-- Property 5: Penthouse - Multi-color luxury aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Luxury Sky Penthouse',
    'Worli Sea Face',
    'An ultra-luxurious penthouse with 360-degree views of the Arabian Sea and Mumbai skyline. This exclusive property features premium amenities, private terrace, and personalized concierge service. The epitome of luxury living.',
    8,
    4,
    4,
    18000.00,
    'Penthouse',
    'luxury premium',
    ARRAY[
        'https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Private Terrace", "Infinity Pool", "Personal Chef", "Concierge Service", "Home Theater", "Wine Cellar", "Gym", "Helipad Access"], "highlights": ["360° Sea Views", "Celebrity Neighbors", "Exclusive Events", "Luxury Services"]}',
    'Perched atop one of Mumbai''s most prestigious addresses, this penthouse represents the pinnacle of luxury living. Every detail has been crafted to provide an unparalleled experience, from the infinity pool overlooking the Arabian Sea to the private chef who can prepare any cuisine. This is where dreams become reality.',
    '[
        {"name": "David Mitchell", "rating": 5, "comment": "Absolutely spectacular! The views, amenities, and service exceeded all expectations. Worth every penny."},
        {"name": "Priya Kapoor", "rating": 5, "comment": "The perfect venue for our family celebration. The luxury and exclusivity made it truly special."}
    ]'
);

-- Property 6: Heritage - Gold/Amber aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Victorian Heritage House',
    'Byculla, Central Mumbai',
    'A beautifully restored Victorian mansion with original stained glass, ornate woodwork, and period furnishings. This heritage property offers a glimpse into Mumbai''s colonial past while providing modern comforts.',
    4,
    2,
    2,
    9500.00,
    'Heritage',
    'victorian elegance',
    ARRAY[
        'https://images.pexels.com/photos/2506926/pexels-photo-2506926.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2506927/pexels-photo-2506927.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/2506928/pexels-photo-2506928.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Original Stained Glass", "Period Furnishings", "Library", "Garden", "Air Conditioning", "Security", "Parking", "Historical Tours"], "highlights": ["Victorian Architecture", "Historical Significance", "Period Decor", "Cultural Heritage"]}',
    'Built in 1895, this Victorian mansion has been lovingly restored to its former glory. The original stained glass windows, ornate woodwork, and period furnishings transport guests to a bygone era. Each room tells a story of Mumbai''s rich colonial heritage.',
    '[
        {"name": "Elizabeth Brown", "rating": 5, "comment": "A magnificent piece of history. The Victorian charm and period details were absolutely enchanting."},
        {"name": "Arjun Singh", "rating": 5, "comment": "Perfect for experiencing Mumbai''s colonial heritage. The restoration work is impeccable."}
    ]'
);

-- Property 7: Urban Zen - Blue/Cyan aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Ocean View Zen Retreat',
    'Bandra West',
    'A peaceful zen retreat with uninterrupted ocean views. This minimalist property features natural materials, meditation spaces, and a rooftop yoga deck. Perfect for wellness retreats and spiritual seekers.',
    3,
    2,
    2,
    7800.00,
    'Urban Zen',
    'ocean zen',
    ARRAY[
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Ocean Views", "Meditation Room", "Rooftop Yoga Deck", "Natural Materials", "Air Purification", "High-Speed WiFi", "Kitchen", "Balcony"], "highlights": ["Sunrise Yoga", "Meditation Sessions", "Wellness Programs", "Ocean Serenity"]}',
    'Designed as a sanctuary for the soul, this zen retreat offers a perfect balance of tranquility and luxury. The ocean views provide a constant reminder of nature''s beauty, while the meditation spaces and yoga deck offer opportunities for inner peace and reflection.',
    '[
        {"name": "Yoga Master Deepak", "rating": 5, "comment": "The perfect setting for my wellness retreat. The ocean views and meditation spaces are truly transformative."},
        {"name": "Emma Wilson", "rating": 5, "comment": "A beautiful zen sanctuary. The sunrise yoga sessions on the rooftop were absolutely magical."}
    ]'
);

-- Property 8: Art & Culture - Purple/Pink aesthetic
INSERT INTO properties (
    name, location, description, guests, bedrooms, bathrooms, price, 
    category, aesthetic, images, features, story, testimonials
) VALUES (
    'Bohemian Artist Villa',
    'Juhu, North Mumbai',
    'A vibrant bohemian villa that serves as both accommodation and artist residency. This colorful property features art installations, creative workshops, and a garden studio. Perfect for artists and creative souls.',
    5,
    3,
    2,
    7200.00,
    'Art & Culture',
    'bohemian artistic',
    ARRAY[
        'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    '{"amenities": ["Art Studio", "Garden", "Creative Workshops", "Art Supplies", "High-Speed WiFi", "Kitchen", "Air Conditioning", "Security"], "highlights": ["Artist Residency", "Creative Workshops", "Art Installations", "Bohemian Atmosphere"]}',
    'This bohemian villa is a living canvas where art and life merge seamlessly. Every corner tells a story of creativity, from the hand-painted murals to the garden studio where artists work. The property hosts regular creative workshops and art events, making it a hub for Mumbai''s artistic community.',
    '[
        {"name": "Creative Director Maya", "rating": 5, "comment": "An inspiring creative space. The art installations and workshops made my stay incredibly productive."},
        {"name": "Photographer Alex", "rating": 5, "comment": "The perfect artist residency. The bohemian atmosphere and creative community were exactly what I needed."}
    ]'
);

-- Create admin user for property management
INSERT INTO user_profiles (
    phone, full_name, email, role, is_verified, preferences
) VALUES (
    '+91-9876543210',
    'Infiniti Casa Admin',
    'admin@infiniticasa.com',
    'admin',
    true,
    '{"notifications": true, "language": "en"}'
);

-- Create sample newsletter subscription
INSERT INTO newsletter_subscriptions (
    email, phone, full_name, subscription_status, subscription_source
) VALUES (
    'newsletter@infiniticasa.com',
    '+91-9876543210',
    'Infiniti Casa Newsletter',
    'active',
    'system'
);

-- Log the seeding activity
INSERT INTO user_activity_log (
    user_id, activity_type, activity_data
) VALUES (
    (SELECT id FROM user_profiles WHERE phone = '+91-9876543210'),
    'database_seeding',
    '{"properties_added": 8, "admin_created": true, "newsletter_created": true}'
); 