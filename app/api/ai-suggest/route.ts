import { NextRequest, NextResponse } from 'next/server';
import { suggestProfilesWithAI } from '@/lib/aiService';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 AI API endpoint called');
    
    const { challenge, profiles } = await request.json();

    if (!challenge || !profiles) {
      console.error('❌ Missing data');
      return NextResponse.json(
        { error: 'Missing challenge or profiles data' },
        { status: 400 }
      );
    }

    console.log('📊 Challenge:', challenge.title);
    console.log('👥 Analyzing', profiles.length, 'profiles');
    
    const startTime = Date.now();
    const suggestedProfiles = await suggestProfilesWithAI(challenge, profiles);
    const duration = Date.now() - startTime;
    
    console.log('✅ AI suggestion complete in', duration, 'ms');
    console.log('🎯 Suggested:', suggestedProfiles.map(p => p.name).join(', '));

    return NextResponse.json({ suggestedProfiles });
  } catch (error) {
    console.error('❌ AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}
