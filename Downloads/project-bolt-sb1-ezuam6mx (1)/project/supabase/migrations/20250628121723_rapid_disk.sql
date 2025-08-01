/*
  # Seed Properties Data

  Insert the initial property data for Infiniti Casa Mumbai collection
*/

INSERT INTO properties (
  name, location, description, guests, bedrooms, bathrooms, price, category, aesthetic, images, features, story, testimonials
) VALUES 
(
  'Bandra Art House',
  'Bandra West, Mumbai',
  'Contemporary art-filled sanctuary in Mumbai''s cultural heart',
  6, 3, 3, 8500,
  'Art & Culture',
  'contemporary-art',
  ARRAY[
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Palette", "name": "Curated Art Collection", "description": "Rotating exhibitions featuring contemporary Mumbai artists"},
    {"icon": "Coffee", "name": "Artist Studio", "description": "Dedicated creative space with professional lighting and easels"},
    {"icon": "Wifi", "name": "Gallery Lighting", "description": "Museum-quality lighting system throughout the space"},
    {"icon": "Building", "name": "Cultural Concierge", "description": "Exclusive access to Mumbai''s art galleries and exhibitions"}
  ]'::jsonb,
  'Nestled in the vibrant heart of Bandra West, the Art House stands as a testament to Mumbai''s thriving contemporary art scene. This carefully curated space showcases rotating exhibitions from local and international artists, creating an ever-evolving gallery experience within your home. Every corner tells a story, every wall breathes creativity, making this more than just accommodation—it''s an immersive cultural journey.',
  '[
    {"text": "Staying at the Art House was like living inside a gallery. The rotating art collection and creative atmosphere inspired our entire Mumbai experience.", "author": "Priya S., Delhi", "rating": 5},
    {"text": "The perfect blend of artistic inspiration and luxury comfort. Every morning felt like discovering a new masterpiece.", "author": "David M., London", "rating": 5}
  ]'::jsonb
),
(
  'Bandra Cottage',
  'Bandra West, Mumbai',
  'Charming heritage cottage with modern comforts',
  4, 2, 2, 6200,
  'Heritage',
  'heritage-charm',
  ARRAY[
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Home", "name": "Heritage Architecture", "description": "Authentic 1900s Portuguese colonial design elements"},
    {"icon": "Mountain", "name": "Private Garden", "description": "Lush tropical garden with heritage mango trees"},
    {"icon": "Coffee", "name": "Vintage Library", "description": "Curated collection of Mumbai history and literature"},
    {"icon": "Wifi", "name": "Modern Amenities", "description": "Contemporary comforts within heritage walls"}
  ]'::jsonb,
  'The Bandra Cottage preserves the old-world charm of Mumbai''s colonial past while embracing modern luxury. This heritage property, dating back to the early 1900s, has been lovingly restored to maintain its original character—from the vintage Portuguese tiles to the traditional wooden shutters. It''s a rare glimpse into Mumbai''s architectural heritage, offering guests an authentic connection to the city''s storied past.',
  '[
    {"text": "The Cottage transported us back in time while providing all modern comforts. The heritage details are absolutely stunning.", "author": "Rajesh K., Bangalore", "rating": 5}
  ]'::jsonb
),
(
  'City Zen',
  'Lower Parel, Mumbai',
  'Minimalist urban retreat with zen-inspired design',
  8, 4, 4, 12000,
  'Urban Zen',
  'zen-minimalist',
  ARRAY[
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Mountain", "name": "Meditation Pavilion", "description": "Dedicated zen space with city skyline views"},
    {"icon": "Waves", "name": "Water Features", "description": "Indoor koi pond and flowing water elements"},
    {"icon": "Coffee", "name": "Tea Ceremony Room", "description": "Traditional Japanese tea ceremony space"},
    {"icon": "Building", "name": "Minimalist Design", "description": "Clutter-free spaces promoting mental clarity"}
  ]'::jsonb,
  'In the bustling heart of Lower Parel''s business district, City Zen offers a sanctuary of calm amidst urban energy. Inspired by Japanese minimalism and Indian meditation traditions, this space is designed to restore balance and clarity. Clean lines, natural materials, and carefully curated negative space create an environment where the mind can find peace, even in Mumbai''s most dynamic neighborhood.',
  '[
    {"text": "City Zen provided the perfect escape from Mumbai''s intensity. The minimalist design and meditation spaces were exactly what we needed.", "author": "Anita R., Pune", "rating": 5}
  ]'::jsonb
),
(
  'India House',
  'Colaba, Mumbai',
  'Grand colonial mansion celebrating Indian heritage',
  10, 5, 6, 15000,
  'Heritage',
  'colonial-grandeur',
  ARRAY[
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Building", "name": "Colonial Architecture", "description": "Grand colonial mansion with Indian artistic elements"},
    {"icon": "Palette", "name": "Heritage Artifacts", "description": "Curated collection of Indian art and antiques"},
    {"icon": "Mountain", "name": "Courtyard Gardens", "description": "Traditional Indian courtyard with fountain centerpiece"},
    {"icon": "Coffee", "name": "Butler Service", "description": "Traditional Indian hospitality with personal butler"}
  ]'::jsonb,
  'India House stands as a magnificent testament to Mumbai''s colonial grandeur and India''s rich cultural heritage. This palatial mansion in historic Colaba seamlessly blends British architectural elements with traditional Indian craftsmanship. From hand-carved wooden pillars to intricate marble inlays, every detail celebrates the confluence of cultures that shaped modern Mumbai. It''s not just a residence—it''s a living museum of India''s architectural legacy.',
  '[
    {"text": "India House exceeded all expectations. The grandeur and attention to cultural detail made us feel like royalty in the heart of Mumbai.", "author": "James W., New York", "rating": 5}
  ]'::jsonb
),
(
  'Little White Bandra Studio',
  'Bandra West, Mumbai',
  'Intimate white-washed studio with artistic flair',
  2, 1, 1, 4500,
  'Studio',
  'scandinavian-white',
  ARRAY[
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Home", "name": "Scandinavian Design", "description": "Pure white aesthetic with natural wood accents"},
    {"icon": "Coffee", "name": "Cozy Reading Nook", "description": "Intimate corner with curated book collection"},
    {"icon": "Sunset", "name": "Natural Light", "description": "Floor-to-ceiling windows maximizing daylight"},
    {"icon": "Waves", "name": "Minimalist Luxury", "description": "High-quality materials in a compact, thoughtful design"}
  ]'::jsonb,
  'The Little White Studio embodies the essence of Scandinavian hygge in the heart of Mumbai. This intimate space celebrates the beauty of simplicity, where every white surface reflects light and creates an atmosphere of pure tranquility. Designed for couples seeking a romantic retreat, the studio proves that luxury isn''t about size—it''s about thoughtful design, quality materials, and the perfect balance of form and function.',
  '[
    {"text": "The Little White Studio was the perfect romantic getaway. The minimalist design and attention to detail created such a peaceful atmosphere.", "author": "Kavya & Arjun, Chennai", "rating": 5}
  ]'::jsonb
),
(
  'Sky Lounge',
  'Worli, Mumbai',
  'Luxury penthouse with panoramic city skyline views',
  12, 6, 7, 20000,
  'Penthouse',
  'modern-luxury',
  ARRAY[
    'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ],
  '[
    {"icon": "Building", "name": "Panoramic Views", "description": "360-degree views of Mumbai skyline and Arabian Sea"},
    {"icon": "Sunset", "name": "Sky Terrace", "description": "Private rooftop terrace with infinity pool"},
    {"icon": "Waves", "name": "Smart Home Technology", "description": "Fully automated luxury amenities and climate control"},
    {"icon": "Car", "name": "Concierge Service", "description": "24/7 luxury concierge and valet parking"}
  ]'::jsonb,
  'Perched high above Mumbai''s skyline in prestigious Worli, Sky Lounge represents the pinnacle of contemporary luxury living. This penthouse sanctuary offers breathtaking 360-degree views of the city, from the glittering Marine Drive to the majestic Bandra-Worli Sea Link. With floor-to-ceiling windows and multiple terraces, guests can witness Mumbai''s transformation from bustling metropolis by day to a sea of lights by night.',
  '[
    {"text": "Sky Lounge redefined luxury for us. The views are absolutely spectacular, and the amenities are world-class.", "author": "Rohit M., Mumbai", "rating": 5}
  ]'::jsonb
);