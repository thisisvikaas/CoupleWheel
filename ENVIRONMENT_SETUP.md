# 🎉 Environment Variables Configured!

## ✅ Supabase Credentials Added

Your Supabase credentials have been successfully added to `.env`:

```env
VITE_SUPABASE_URL=https://qzbxloaijpcdmrenkbtr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...dJ2w (configured)
```

## 🚀 Next Steps

### 1. Set Up the Database Schema

You need to run the SQL schema in your Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qzbxloaijpcdmrenkbtr
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` (open in your editor)
5. Paste it into the SQL editor
6. Click **Run** or press `Ctrl/Cmd + Enter`

This will create:
- ✅ Users table
- ✅ Tasks table
- ✅ Weekly spins table
- ✅ Veto usage table
- ✅ Row Level Security policies
- ✅ Auto-trigger for user profile creation
- ✅ Partner linking function

### 2. Restart the Development Server

The dev server is currently running. To pick up the new environment variables:

**Terminal 1 is running the dev server at:** `http://localhost:5173/`

You can:
- Stop it with `Ctrl + C` and restart with `npm run dev`, OR
- Just refresh your browser (Vite should hot-reload)

### 3. Test the Application

Open your browser and go to: **http://localhost:5173/**

#### Test Flow:

1. **Sign Up** (as User A):
   - Name: Your name
   - Email: your-email@example.com
   - Partner's Email: partner-email@example.com
   - Password: (create a password)

2. **Sign Up** (as User B - use different browser/incognito):
   - Name: Partner's name
   - Email: partner-email@example.com
   - Partner's Email: your-email@example.com
   - Password: (create a password)

3. **Create Tasks**:
   - Go to "Task Pool"
   - Add at least 6 tasks for your partner
   - Add categories if you want (optional)

4. **Navigate Around**:
   - Dashboard: See countdown timer
   - Current Week: Will show tasks after first spin
   - Task Pool: Manage your tasks

### 4. Database Check

You can verify the tables were created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `users`
   - `tasks`
   - `weekly_spins`
   - `veto_usage`

### 5. Testing Sunday Features (Optional)

To test the Sunday workflow without waiting for Sunday:

You can temporarily modify the date utils in `src/utils/dateUtils.ts`:

```typescript
// Temporarily force Sunday mode for testing
export function isItSunday(): boolean {
  return true; // Change this back to: return new Date().getDay() === 0;
}
```

Then you can test:
- Verification panel
- Spinner wheel
- Task selection

**Remember to change it back after testing!**

## 🔍 Troubleshooting

### If you see connection errors:

1. **Check Supabase URL**: Make sure it matches your project
2. **Check API Key**: Verify it's the anon (public) key, not service key
3. **Run the SQL Schema**: The tables must exist before the app works
4. **Check Browser Console**: Look for any error messages (F12 > Console)

### If signup fails:

1. Go to Supabase Dashboard > Authentication > Settings
2. Make sure "Enable email confirmations" is **disabled** for testing
3. Or check your email for confirmation link

### Common Issues:

- **"Missing Supabase environment variables"**: Restart dev server
- **"relation does not exist"**: Run the SQL schema
- **"permission denied"**: RLS policies not created (run SQL schema)
- **"Failed to fetch"**: Check network tab, verify Supabase URL

## 📊 Current Status

- ✅ Environment variables configured
- ✅ Development server running
- ⏳ Database schema needs to be run in Supabase
- ⏳ Ready to test once schema is applied

## 🎯 After Database Setup

Once you run the SQL schema, you can:

1. Sign up and create your account
2. Add your partner (they sign up with your email)
3. Create task pools (min 20 tasks recommended)
4. Wait for Sunday at 11 PM OR modify date utils to test
5. Complete the weekly cycle!

## 🚢 Ready to Deploy?

Once you've tested locally and everything works:

1. **Push .env to Vercel** (don't commit it to Git):
   - Go to Vercel dashboard
   - Add both environment variables in Project Settings
   - Redeploy

2. **Or deploy from CLI**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel --prod
   ```

---

**Your app is ready! Just run the SQL schema and start testing! 🎊**

Current dev server: http://localhost:5173/

Need help? Check the browser console (F12) for any errors.

