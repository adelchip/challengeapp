import { NextRequest, NextResponse } from 'next/server';
import { suggestProfilesWithAI } from '@/lib/aiService';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { challenge, profiles } = await request.json();

    if (!challenge || !profiles) {
      return NextResponse.json(
        { error: 'Missing challenge or profiles data' },
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    const suggestedProfiles = await suggestProfilesWithAI(challenge, profiles);
    const duration = Date.now() - startTime;

    return NextResponse.json({ suggestedProfiles });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}
