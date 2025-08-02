# Fix Email Confirmation Issue - DonorYuk

## Problem

Users can register but email confirmation doesn't work properly, causing "Email not confirmed" error on login.

## Root Causes

1. Missing redirect URL configuration in Supabase Auth settings
2. Incorrect email confirmation flow setup
3. Missing proper error handling for email confirmation

## Solution Steps

### 1. Configure Supabase Auth Settings

Go to your Supabase Dashboard → Authentication → Settings:

#### Site URL Configuration

-   **Site URL**: `http://localhost:3000` (for development)
-   **Site URL**: `https://your-domain.com` (for production)

#### Redirect URLs Configuration

Add these URLs to **Redirect URLs**:

-   `http://localhost:3000/auth/callback`
-   `https://your-domain.com/auth/callback` (for production)

#### Email Templates (Optional but Recommended)

Go to Authentication → Email Templates and customize:

**Confirm Signup Template:**

```html
<h2>Konfirmasi Email Anda</h2>
<p>Terima kasih telah mendaftar di DonorYuk!</p>
<p>Klik tombol di bawah untuk mengkonfirmasi email Anda:</p>
<p><a href="{{ .ConfirmationURL }}">Konfirmasi Email</a></p>
<p>Atau copy dan paste link berikut ke browser Anda:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Link ini akan kedaluwarsa dalam 24 jam.</p>
<p>Jika Anda tidak mendaftar di DonorYuk, abaikan email ini.</p>
```

### 2. Verify Database Configuration

Run this SQL in Supabase SQL Editor to check auth settings:

```sql
-- Check if email confirmation is required
SELECT * FROM auth.config;

-- Check current auth users and their confirmation status
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

### 3. Test the Email Confirmation Flow

1. **Register a new user** through your app
2. **Check email** for confirmation link
3. **Click the confirmation link** - should redirect to `/auth/callback`
4. **Verify in database** that `email_confirmed_at` is set
5. **Try logging in** - should work without "Email not confirmed" error

### 4. Troubleshooting

#### If emails are not being sent:

1. Check Supabase Dashboard → Authentication → Settings → SMTP Settings
2. For development, Supabase uses their own SMTP (should work by default)
3. For production, configure your own SMTP provider

#### If confirmation link doesn't work:

1. Verify redirect URLs are correctly configured
2. Check browser console for errors
3. Ensure `/auth/callback` page exists and works

#### If still getting "Email not confirmed" error:

1. Check the user's `email_confirmed_at` field in auth.users table
2. If null, the email wasn't confirmed
3. Use the "Resend Confirmation" feature in the login page

### 5. Manual Fix for Existing Users

If you have users who registered but can't confirm their email, you can manually confirm them:

```sql
-- Replace 'user-email@example.com' with the actual email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'user-email@example.com'
AND email_confirmed_at IS NULL;
```

### 6. Environment Variables Check

Ensure your `.env.local` has the correct Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 7. Code Changes Made

The following improvements have been implemented:

1. **Enhanced signUp function** - Now includes `emailRedirectTo` option
2. **Improved error handling** - Better error messages for email confirmation
3. **Resend confirmation feature** - Users can resend confirmation emails
4. **Better UX** - Clear instructions and feedback for users

### 8. Testing Checklist

-   [ ] Register new user
-   [ ] Receive confirmation email
-   [ ] Click confirmation link
-   [ ] Redirected to callback page successfully
-   [ ] Can login without errors
-   [ ] Resend confirmation works if needed
-   [ ] Error messages are user-friendly

## Expected Behavior After Fix

1. **Registration**: User registers → receives confirmation email → success message shown
2. **Email Confirmation**: User clicks link → redirected to callback → automatically logged in
3. **Login**: User can login normally after email confirmation
4. **Error Handling**: Clear error messages with option to resend confirmation

## Additional Notes

-   Email confirmation is required by default in Supabase
-   The confirmation link expires after 24 hours
-   Users can request a new confirmation email if needed
-   Make sure to test both development and production environments
