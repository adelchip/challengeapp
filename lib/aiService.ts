import Groq from 'groq-sdk';
import { Profile } from '@/types';

// Initialize Groq client only when API key is available
// During build time, this may not be set, which is okay
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * AI-powered profile suggestion using Groq + Llama
 * Analyzes challenge requirements and matches with profile skills, roles, and experience
 */
export async function suggestProfilesWithAI(
  challenge: { title: string; description: string },
  profiles: Profile[]
): Promise<Profile[]> {
  try {
    // If no API key, fall back to keyword matching
    if (!groq) {
      return fallbackSuggestion(challenge, profiles);
    }
    
    // Pre-filter profiles to reduce token usage (max 100 most relevant)
    const text = `${challenge.title} ${challenge.description}`.toLowerCase();
    const techKeywords = text.match(/\b(react|angular|vue|node|java|python|javascript|typescript|css|html|sql|mongodb|postgres|docker|kubernetes|aws|azure|git|figma|photoshop|ui|ux|design|spring|django|flask|express|api|rest|graphql|redis|kafka|go|rust|swift|kotlin|android|ios|flutter|mobile|frontend|backend|fullstack|devops|cloud|data|analytics|machine learning|ai|testing|qa|cypress|jest|selenium|c\+\+|c#|ruby|php|scala|perl|r\b)\b/gi) || [];
    
    let filteredProfiles = profiles;
    
    // If we have tech keywords and more than 100 profiles, pre-filter
    if (techKeywords.length > 0 && profiles.length > 100) {
      const normalizedKeywords = techKeywords.map(k => k.toLowerCase());
      const scoredProfiles = profiles.map(profile => {
        let score = 0;
        profile.skills.forEach(skill => {
          const skillName = skill.name.toLowerCase();
          normalizedKeywords.forEach(keyword => {
            if (skillName.includes(keyword) || keyword.includes(skillName)) {
              score += skill.rating;
            }
          });
        });
        return { profile, score };
      });
      
      filteredProfiles = scoredProfiles
        .sort((a, b) => b.score - a.score)
        .slice(0, 100)
        .map(sp => sp.profile);
    }
    
    // Prepare profiles data for AI analysis
    const profilesData = filteredProfiles.map((p, idx) => ({
      index: profiles.indexOf(p), // Keep original index for mapping back
      name: p.name,
      role: p.role,
      business_unit: p.business_unit,
      country: p.country,
      description: p.description || '',
      interests: p.interests || '',
      skills: p.skills.map(s => `${s.name} (${s.rating}/5 stars)`).join(', '),
    }));

    const prompt = `You are an AI assistant that matches company challenges with the best employee profiles based on SKILLS.

CHALLENGE:
Title: ${challenge.title}
Description: ${challenge.description}

AVAILABLE PROFILES:
${JSON.stringify(profilesData, null, 2)}

TASK:
Analyze the challenge and suggest ONLY profiles with MATCHING SKILLS (up to 10 maximum).

STRICT MATCHING RULES:
1. **ONLY suggest profiles whose skills DIRECTLY match the challenge requirements**
2. For technical challenges, match EXACT technologies (e.g., "React" needs React skill, NOT Angular or Vue)
3. Higher skill ratings (4-5 stars) are better than lower ratings (1-3 stars)
4. If challenge mentions specific technologies, ONLY match those exact skills
5. **If NO profiles have matching skills, return an empty array []**
6. Return FEWER than 10 if only a few profiles match (quality over quantity)

EXAMPLES:
- Challenge: "Build React component" → ONLY profiles with React/JavaScript/TypeScript skills
- Challenge: "Java backend API" → ONLY profiles with Java/Spring Boot/backend skills
- Challenge: "Design UI mockup" → ONLY profiles with UI/UX/Figma/Design skills
- Challenge: "Python data analysis" → ONLY profiles with Python/pandas/data science skills

DO NOT suggest profiles just because they are developers - they MUST have the specific skills mentioned.

Return ONLY a JSON array with indices of profiles that ACTUALLY match (1-10 max, or empty [] if none match).
Format: [index1, index2, ...] or []

Your response (JSON array only):`;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Fast and free Llama model
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    
    // Parse AI response
    const suggestedIndices = JSON.parse(response.trim());
    
    // Return the suggested profiles (no max limit, AI decides based on match quality)
    const suggestions = suggestedIndices
      .map((idx: number) => profiles[idx])
      .filter(Boolean); // Remove any undefined
    
    return suggestions;

  } catch (error) {
    console.error('AI suggestion error:', error);
    // Fallback to simple keyword matching if AI fails
    return fallbackSuggestion(challenge, profiles);
  }
}

/**
 * Fallback suggestion logic if AI fails
 * Uses strict keyword matching - only returns profiles with actual skill matches
 */
function fallbackSuggestion(
  challenge: { title: string; description: string },
  profiles: Profile[]
): Profile[] {
  const text = `${challenge.title} ${challenge.description}`.toLowerCase();
  
  // Extract potential technology keywords (common tech terms)
  const techKeywords = text.match(/\b(react|angular|vue|node|java|python|javascript|typescript|css|html|sql|mongodb|postgres|docker|kubernetes|aws|azure|git|figma|photoshop|ui|ux|design|spring|django|flask|express|api|rest|graphql|redis|kafka|go|rust|swift|kotlin|android|ios|flutter|mobile|frontend|backend|fullstack|devops|cloud|data|analytics|machine learning|ai|testing|qa|cypress|jest|selenium)\b/gi) || [];
  
  if (techKeywords.length === 0) {
    // No specific tech keywords found, do basic keyword matching
    const keywords = text.split(/\s+/).filter(word => word.length > 3);
    
    const scoredProfiles = profiles.map(profile => {
      let score = 0;
      
      profile.skills.forEach(skill => {
        const skillName = skill.name.toLowerCase();
        keywords.forEach(keyword => {
          if (skillName.includes(keyword) || keyword.includes(skillName)) {
            score += 3 * (skill.rating / 5);
          }
        });
      });

      keywords.forEach(keyword => {
        if (profile.role.toLowerCase().includes(keyword)) score += 1;
        if (profile.description?.toLowerCase().includes(keyword)) score += 0.5;
      });

      return { profile, score };
    });

    return scoredProfiles
      .filter(sp => sp.score > 2) // Require meaningful match
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(sp => sp.profile);
  }
  
  // Strict skill-based matching when tech keywords found
  const normalizedKeywords = techKeywords.map(k => k.toLowerCase());
  
  const scoredProfiles = profiles.map(profile => {
    let score = 0;
    let hasSkillMatch = false;
    
    profile.skills.forEach(skill => {
      const skillName = skill.name.toLowerCase();
      normalizedKeywords.forEach(keyword => {
        // Check if skill contains the keyword or vice versa
        if (skillName.includes(keyword) || keyword.includes(skillName)) {
          score += 5 * (skill.rating / 5); // Heavy weight on skill match
          hasSkillMatch = true;
        }
      });
    });

    // Only minimal bonus for role match if skills already match
    if (hasSkillMatch) {
      normalizedKeywords.forEach(keyword => {
        if (profile.role.toLowerCase().includes(keyword)) score += 0.5;
      });
    }

    return { profile, score, hasSkillMatch };
  });

  // Only return profiles with actual skill matches
  return scoredProfiles
    .filter(sp => sp.hasSkillMatch && sp.score > 3) // Require actual skill match
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(sp => sp.profile);
}
