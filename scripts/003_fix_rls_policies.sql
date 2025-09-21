-- Adding proper RLS policies to allow data access

-- Enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Coaches table policies (public read access)
DROP POLICY IF EXISTS "Allow public read access to coaches" ON coaches;
CREATE POLICY "Allow public read access to coaches" ON coaches
  FOR SELECT USING (true);

-- Coach sessions policies (users can manage their own sessions)
DROP POLICY IF EXISTS "Users can view own sessions" ON coach_sessions;
CREATE POLICY "Users can view own sessions" ON coach_sessions
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON coach_sessions;
CREATE POLICY "Users can insert own sessions" ON coach_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON coach_sessions;
CREATE POLICY "Users can update own sessions" ON coach_sessions
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Profiles table policies (users can manage their own profile)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON coaches TO anon, authenticated;
GRANT ALL ON coach_sessions TO authenticated;
GRANT ALL ON profiles TO authenticated;
