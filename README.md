# 🎯 Challenge App - MVP

Piattaforma interna per creare e gestire challenge aziendali con suggerimenti AI per i profili più adatti.

## 🚀 Stack Tecnologico

- **Next.js 15+** (App Router, React 19)
- **Supabase** (PostgreSQL database)
- **Groq AI** (Llama 3.3 70B - AI profile matching)
- **DaisyUI** + **TailwindCSS 4**
- **TypeScript**

## 📋 Funzionalità

### ✅ 1. Gestione Profili
- Creazione, visualizzazione, modifica profili
- Ogni profilo contiene: nome, ruolo, business unit, paese, skills con rating
- Ricerca e filtro avanzati per nome, ruolo, business unit e skills
- Ordinamento per nome, data creazione, o skill rating

### ✅ 2. Gestione Challenge
- Creazione e visualizzazione challenge
- Challenge pubbliche o private
- Aggiunta/rimozione partecipanti
- Completamento challenge (solo creator)

### ✅ 3. AI-Powered Matching (Groq + Llama 3.3)
- **Groq AI con Llama 3.3 70B** per suggerimenti intelligenti
- Analisi semantica di titolo e descrizione challenge
- Match skills con profili più adatti (fino a 10 suggerimenti)
- Fallback automatico a keyword matching se API non disponibile
- Response time ottimizzato (~1-3 secondi)

### ✅ 4. Collaboration Room
- Area messaggi per ogni challenge
- Lista partecipanti attivi
- Invio messaggi in tempo reale (salvati in DB)

### ✅ 5. Dashboard & Leaderboard
- Homepage con statistiche challenge e profili
- "People Similar to You" - match automatico basato su skills condivise
- Leaderboard con score basato su challenge completate e rating
- Suggested challenges personalizzati

## 🏗️ Architettura & Patterns

### Custom Hooks
- **`useAuth()`** - Gestione centralizzata autenticazione
  - `currentUser`, `loading`, `login()`, `logout()`, `checkAuth()`, `isAuthenticated`
  - Rimuove duplicazione localStorage da tutti i componenti

### Componenti Riusabili
- **`ProfileCard`** - Card profilo con 2 modalità (matching skills / skill badges)
- **`ChallengeCard`** - Card challenge con 3 modalità (view / join / delete)
- **`LoadingSpinner` & `PageLoader`** - Stati di caricamento consistenti
- **`ErrorBoundary`** - Gestione errori React globale
- **`ChallengeHeader`** - Header dettaglio challenge
- **`SuggestedProfiles`** - Sidebar profili AI

### Error Handling
- `ErrorBoundary` applicato globalmente via `ClientLayout`
- Fallback UI con pulsanti refresh/home
- Logging errori centralizzato

## 🛠️ Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Crea il file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Groq AI for intelligent profile matching
GROQ_API_KEY=your-groq-api-key-here
```

3. Esegui lo schema SQL nel SQL Editor di Supabase:
   - Apri il file `supabase-schema.sql`
   - Copia tutto il contenuto
   - Incollalo nel SQL Editor di Supabase ed esegui
   - (Opzionale) Esegui `supabase-demo-challenges.sql` per dati demo
   - (Opzionale) Esegui `supabase-disable-rls.sql` per disabilitare RLS (solo per MVP/demo)

### 3. Ottieni Groq API Key (Opzionale ma raccomandato)

1. Vai su [https://console.groq.com](https://console.groq.com)
2. Crea un account gratuito
3. Genera una nuova API key
4. Aggiungi `GROQ_API_KEY` al file `.env.local`

**Nota:** Se non configuri Groq, l'app userà automaticamente il fallback keyword matching.

### 4. Avvia l'app

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📁 Struttura del Progetto

```
/app
  /challenges
    /[id]
      page.tsx          # Dettaglio challenge + collaboration room
    /new
      page.tsx          # Crea nuova challenge (con AI suggestions)
    page.tsx            # Lista challenge
  /profiles
    /[id]
      /edit
        page.tsx        # Modifica profilo
      page.tsx          # Visualizza profilo
    /new
      page.tsx          # Crea nuovo profilo
    page.tsx            # Lista profili (con ricerca e filtri)
  /api
    /ai-suggest
      route.ts          # API endpoint per AI suggestions
  layout.tsx            # Layout principale con navbar e ErrorBoundary
  page.tsx              # Homepage con dashboard e leaderboard

