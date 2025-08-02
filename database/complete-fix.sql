-- COMPLETE FIX FOR INFINITE RECURSION IN RLS POLICIES
-- Run this script in Supabase SQL Editor to fix the issue

-- Step 1: Drop all existing problematic policies
DROP POLICY IF EXISTS "Admin self-view" ON admins;
DROP POLICY IF EXISTS "Admins can view admin records" ON admins;
DROP POLICY IF EXISTS "Admins can view all admin records" ON admins;

-- Step 2: Create the correct policy for admins table
-- This allows users to view their own admin record without recursion
CREATE POLICY "Users can view their own admin record" ON admins
    FOR SELECT USING (user_id = auth.uid());

-- Step 3: Verify that other policies are working correctly
-- The following policies should work fine, but let's recreate them to be sure

-- Drop and recreate admin-related policies for other tables
DROP POLICY IF EXISTS "Admins can view all donors" ON donors;
DROP POLICY IF EXISTS "Admins can update any donor" ON donors;
DROP POLICY IF EXISTS "Admins can view all verifications" ON verifications;
DROP POLICY IF EXISTS "Admins can update verifications" ON verifications;

-- Recreate admin policies for donors table
CREATE POLICY "Admins can view all donors" ON donors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update any donor" ON donors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Recreate admin policies for verifications table
CREATE POLICY "Admins can view all verifications" ON verifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update verifications" ON verifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Step 4: Test the fix
-- You can run these queries to verify everything is working:

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('donors', 'verifications', 'admins')
ORDER BY tablename, policyname;

-- Test query that should work now (replace with actual admin user_id)
-- SELECT * FROM admins WHERE user_id = auth.uid();

-- Test the search functionality
-- SELECT * FROM donors WHERE status = 'active' LIMIT 5;