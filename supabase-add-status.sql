-- Non-destructive database migrations for challenge completion feature
-- Run this in Supabase SQL Editor

-- 1. Add status column to challenges table
ALTER TABLE challenges 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed'));

-- 2. Add completion stats to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_challenges INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0.00;

-- 3. Create ratings table to store participant ratings for each challenge
CREATE TABLE IF NOT EXISTS challenge_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, profile_id) -- Each profile can only be rated once per challenge
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenge_ratings_challenge ON challenge_ratings(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_ratings_profile ON challenge_ratings(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_average_rating ON profiles(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_total_challenges ON profiles(total_challenges DESC);

-- 5. Update existing challenges to have 'ongoing' status (if any exist)
UPDATE challenges SET status = 'ongoing' WHERE status IS NULL;

-- 6. Create function to update profile stats when a rating is added
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate average rating and total challenges for the profile
  UPDATE profiles
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM challenge_ratings
      WHERE profile_id = NEW.profile_id
    ),
    total_challenges = (
      SELECT COUNT(DISTINCT challenge_id)
      FROM challenge_ratings
      WHERE profile_id = NEW.profile_id
    )
  WHERE id = NEW.profile_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to automatically update stats when ratings are added/updated
DROP TRIGGER IF EXISTS trigger_update_profile_stats ON challenge_ratings;
CREATE TRIGGER trigger_update_profile_stats
AFTER INSERT OR UPDATE ON challenge_ratings
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();

