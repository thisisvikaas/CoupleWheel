-- Couples Challenge Wheel Database Schema
-- This script should be run in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  partner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'completed', 'in_progress')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Weekly spins table
CREATE TABLE IF NOT EXISTS public.weekly_spins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  user_a_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_a_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_b_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_a_completed BOOLEAN,
  user_b_completed BOOLEAN,
  user_a_verified_by_partner BOOLEAN,
  user_b_verified_by_partner BOOLEAN,
  user_a_vetoed BOOLEAN DEFAULT FALSE,
  user_b_vetoed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veto usage table
CREATE TABLE IF NOT EXISTS public.veto_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  used_date DATE NOT NULL DEFAULT CURRENT_DATE,
  week_spin_id UUID NOT NULL REFERENCES public.weekly_spins(id) ON DELETE CASCADE,
  month TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_weekly_spins_week_start ON public.weekly_spins(week_start_date);
CREATE INDEX IF NOT EXISTS idx_weekly_spins_users ON public.weekly_spins(user_a_id, user_b_id);
CREATE INDEX IF NOT EXISTS idx_veto_usage_user_month ON public.veto_usage(user_id, month);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veto_usage ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile and their partner's profile"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id OR 
    auth.uid() = partner_id OR
    id IN (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Tasks table policies
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Weekly spins table policies
CREATE POLICY "Users can view weekly spins they're part of"
  ON public.weekly_spins FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can insert weekly spins they're part of"
  ON public.weekly_spins FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can update weekly spins they're part of"
  ON public.weekly_spins FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id)
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Veto usage table policies
CREATE POLICY "Users can view their own veto usage"
  ON public.veto_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own veto usage"
  ON public.veto_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to link partners
CREATE OR REPLACE FUNCTION public.link_partners(user1_id UUID, user2_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.users SET partner_id = user2_id WHERE id = user1_id;
  UPDATE public.users SET partner_id = user1_id WHERE id = user2_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

