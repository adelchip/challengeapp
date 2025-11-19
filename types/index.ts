export interface Skill {
  name: string;
  rating: number; // 1-5
}

export interface Profile {
  id: string;
  name: string;
  photo?: string;
  country: string;
  role: string;
  business_unit: string;
  description?: string;
  interests?: string;
  skills: Skill[];
  total_challenges?: number;
  average_rating?: number;
  created_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  status: 'ongoing' | 'completed';
  created_by: string;
  suggested_profiles: string[];
  participants: string[];
  created_at?: string;
}

export interface Message {
  id: string;
  challenge_id: string;
  sender_profile_id: string;
  content: string;
  created_at: string;
}

export interface ChallengeRating {
  id: string;
  challenge_id: string;
  profile_id: string;
  rating: number; // 1-5
  created_at: string;
}
