# 🎯 TeamQuor - MVP

Internal platform to create and manage company challenges with AI-powered suggestions for the most suitable profiles.

## 🚀 Tech Stack

- **Next.js 15+** (App Router, React 19)
- **Supabase** (PostgreSQL database)
- **Groq AI** (Llama 3.3 70B - AI profile matching)
- **DaisyUI** + **TailwindCSS 4**
- **TypeScript**

## 📋 Features

### ✅ 1. Profile Management
- Create, view, edit profiles
- Each profile contains: name, role, business unit, country, skills with ratings
- Advanced search and filtering by name, role, business unit, and skills
- Sort by name, creation date, or skill rating

### ✅ 2. Challenge Management
- Create and view challenges
- Public or private challenges
- Add/remove participants with autocomplete search
- Complete challenges (creator only)
- Search and filter challenges by title, description, status, and type

### ✅ 3. AI-Powered Matching (Groq + Llama 3.3)
- **Groq AI with Llama 3.3 70B** for intelligent suggestions
- Semantic analysis of challenge title and description
- Skills matching with most suitable profiles (up to 10 suggestions)
- Automatic fallback to keyword matching if API unavailable
- Optimized response time (~1-3 seconds)

### ✅ 4. Collaboration Room
- Message area for each challenge
- Active participants list
- Real-time message sending (saved to DB)
- Toast notifications for all user actions
- Confirmation modals for destructive actions

### ✅ 5. Dashboard & Leaderboard
- Homepage with challenge and profile statistics
- "People Similar to You" - automatic matching based on shared skills
- Leaderboard with score based on completed challenges and ratings
- Personalized suggested challenges

## 🏗️ Architecture & Patterns

### SOLID Principles
The codebase follows **SOLID principles** and **Clean Code** best practices:
- **Single Responsibility** - Each file/component has one clear purpose
- **Open/Closed** - Extensible through configuration, not modification
- **Liskov Substitution** - Consistent interfaces across hooks and components
- **Interface Segregation** - Components receive only the props they need
- **Dependency Inversion** - Pages depend on abstractions (hooks, services)

### Layered Architecture
```
app/* (Pages)          ← Composition layer
  ↓ uses
components/*           ← Presentation layer (UI only)
  ↓ uses
hooks/*                ← Data fetching layer
  ↓ uses
lib/*                  ← Business logic layer (pure functions)
```

### Custom Hooks
- **`useAuth()`** - Centralized authentication management
  - `currentUser`, `loading`, `login()`, `logout()`, `checkAuth()`, `isAuthenticated`
  - Removes localStorage duplication from all components
- **`useProfiles()`** - Profile data fetching with consistent interface
- **`useChallenges()`** - Challenge data fetching with filtering options
- **`useLeaderboard()`** - Leaderboard building with scoring integration
- **`useToast()`** - Toast notification state management

### Services Layer
- **`scoringService`** - Pure functions for similarity calculation and ranking
  - `calculateProfileSimilarity()`, `findSimilarProfiles()`
  - `calculateChallengeMatch()`, `findSuggestedChallenges()`
  - `buildLeaderboard()` - Complete leaderboard with scores
- **`constants`** - All magic numbers and strings centralized
  - Weights, limits, status enums, messages, badge classes

### Reusable Components
- **Challenge Components**:
  - `ChallengeHeader` - Challenge detail header
  - `SuggestedChallenges` - AI suggested challenges grid
  - `SuggestedProfiles` - AI suggested profiles sidebar
  - `ParticipantsList` - Participants with creator highlighting
  - `MessageList` - Collaboration room with read-only mode
  - `RatingModal` - Star rating for completed challenges
  - `ChallengeSearchFilters` - Search and filter component for challenges page
- **Core Components**:
  - `ProfileCard` - Profile card with 2 modes (matching skills / skill badges)
  - `ChallengeCard` - Challenge card with 3 modes (view / join / delete)
  - `ProfileAutocomplete` - Autocomplete search for profile selection
  - `Toast` & `ToastContainer` - Toast notification system (4 types: success/error/warning/info)
  - `ConfirmModal` - Confirmation modal for destructive actions
  - `LoadingSpinner` & `PageLoader` - Consistent loading states
  - `ErrorBoundary` - Global React error handling

