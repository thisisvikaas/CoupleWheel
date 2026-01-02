# 🔍 Debugging Supabase Signup Issues

## Step 1: Check Email Confirmation Settings

**CRITICAL**: Supabase requires email confirmation by default, which will block signups in development.

### Fix This Now:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qzbxloaijpcdmrenkbtr
2. Click **Authentication** in the left sidebar
3. Click **Providers** tab
4. Find **Email** provider
5. Scroll down to **"Confirm email"**
6. **DISABLE** the toggle for "Confirm email"
7. Click **Save**

This allows signups without email verification during development.

## Step 2: Test the Connection

I've created a standalone test file. Open it in your browser:

```bash
cd /Users/vikas.pareek/Documents/Projects/CoupleWheel
open test-supabase.html
```

Or manually open: `/Users/vikas.pareek/Documents/Projects/CoupleWheel/test-supabase.html`

Try signing up with:
- Name: Test User
- Email: test@example.com
- Partner Email: partner@example.com  
- Password: test123

**Check the browser console (F12) for detailed error messages.**

## Step 3: Check Database Trigger

The trigger might not be working. Let's verify:

1. Go to Supabase Dashboard > SQL Editor
2. Run this query:

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```

If either returns empty, the trigger wasn't created. Re-run the schema.

## Step 4: Manual User Creation Test

If the trigger isn't working, test manually:

```sql
-- First, sign up a user through the app or test page
-- Then check if the user record was created:
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;

-- Check if profile was created:
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 1;

-- If profile is missing, the trigger failed
```

## Common Issues:

1. **Email confirmation enabled** - Must disable for dev (see Step 1)
2. **Trigger not created** - Re-run the SQL schema
3. **RLS blocking inserts** - Check if INSERT policy exists for users table
4. **Wrong credentials** - Verify .env file has correct URL and key

## Quick Fix: Disable Trigger and Create Manually

If the trigger keeps failing, we can modify the signup code to create the profile manually instead of relying on the trigger.

Let me know what you see in:
1. The test page console
2. The email confirmation setting (enabled/disabled?)
3. Whether the trigger exists in the database

