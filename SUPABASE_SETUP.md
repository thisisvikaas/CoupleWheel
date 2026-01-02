# Supabase Setup Instructions

## Step 1: Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Set up the Database

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the SQL script

This will create:
- All necessary tables (users, tasks, weekly_spins, veto_usage)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-creating user profiles
- Helper functions for partner linking

## Step 3: Get Your API Credentials

1. Go to **Project Settings** > **API**
2. Find your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

## Step 4: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Enable Email Auth

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates if desired (optional)

## Step 6: Test the Connection

Run the development server:
```bash
npm run dev
```

The app should now connect to your Supabase database!

## Database Schema Overview

### Tables

**users**
- Extends Supabase auth.users
- Stores user name and partner relationship

**tasks**
- User-created tasks for their partner
- Supports categories and status tracking

**weekly_spins**
- Records each week's task assignments
- Tracks completion and verification status
- Stores veto usage

**veto_usage**
- Tracks veto usage by user and month
- Enforces 1 veto per calendar month limit

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Partner's task pool is hidden until reveal
- Weekly spins visible only to participants