### Error Handling
- `ErrorBoundary` applied globally via `ClientLayout`
- Fallback UI with refresh/home buttons
- Centralized error logging

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project on [Supabase](https://supabase.com)
2. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Groq AI for intelligent profile matching
GROQ_API_KEY=your-groq-api-key-here
```

3. Run the SQL schema in Supabase SQL Editor:
   - Open the `supabase-schema.sql` file
   - Copy all content
   - Paste into Supabase SQL Editor and run
   - (Optional) Run `supabase-demo-challenges.sql` for demo data
   - (Optional) Run `supabase-disable-rls.sql` to disable RLS (MVP/demo only)

### 3. Get Groq API Key (Optional but Recommended)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Create a free account
3. Generate a new API key
4. Add `GROQ_API_KEY` to `.env.local`

**Note:** If you don't configure Groq, the app will automatically use keyword matching fallback.

### 4. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /challenges
    /[id]
      page.tsx          # Challenge detail + collaboration room
    /new
      page.tsx          # Create new challenge (with AI suggestions)
    page.tsx            # Challenge list
  /profiles
    /[id]
      /edit
        page.tsx        # Edit profile
      page.tsx          # View profile
    /new
      page.tsx          # Create new profile
    page.tsx            # Profile list (with search and filters)
  /api
    /ai-suggest
      route.ts          # API endpoint for AI suggestions
  layout.tsx            # Main layout with navbar and ErrorBoundary
  page.tsx              # Homepage with dashboard and leaderboard

/components
  Navbar.tsx                      # Navbar with TeamQuor logo
  ProfileCard.tsx                 # Reusable profile card
  ChallengeCard.tsx               # Reusable challenge card
  ChallengeSearchFilters.tsx      # Search and filter component
  ProfileAutocomplete.tsx         # Autocomplete profile selection
  Toast.tsx                       # Toast notification system
  ConfirmModal.tsx                # Confirmation modal
  LoadingSpinner.tsx              # Spinner and PageLoader
  ErrorBoundary.tsx               # Global error boundary
  ClientLayout.tsx                # Wrapper with ErrorBoundary
  /challenge
    ChallengeHeader.tsx           # Challenge detail header
    SuggestedProfiles.tsx         # Suggested profiles sidebar
    SuggestedChallenges.tsx       # Suggested challenges grid
    ParticipantsList.tsx          # Participants list with highlighting
    MessageList.tsx               # Collaboration room messages
    RatingModal.tsx               # Participant rating modal

/hooks
  useAuth.ts                      # Centralized authentication hook
  useProfiles.ts                  # Profile data fetching hooks
  useChallenges.ts                # Challenge data fetching hooks
  useLeaderboard.ts               # Leaderboard building hook
  useToast.ts                     # Toast notification hook

/lib
  supabase.ts                     # Supabase client
  aiService.ts                    # Groq AI + fallback matching
  aiMock.ts                       # Legacy mock (deprecated)
  scoringService.ts               # Business logic (pure functions)
  constants.ts                    # All magic numbers and strings

/types
  index.ts                        # TypeScript types (Profile, Challenge, Skill, etc.)
```

## 🤖 How AI Matching Works

### Groq AI (Preferred)
When `GROQ_API_KEY` is configured:

1. **Intelligent pre-filtering**: Reduces profiles to analyze based on technical keywords
2. **Prompt engineering**: Sends challenge + profiles to Llama 3.3 70B
3. **Semantic analysis**: AI analyzes skills, roles, descriptions to find perfect matches
4. **Intelligent scoring**: Returns profiles sorted by relevance (up to 10)
5. **Automatic fallback**: If AI fails, uses keyword matching

### Keyword Matching (Fallback)
When Groq is unavailable:

1. **Extract keywords** from challenge title and description
2. **Calculate score** for each profile:
   - +10 points for skill match (reduced for rating difference)
   - +3 points for same business unit
   - +2 points for same country
3. **Sort** profiles by score
4. **Return** top 10 profiles with score > 0

**Performance**: 
- Groq AI: ~1-3 seconds (depends on number of profiles)
- Keyword Matching: <100ms (instant)

## 📊 Database Schema

### Tables:

- **profiles**: 
  - id, name, role, business_unit, country, photo, description, interests
  - skills: `{ name: string, rating: 1-5 }[]`
  - created_at
  
- **challenges**: 
  - id, title, description, type (personal/team/company)
  - status (ongoing/completed), created_by
  - suggested_profiles: `string[]` (AI suggested profile IDs)
  - participants: `string[]` (participating profile IDs)
  - created_at
  
- **messages**: 
  - id, challenge_id, sender_profile_id, content
  - created_at

- **challenge_ratings**:
  - id, challenge_id, profile_id, rating (1-5)
  - created_at

**Note:** RLS (Row Level Security) disabled for MVP. In production, enable RLS and add appropriate policies.

## 🎨 UI Components (DaisyUI)

Used throughout the app:
- **Cards** - ProfileCard, ChallengeCard, layout cards
- **Buttons** - Primary, secondary, ghost, error variants
- **Forms** - Input, textarea, autocomplete with validation
- **Badges** - Status, type, skill indicators
- **Stats** - Dashboard statistics
- **Chat bubbles** - Collaboration room messages
- **Loading** - Spinners (sm/md/lg), PageLoader
- **Navbar** - Responsive with TeamQuor logo and dropdown
- **Modals** - Rating modal, confirmation modals
- **Toasts** - Success, error, warning, info notifications
- **Alerts** - Success, info, warning states

**Theme:** Custom TeamSystem theme with brand colors:
- Primary: `#00C2D1` (cyan/turquoise)
- Secondary: `#0066CC` (blue)
- Gradient titles: `from-primary to-secondary`

## 📝 Notes

### Authentication
- ❌ **No real authentication** - profiles manually selected
- ✅ **localStorage** to simulate user sessions
- ✅ **useAuth() hook** for centralized user state management

### Real-time
- ❌ **No real-time features** - messages saved to DB but no live sync
- ✅ **Can be extended** with Supabase Realtime subscriptions

### AI Matching
- ✅ **Groq AI** - intelligent, semantic, precise (requires free API key)
- ✅ **Automatic fallback** - keyword matching if Groq unavailable
- ✅ **Production-ready** - error handling and timeouts

### Code Quality
- ✅ **TypeScript strict** - complete type safety
- ✅ **SOLID principles** - all 5 principles followed
- ✅ **Clean Code** - DRY, well-documented, consistent naming
- ✅ **Layered architecture** - clear separation of concerns
- ✅ **Component reusability** - small, focused components
- ✅ **Error handling** - global ErrorBoundary
- ✅ **No console.log** in production

## 📈 Metrics

### Code Quality Improvements
- **Homepage**: 464 → 302 lines (-35%)
- **Challenge Detail**: 717 → 353 lines (-51%)
- **New Architecture**: +2,000+ lines of structured code
- **Removed**: -800+ lines of duplicate/messy code
- **Browser Dialogs Replaced**: 100% (all alert() and confirm() replaced with custom UI)
- **TypeScript Errors**: 0
- **Build Status**: ✅ Successful

### Architecture
- **Service Layer**: 2 files, 416 lines
- **Custom Hooks**: 5 files, 611 lines
- **Specialized Components**: 11 files, 1,100+ lines
- **Constants**: 170 lines centralized

## 🚀 Deploy

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   GROQ_API_KEY=... (optional)
   ```
4. Automatic deploy!

**Note:** See `VERCEL_DEPLOYMENT.md` for common troubleshooting.

## 🔜 Possible Future Improvements

- [ ] Supabase Auth authentication
- [ ] Real-time messaging with Supabase Realtime
- [ ] Push notifications
- [ ] File upload for challenges
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Challenge templates
- [ ] Gamification and achievements
- [ ] Unit tests (Jest, React Testing Library)
- [ ] E2E tests (Playwright)

## 📖 License

MIT
