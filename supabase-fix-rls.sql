-- FIX for infinite recursion in users RLS policy
-- Run this in your Supabase SQL Editor to fix the issue

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own profile and their partner's profile" ON public.users;

-- Create a fixed policy without recursion
CREATE POLICY "Users can view their own profile and their partner's profile"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id OR 
    auth.uid() = partner_id
  );

