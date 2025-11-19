# 🎯 Challenge App - MVP

Piattaforma interna per creare e gestire challenge aziendali con suggerimenti AI per i profili più adatti.

## 🚀 Stack Tecnologico

- **Next.js 14+** (App Router)
- **Supabase** (Database only, no auth)
- **DaisyUI** + **TailwindCSS**
- **TypeScript**

## 📋 Funzionalità

### ✅ 1. Gestione Profili
- Creazione, visualizzazione, modifica ed eliminazione profili
- Ogni profilo contiene: nome, ruolo, business unit, skills

### ✅ 2. Gestione Challenge
- Creazione e visualizzazione challenge
- Challenge pubbliche o private
- Aggiunta/rimozione partecipanti

### ✅ 3. AI Mock Assistant
- Suggerimento automatico dei top 3 profili più adatti
- Algoritmo basato su keyword matching tra:
  - Titolo/descrizione challenge
  - Skills dei profili
  - Ruoli e business unit

### ✅ 4. Collaboration Room
- Area messaggi per ogni challenge
- Lista partecipanti attivi
- Invio messaggi (mock, no real-time)

## 🛠️ Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Copia il file `.env.local` e inserisci le tue credenziali:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Esegui lo schema SQL nel SQL Editor di Supabase:
   - Apri il file `supabase-schema.sql`
   - Copia tutto il contenuto
   - Incollalo nel SQL Editor di Supabase ed esegui

### 3. Avvia l'app

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
      page.tsx          # Crea nuova challenge
    page.tsx            # Lista challenge
  /profiles
    /[id]
      /edit
        page.tsx        # Modifica profilo
      page.tsx          # Visualizza profilo
    /new
      page.tsx          # Crea nuovo profilo
    page.tsx            # Lista profili
  layout.tsx            # Layout principale con navbar
  page.tsx              # Homepage

/components
  Navbar.tsx            # Navbar con DaisyUI

/lib
  supabase.ts           # Client Supabase
  aiMock.ts             # Funzione AI mock per suggerimenti

/types
  index.ts              # TypeScript types
```

## 🤖 Come Funziona l'AI Mock

La funzione `suggestProfilesForChallenge()` in `lib/aiMock.ts`:

1. **Estrae keywords** da titolo e descrizione della challenge
2. **Calcola uno score** per ogni profilo:
   - +3 punti per match con skills
   - +2 punti per match con ruolo
   - +1 punto per match con business unit
3. **Ordina** i profili per score
4. **Ritorna** i top 3 profili con score > 0

## 📊 Database Schema

### Tabelle:

- **profiles**: id, name, role, business_unit, skills[]
- **challenges**: id, title, description, type, suggested_profiles[], participants[]
- **messages**: id, challenge_id, sender_profile_id, content, created_at

## 🎨 UI Components (DaisyUI)

- Cards
- Buttons
- Forms
- Badges
- Stats
- Chat bubbles
- Loading spinners

## 📝 Note

- ❌ **Nessuna autenticazione** - profili mockati
- ❌ **Nessuna funzionalità real-time** - messaggi salvati in DB ma senza sync live
- ✅ **Mock AI** - algoritmo semplice, nessuna API esterna
- ✅ **Supabase** - usato solo come database

## 🚀 Deploy

Per il deploy su Vercel:

1. Push del codice su GitHub
2. Importa il progetto su Vercel
3. Aggiungi le variabili d'ambiente da `.env.local`
4. Deploy!

## 📖 Licenza

MIT
