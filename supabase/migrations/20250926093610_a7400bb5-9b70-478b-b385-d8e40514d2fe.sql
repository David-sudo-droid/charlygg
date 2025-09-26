-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- You can modify this list to include specific admin emails
  RETURN user_email IN (
    'musashidavid872@gmail.com'  -- Replace with your admin email
    -- Add more admin emails here if needed:
    -- ,'another.admin@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get current user's admin status
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS boolean AS $$
DECLARE
  user_email text;
BEGIN
  -- Get the current user's email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN public.is_admin(user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles table to automatically set admin role based on email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN public.is_admin(NEW.email) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

-- Update existing users to have correct admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN (
  SELECT email FROM auth.users WHERE public.is_admin(email)
);

-- Create RLS policy for admin access to listings
DROP POLICY IF EXISTS "Admins can manage all listings" ON public.listings;
CREATE POLICY "Admins can manage all listings" 
ON public.listings 
FOR ALL 
USING (public.get_current_user_admin_status());

-- Create RLS policy for admin access to profiles  
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_admin_status());