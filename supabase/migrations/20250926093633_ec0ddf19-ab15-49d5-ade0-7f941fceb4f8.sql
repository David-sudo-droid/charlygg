-- Fix security warnings by setting search_path for functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search_path for get_current_user_admin_status function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;