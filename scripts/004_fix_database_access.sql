-- Fix RLS policies to allow proper access patterns

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "coaches_select_all" ON public.coaches;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "sessions_select_own" ON public.coach_sessions;
DROP POLICY IF EXISTS "sessions_insert_own" ON public.coach_sessions;
DROP POLICY IF EXISTS "sessions_update_own" ON public.coach_sessions;
DROP POLICY IF EXISTS "sessions_delete_own" ON public.coach_sessions;

-- Create more permissive policies for coaches (allow anonymous read)
CREATE POLICY "coaches_public_read" ON public.coaches 
  FOR SELECT USING (true);

-- Create policies for profiles (authenticated users only)
CREATE POLICY "profiles_authenticated_select" ON public.profiles 
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_authenticated_insert" ON public.profiles 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_authenticated_update" ON public.profiles 
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create policies for coach_sessions (authenticated users only)
CREATE POLICY "sessions_authenticated_select" ON public.coach_sessions 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sessions_authenticated_insert" ON public.coach_sessions 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_authenticated_update" ON public.coach_sessions 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON public.coaches TO anon;
GRANT SELECT ON public.coaches TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.coach_sessions TO authenticated;
