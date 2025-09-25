-- Create listings table for cars and properties
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('car', 'property')),
  title TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  whatsapp_number TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view listings)
CREATE POLICY "Anyone can view listings" 
ON public.listings 
FOR SELECT 
USING (true);

-- Only authenticated users can create listings
CREATE POLICY "Authenticated users can create listings" 
ON public.listings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings" 
ON public.listings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON public.listings 
FOR DELETE 
TO authenticated
USING (auth.uid() = created_by);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (for admin purposes)
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample listings data
INSERT INTO public.listings (type, title, price, currency, location, images, description, features, specifications, whatsapp_number, featured) VALUES
('car', '2019 Toyota Camry Hybrid', 2800000, 'KES', 'Nairobi, Kenya', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'], 'Well-maintained Toyota Camry Hybrid with excellent fuel economy. Perfect for city driving and long trips. Clean interior and exterior.', ARRAY['Hybrid Engine', 'Automatic Transmission', 'Air Conditioning', 'Power Windows', 'Bluetooth'], '{"year": "2019", "mileage": "45,000 km", "engine": "2.5L Hybrid", "transmission": "Automatic", "fuel_type": "Hybrid"}', '+254712345678', true),

('property', 'Modern 3-Bedroom Apartment', 12500000, 'KES', 'Kilimani, Nairobi', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'], 'Spacious modern apartment with stunning city views. Located in the heart of Kilimani with easy access to shopping centers and restaurants.', ARRAY['3 Bedrooms', '2 Bathrooms', 'Modern Kitchen', 'Parking Space', 'Security'], '{"bedrooms": "3", "bathrooms": "2", "square_feet": "1,200 sq ft", "parking": "1 space", "year_built": "2020"}', '+254712345679', true),

('car', '2020 Nissan X-Trail', 3200000, 'KES', 'Mombasa, Kenya', ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'], 'Excellent condition Nissan X-Trail SUV. Perfect for family adventures and off-road capabilities. Low mileage and well serviced.', ARRAY['7-Seater', 'AWD', 'Sunroof', 'Backup Camera', 'Cruise Control'], '{"year": "2020", "mileage": "28,000 km", "engine": "2.5L", "transmission": "CVT", "fuel_type": "Petrol"}', '+254712345680', false),

('property', 'Executive 4-Bedroom Villa', 25000000, 'KES', 'Karen, Nairobi', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500'], 'Luxurious villa in prestigious Karen neighborhood. Features beautiful gardens, modern amenities, and excellent security.', ARRAY['4 Bedrooms', '3 Bathrooms', 'Swimming Pool', 'Garden', 'Servant Quarter'], '{"bedrooms": "4", "bathrooms": "3", "square_feet": "3,500 sq ft", "lot_size": "0.5 acres", "year_built": "2018"}', '+254712345681', false),

('car', '2018 Honda CR-V', 2950000, 'KES', 'Kisumu, Kenya', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500'], 'Reliable Honda CR-V in excellent condition. Great fuel efficiency and comfortable ride. Perfect for both city and highway driving.', ARRAY['AWD', 'Sunroof', 'Heated Seats', 'Navigation System', 'Backup Camera'], '{"year": "2018", "mileage": "52,000 km", "engine": "1.5L Turbo", "transmission": "CVT", "fuel_type": "Petrol"}', '+254712345682', false),

('property', 'Cozy 2-Bedroom Bungalow', 8500000, 'KES', 'Thika, Kenya', ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500'], 'Charming bungalow perfect for a small family. Quiet neighborhood with good access to schools and shopping centers.', ARRAY['2 Bedrooms', '1 Bathroom', 'Large Kitchen', 'Front Yard', 'Carport'], '{"bedrooms": "2", "bathrooms": "1", "square_feet": "900 sq ft", "lot_size": "0.25 acres", "year_built": "2015"}', '+254712345683', false);