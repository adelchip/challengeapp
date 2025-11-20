# Vercel Deployment Guide

## Required Environment Variables

To deploy this application to Vercel, you need to set the following environment variables in your Vercel project settings.

### 1. Go to Vercel Project Settings
1. Open your project on Vercel Dashboard
2. Go to **Settings** → **Environment Variables**

### 2. Add Required Variables

#### Supabase Configuration (Required)

```
NEXT_PUBLIC_SUPABASE_URL
```
**Value**: Your Supabase project URL (e.g., `https://krpmgdjmxhbmfpycngcs.supabase.co`)
- Get this from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project URL

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value**: Your Supabase anon/public key
- Get this from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project API keys → `anon` `public` key

#### Groq API (Optional - for AI Features)

```
GROQ_API_KEY
```
**Value**: Your Groq API key (e.g., `gsk_...`)
- Get this from: [Groq Console](https://console.groq.com) → API Keys
- **Note**: If not provided, the app will use fallback keyword matching instead of AI-powered profile suggestions

### 3. Set Environment for All Environments
Make sure to set these variables for:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Redeploy
After adding environment variables, trigger a new deployment:
- Go to **Deployments** tab
- Click the **...** menu on the latest deployment
- Select **Redeploy**

## Common Issues

### 401 Error: "Unauthorized" from Supabase
**Cause**: Row Level Security (RLS) is enabled on Supabase tables, blocking anonymous access
**Fix**: 
1. Go to your Supabase project: [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Run the SQL from `supabase-disable-rls.sql` file in your repo
4. Or manually disable RLS:
   - Go to **Table Editor** → select each table (profiles, challenges, messages, challenge_ratings)
   - Click **⋮** menu → **Edit Table** 
   - Uncheck "Enable Row Level Security (RLS)"
   - Click **Save**

**Alternative (More Secure)**: Instead of disabling RLS, add policies that allow public read access:
```sql
-- Enable read access for everyone
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON challenges FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON challenge_ratings FOR SELECT USING (true);

-- Enable insert/update/delete for all users (for demo purposes)
CREATE POLICY "Enable insert for all users" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON profiles FOR DELETE USING (true);
-- Repeat for other tables...
```

### Build Error: "Invalid supabaseUrl"
**Cause**: `NEXT_PUBLIC_SUPABASE_URL` is missing or invalid
**Fix**: Ensure the URL starts with `https://` and is correctly set in Vercel environment variables

### Build Error: "GROQ_API_KEY environment variable is missing"
**Fix**: This error should no longer occur (we made the API key optional). If you see it, the latest code may not be deployed.

### App works locally but not on Vercel
**Cause**: Environment variables are only in `.env.local` (which is not deployed)
**Fix**: Add all environment variables to Vercel settings as described above

## Verification

After deployment, verify the app works by:
1. ✅ Homepage loads
2. ✅ Can view profiles
3. ✅ Can create challenges (should work even without GROQ_API_KEY)
4. ✅ AI suggestions work (only if GROQ_API_KEY is set)
