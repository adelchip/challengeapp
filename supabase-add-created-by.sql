-- Add created_by field to challenges table
ALTER TABLE challenges ADD COLUMN created_by UUID REFERENCES profiles(id);

-- Update existing challenges to assign a creator (first participant as creator)
UPDATE challenges
SET created_by = participants[1]
WHERE array_length(participants, 1) > 0 AND created_by IS NULL;

-- Make created_by NOT NULL after populating existing data
ALTER TABLE challenges ALTER COLUMN created_by SET NOT NULL;

-- Create index for better performance
CREATE INDEX idx_challenges_created_by ON challenges(created_by);
