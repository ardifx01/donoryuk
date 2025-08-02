-- Fix for infinite recursion in admins table RLS policy
-- Run this in Supabase SQL Editor to fix the issue

-- 1. Drop the problematic policy
DROP POLICY IF EXISTS "Admin self-view" ON admins;

-- 2. Create a proper policy that doesn't cause recursion
-- This policy allows admins to view admin records by checking their user_id directly
CREATE POLICY "Admins can view admin records" ON admins
  FOR SELECT USING (user_id = auth.uid());

-- 3. Optional: Add policy for admins to view other admin records
-- This allows any admin to see all admin records (useful for admin management)
CREATE POLICY "Admins can view all admin records" ON admins
  FOR SELECT USING (
    -- Check if the current user is an admin by looking at their own record
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.user_id != admins.user_id
    )
  );

-- Alternative simpler approach (recommended):
-- Drop the complex policy and use a simple one
DROP POLICY IF EXISTS "Admins can view all admin records" ON admins;

-- Simple policy: users can only see their own admin record
CREATE POLICY "Users can view their own admin record" ON admins
  FOR SELECT USING (user_id = auth.uid());

-- 4. Verify the policies are working by testing
-- You can run this query to check current policies:
-- SELECT * FROM pg_policies WHERE tablename = 'admins';