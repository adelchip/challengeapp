import { Profile, Challenge } from '@/types';

/**
 * Mock AI function to suggest profiles for a challenge
 * Algorithm:
 * 1. Extract keywords from title and description
 * 2. Match keywords with profile skills
 * 3. Sort by number of matches
 * 4. Return top 3 profiles
 */
export function suggestProfilesForChallenge(
  challenge: { title: string; description: string },
  profiles: Profile[]
): Profile[] {
  // Extract keywords from title and description (lowercase, remove common words)
  const commonWords = ['il', 'la', 'i', 'le', 'di', 'da', 'in', 'con', 'su', 'per', 'a', 'e', 'un', 'una', 'che'];
  const text = `${challenge.title} ${challenge.description}`.toLowerCase();
  const words = text.split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );

  // Calculate match score for each profile
  const scoredProfiles = profiles.map(profile => {
    let score = 0;
    
    // Check skills matches
    profile.skills.forEach(skill => {
      const skillName = skill.name.toLowerCase();
      keywords.forEach(keyword => {
        if (skillName.includes(keyword) || keyword.includes(skillName)) {
          // Weight skill match by rating (1-5 stars)
          score += 3 * (skill.rating / 5); // Higher rated skills get more weight
        }
      });
    });

    // Check role matches
    keywords.forEach(keyword => {
      if (profile.role.toLowerCase().includes(keyword) || keyword.includes(profile.role.toLowerCase())) {
        score += 2; // Medium weight for role match
      }
    });

    // Check business unit matches
    keywords.forEach(keyword => {
      if (profile.business_unit.toLowerCase().includes(keyword) || keyword.includes(profile.business_unit.toLowerCase())) {
        score += 1; // Low weight for business unit match
      }
    });

    return { profile, score };
  });

  // Sort by score (descending) and return top 3
  return scoredProfiles
    .filter(sp => sp.score > 0) // Only profiles with at least one match
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(sp => sp.profile);
}
