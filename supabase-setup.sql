-- CharlyGG Motors - Database Setup SQL
-- Run this in your Supabase SQL Editor (Settings → SQL Editor → New Query)

-- 1. Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create listings table for cars and properties
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('car', 'property')),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'KSH',
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  whatsapp_number TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Create RLS policies for listings
CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert listings" ON listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = created_by);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(featured);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);

-- 7. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create function to check if user is admin
CREATE OR REPLACE FUNCTION get_current_user_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Insert some sample data (cars)
INSERT INTO listings (type, title, description, price, currency, location, images, features, specifications, whatsapp_number, featured) VALUES
(
  'car',
  'Toyota Corolla 2020 - Excellent Condition',
  'Well-maintained Toyota Corolla with low mileage. Perfect for city driving and long trips. All maintenance records available.',
  1800000,
  'KSH',
  'Nairobi',
  ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['Manual Transmission', 'Air Conditioning', 'Power Steering', 'ABS Brakes', 'Airbags'],
  '{"year": 2020, "make": "Toyota", "model": "Corolla", "mileage": "45,000 km", "engine": "1.8L", "fuel": "Petrol", "transmission": "Manual", "color": "White"}',
  '+254712345678',
  true
),
(
  'car',
  'Honda Civic 2019 - Automatic',
  'Honda Civic in pristine condition. Automatic transmission, fuel efficient, and reliable.',
  2200000,
  'KSH',
  'Mombasa',
  ARRAY['https://images.unsplash.com/photo-1606016159991-62d9c38a3a78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['Automatic Transmission', 'Cruise Control', 'Backup Camera', 'Bluetooth', 'Sunroof'],
  '{"year": 2019, "make": "Honda", "model": "Civic", "mileage": "38,000 km", "engine": "2.0L", "fuel": "Petrol", "transmission": "Automatic", "color": "Black"}',
  '+254798765432',
  false
),
(
  'car',
  'Nissan X-Trail 2021 - 4WD',
  'Powerful SUV perfect for family adventures. 4WD capability and spacious interior.',
  3500000,
  'KSH',
  'Kisumu',
  ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['4WD', 'Leather Seats', '7 Seater', 'Navigation System', 'Reverse Camera'],
  '{"year": 2021, "make": "Nissan", "model": "X-Trail", "mileage": "25,000 km", "engine": "2.5L", "fuel": "Petrol", "transmission": "CVT", "color": "Silver"}',
  '+254723456789',
  true
);

-- 11. Insert some sample data (properties)
INSERT INTO listings (type, title, description, price, currency, location, images, features, specifications, whatsapp_number, featured) VALUES
(
  'property',
  '3 Bedroom Apartment - Westlands',
  'Modern 3-bedroom apartment in the heart of Westlands. Close to shopping centers, restaurants, and business district.',
  12000000,
  'KSH',
  'Nairobi - Westlands',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['3 Bedrooms', '2 Bathrooms', 'Balcony', 'Parking', 'Security', 'Swimming Pool'],
  '{"bedrooms": 3, "bathrooms": 2, "area": "120 sqm", "floor": "5th Floor", "parking": "1 space", "furnished": "Semi-furnished"}',
  '+254734567890',
  true
),
(
  'property',
  '4 Bedroom House - Karen',
  'Spacious family home in Karen with large garden. Perfect for families looking for tranquil living.',
  25000000,
  'KSH',
  'Nairobi - Karen',
  ARRAY['https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['4 Bedrooms', '3 Bathrooms', 'Garden', 'Garage', 'Fireplace', 'Study Room'],
  '{"bedrooms": 4, "bathrooms": 3, "area": "250 sqm", "land": "0.25 acres", "parking": "2 cars", "furnished": "Unfurnished"}',
  '+254745678901',
  false
),
(
  'property',
  'Commercial Plot - Industrial Area',
  'Prime commercial plot in Industrial Area. Perfect for warehouse or manufacturing facility.',
  8000000,
  'KSH',
  'Nairobi - Industrial Area',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  ARRAY['Commercial Plot', 'Good Access Roads', 'Utilities Available', 'Title Deed Ready'],
  '{"area": "2000 sqm", "zoning": "Commercial", "access": "Tarmac Road", "utilities": "Water, Electricity, Sewer"}',
  '+254756789012',
  true
);

-- Success message
SELECT 'Database setup completed successfully! You now have sample cars and properties.' as message;
