-- Disable Row Level Security (RLS) for public access
-- WARNING: This allows anyone to read/write all data
-- Use this for demo/development purposes only
-- For production, implement proper RLS policies with authentication

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_ratings DISABLE ROW LEVEL SECURITY;

-- Grant public access to all tables
GRANT ALL ON profiles TO anon;
GRANT ALL ON challenges TO anon;
GRANT ALL ON messages TO anon;
GRANT ALL ON challenge_ratings TO anon;

GRANT ALL ON profiles TO authenticated;
GRANT ALL ON challenges TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON challenge_ratings TO authenticated;
