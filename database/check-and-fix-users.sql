-- Check and Fix Email Confirmation Issues
-- Run this in Supabase SQL Editor

-- 1. Check current auth users and their confirmation status
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Not Confirmed'
        ELSE 'Confirmed'
    END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Count users by confirmation status
SELECT 
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Not Confirmed'
        ELSE 'Confirmed'
    END as status,
    COUNT(*) as count
FROM auth.users 
GROUP BY (email_confirmed_at IS NULL);

-- 3. OPTIONAL: Manually confirm specific user (replace email)
-- Uncomment and modify the email below if you need to manually confirm a user
/*
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'user@example.com' 
AND email_confirmed_at IS NULL;
*/

-- 4. OPTIONAL: Manually confirm ALL unconfirmed users (USE WITH CAUTION!)
-- Uncomment the line below only if you want to confirm all users at once
/*
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
*/

-- 5. Check if any donors exist without confirmed emails
SELECT 
    d.name,
    d.email,
    u.email_confirmed_at,
    d.status as donor_status
FROM donors d
JOIN auth.users u ON d.user_id = u.id
WHERE u.email_confirmed_at IS NULL;

-- 6. Verify auth configuration
SELECT 
    name,
    value
FROM auth.config 
WHERE name IN ('SITE_URL', 'EXTERNAL_EMAIL_ENABLED', 'MAILER_AUTOCONFIRM');