/components
  Navbar.tsx                # Navbar con DaisyUI
  ProfileCard.tsx           # Card profilo riusabile
  ChallengeCard.tsx         # Card challenge riusabile
  LoadingSpinner.tsx        # Spinner e PageLoader
  ErrorBoundary.tsx         # Error boundary globale
  ClientLayout.tsx          # Wrapper con ErrorBoundary
  /challenge
    ChallengeHeader.tsx     # Header dettaglio challenge
    SuggestedProfiles.tsx   # Sidebar profili suggeriti

/hooks
  useAuth.ts                # Hook autenticazione centralizzato

/lib
  supabase.ts               # Client Supabase
  aiService.ts              # Groq AI + fallback matching
  aiMock.ts                 # Legacy mock (deprecated)

/types
  index.ts                  # TypeScript types (Profile, Challenge, Skill, etc.)
```

## 🤖 Come Funziona l'AI Matching

### Groq AI (Preferito)
Quando `GROQ_API_KEY` è configurato:

1. **Pre-filtraggio intelligente**: Riduce i profili da analizzare basandosi su keyword tecniche
2. **Prompt engineering**: Invia challenge + profili a Llama 3.3 70B
3. **Analisi semantica**: L'AI analizza skills, ruoli, descrizioni per trovare match perfetti
4. **Scoring intelligente**: Restituisce profili ordinati per rilevanza (fino a 10)
5. **Fallback automatico**: Se l'AI fallisce, usa keyword matching

### Keyword Matching (Fallback)
Quando Groq non è disponibile:

1. **Estrai keywords** da titolo e descrizione della challenge
2. **Calcola score** per ogni profilo:
   - +10 punti per skill match (ridotto per differenza rating)
   - +3 punti per same business unit
   - +2 punti per same country
3. **Ordina** profili per score
4. **Restituisci** top 10 profili con score > 0

**Performance**: 
- Groq AI: ~1-3 secondi (dipende da numero profili)
- Keyword Matching: <100ms (istantaneo)

## 📊 Database Schema

### Tabelle:

- **profiles**: 
  - id, name, role, business_unit, country, photo, description, interests
  - skills: `{ name: string, rating: 1-5 }[]`
  - created_at
  
- **challenges**: 
  - id, title, description, type (personal/team/company)
  - status (ongoing/completed), created_by
  - suggested_profiles: `string[]` (IDs profili suggeriti da AI)
  - participants: `string[]` (IDs profili che partecipano)
  - created_at
  
- **messages**: 
  - id, challenge_id, sender_profile_id, content
  - created_at

**Note:** RLS (Row Level Security) disabilitato per MVP. In produzione, abilitare RLS e aggiungere policies appropriate.

## 🎨 UI Components (DaisyUI)

Utilizzati in tutta l'app:
- **Cards** - ProfileCard, ChallengeCard, layout cards
- **Buttons** - Primary, secondary, ghost, error variants
- **Forms** - Input, textarea, select con validazione
- **Badges** - Status, type, skill indicators
- **Stats** - Dashboard statistics
- **Chat bubbles** - Collaboration room messages
- **Loading** - Spinners (sm/md/lg), PageLoader
- **Navbar** - Responsive con dropdown

**Theme:** DaisyUI default con gradient backgrounds personalizzati

## 📝 Note

### Autenticazione
- ❌ **Nessuna autenticazione vera** - profili selezionati manualmente
- ✅ **localStorage** per simulare sessioni utente
- ✅ **useAuth() hook** per gestione centralizzata stato utente

### Real-time
- ❌ **Nessuna funzionalità real-time** - messaggi salvati in DB ma no sync live
- ✅ **Possibile estendere** con Supabase Realtime subscriptions

### AI Matching
- ✅ **Groq AI** - intelligente, semantico, preciso (richiede API key gratuita)
- ✅ **Fallback automatico** - keyword matching se Groq non disponibile
- ✅ **Production-ready** - gestione errori e timeout

### Code Quality
- ✅ **TypeScript strict** - type safety completo
- ✅ **Component reusability** - DRY principles
- ✅ **Error handling** - ErrorBoundary globale
- ✅ **Clean code** - nessun console.log in production

## 🚀 Deploy

### Vercel (Raccomandato)

1. Push del codice su GitHub
2. Importa il progetto su [Vercel](https://vercel.com)
3. Aggiungi le variabili d'ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   GROQ_API_KEY=... (opzionale)
   ```
4. Deploy automatico!

**Nota:** Vedi `VERCEL_DEPLOYMENT.md` per troubleshooting comune.

## 🔜 Possibili Miglioramenti Futuri

- [ ] Autenticazione Supabase Auth
- [ ] Real-time messaging con Supabase Realtime
- [ ] Notifiche push
- [ ] File upload per challenge
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Challenge templates
- [ ] Gamification e achievements

## 📖 Licenza

MIT
