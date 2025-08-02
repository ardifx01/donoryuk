# Logout Functionality - DonorYuk

## Overview

The DonorYuk application now has comprehensive logout functionality implemented across all authenticated pages with enhanced user experience and proper error handling.

## Implementation Details

### 1. Dashboard Page (`/dashboard`)

**Features:**

-   ✅ Logout confirmation modal
-   ✅ Loading states with spinner
-   ✅ Error handling with user feedback
-   ✅ Smooth redirect after logout
-   ✅ Visual feedback during logout process

**User Flow:**

1. User clicks "Keluar" button in header
2. Confirmation modal appears asking "Apakah Anda yakin ingin keluar?"
3. User can cancel or confirm logout
4. If confirmed, loading overlay shows "Sedang Logout..."
5. After successful logout, user is redirected to homepage

**Code Location:** `src/app/dashboard/page.tsx`

### 2. Search Page (`/search`)

**Features:**

-   ✅ Conditional header based on authentication status
-   ✅ Logout button for authenticated users
-   ✅ Login/Register buttons for unauthenticated users
-   ✅ Loading states during logout
-   ✅ Error handling

**User Flow:**

1. If user is authenticated: Shows Dashboard link + Logout button
2. If user is not authenticated: Shows Login + Register buttons
3. Logout process same as dashboard (direct logout without confirmation)

**Code Location:** `src/app/search/page.tsx`

### 3. AuthContext Integration

**Functions Used:**

-   `signOut()` - Main logout function from Supabase
-   `user` - Current user state for conditional rendering
-   Error handling for failed logout attempts

**Code Location:** `src/contexts/AuthContext.tsx`

## UI/UX Enhancements

### Visual Elements

1. **Logout Button:**

    - Red background with hover effects
    - Door emoji (🚪) + "Keluar" text
    - Loading spinner when processing
    - Disabled state during logout

2. **Confirmation Modal (Dashboard only):**

    - Centered modal with backdrop
    - Clear question and action buttons
    - Cancel and confirm options
    - Consistent styling with app theme

3. **Loading Overlay:**
    - Full-screen overlay during logout
    - Spinning loader with success color (green)
    - Clear status message
    - Prevents user interaction during process

### States Management

```tsx
const [isLoggingOut, setIsLoggingOut] = useState(false);
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Dashboard only
```

### Error Handling

-   Try-catch blocks around logout calls
-   User-friendly error messages in Indonesian
-   Fallback to alert() for error display
-   Proper state reset on error

## Code Examples

### Basic Logout Handler

```tsx
const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
        await signOut();
        setTimeout(() => {
            router.push("/");
        }, 1000);
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Gagal logout. Silakan coba lagi.");
        setIsLoggingOut(false);
    }
};
```

### Conditional Header Rendering

```tsx
{
    user ? (
        <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleSignOut}>Keluar</button>
        </>
    ) : (
        <>
            <Link href="/auth/login">Masuk</Link>
            <Link href="/auth/register">Daftar</Link>
        </>
    );
}
```

## Security Considerations

1. **Proper Session Cleanup:** Uses Supabase's `signOut()` which clears all session data
2. **Client-side State Reset:** AuthContext properly resets user, donor, and admin states
3. **Redirect Protection:** Users are redirected to public pages after logout
4. **Error Handling:** Failed logouts don't leave users in inconsistent states

## Testing Checklist

-   [ ] Dashboard logout with confirmation works
-   [ ] Search page logout works (direct)
-   [ ] Loading states display correctly
-   [ ] Error handling works when network fails
-   [ ] Redirect to homepage after logout
-   [ ] User state properly cleared after logout
-   [ ] Modal can be cancelled on dashboard
-   [ ] Buttons are disabled during logout process

## Future Enhancements

1. **Global Logout Component:** Create reusable logout component
2. **Session Timeout:** Auto-logout after inactivity
3. **Logout Confirmation Setting:** User preference for confirmation modal
4. **Multiple Device Logout:** Option to logout from all devices
5. **Logout Analytics:** Track logout patterns for UX improvements

## Files Modified

1. `src/app/dashboard/page.tsx` - Enhanced with confirmation modal and loading states
2. `src/app/search/page.tsx` - Added conditional authentication header
3. `src/contexts/AuthContext.tsx` - Already had proper signOut function

## Dependencies

-   `@supabase/supabase-js` - For authentication
-   `next/navigation` - For routing after logout
-   React hooks - For state management
-   Tailwind CSS - For styling

The logout functionality is now robust, user-friendly, and consistent across the application!
