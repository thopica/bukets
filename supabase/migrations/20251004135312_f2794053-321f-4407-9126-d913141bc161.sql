-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert admin roles for the two admin users
-- We'll use the email to find the user_id
DO $$
DECLARE
  admin_user_id_1 UUID;
  admin_user_id_2 UUID;
BEGIN
  -- Get user IDs from auth.users
  SELECT id INTO admin_user_id_1 FROM auth.users WHERE email = 'asani.kastri@gmail.com';
  SELECT id INTO admin_user_id_2 FROM auth.users WHERE email = 'thomasmeister6@gmail.com';
  
  -- Insert admin roles if users exist
  IF admin_user_id_1 IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (admin_user_id_1, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  IF admin_user_id_2 IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (admin_user_id_2, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;