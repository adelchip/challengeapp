# AI-Powered Profile Suggestions Setup

This application uses **Groq** with **Llama 3.3 70B** for intelligent profile matching.

## Setup Instructions

### 1. Get Your Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card required)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

### 2. Configure Environment Variables

Open `.env.local` and replace `your_groq_api_key_here` with your actual Groq API key:

```bash
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. How It Works

When you create a new challenge, the AI agent:

1. **Analyzes** the challenge title and description
2. **Evaluates** all available profiles considering:
   - Skills match (weighted by rating 1-5 stars)
   - Role relevance
   - Interests alignment
   - Profile description
3. **Suggests** the top 3 most suitable profiles
4. **Returns** results in seconds using Groq's ultra-fast inference

### 4. Model Details

- **Model**: Llama 3.3 70B Versatile
- **Provider**: Groq (fastest LLM inference)
- **Cost**: FREE (generous free tier)
- **Speed**: ~500 tokens/second
- **Fallback**: Simple keyword matching if API fails

### 5. Test the AI

1. Start the dev server: `npm run dev`
2. Create some profiles with varied skills
3. Go to **Challenges > New Challenge**
4. Fill in challenge details (e.g., "Need React developer for new feature")
5. Click **Create Challenge**
6. View AI-suggested profiles on the challenge detail page

### 6. API Endpoint

The AI runs server-side via `/api/ai-suggest` to keep your API key secure.

**Request:**
```json
{
  "challenge": {
    "title": "Build mobile app",
    "description": "We need a React Native developer..."
  },
  "profiles": [...]
}
```

**Response:**
```json
{
  "suggestedProfiles": [
    { "id": "...", "name": "John Doe", ... },
    { "id": "...", "name": "Jane Smith", ... },
    { "id": "...", "name": "Bob Wilson", ... }
  ]
}
```

### 7. Troubleshooting

**AI suggestions not working?**
- Check your API key is correctly set in `.env.local`
- Restart the dev server after changing env variables
- Check browser console for errors
- Verify Groq API status at [status.groq.com](https://status.groq.com)

**Slow responses?**
- Groq is typically very fast (~1-2 seconds)
- Check your internet connection
- The fallback keyword matcher will activate if API times out

### 8. Free Tier Limits

Groq's free tier includes:
- **14,400 requests per day**
- **Unlimited tokens** (within rate limits)
- No credit card required

This is more than enough for development and small production use!
