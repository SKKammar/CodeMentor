<p align="center">
  <strong>CodeMentor</strong>
</p>

<p align="center">
  <em>Learn to think, not copy-paste.</em><br>
  An AI-powered coding assistant that teaches through Socratic questioning, deep code explanations, and a visual knowledge graph.
</p>

---

## What makes CodeMentor different?

Most AI coding tools give you the answer. CodeMentor **refuses to**.

Instead, it uses a **Socratic hint engine** — when you're stuck, it asks targeted questions that guide you toward discovering the fix yourself. The result: you actually learn.

## Features

### 🧠 Socratic Hint Engine (Primary Mode)
- Submit your code + describe what you're stuck on
- AI asks 2–3 pointed questions to guide you toward the solution
- Each follow-up narrows the focus until you solve it independently
- Only reveals the answer if you explicitly ask

### 📖 Code Explainer
- Full line-by-line / block-by-block breakdown
- Structured collapsible sections with syntax-highlighted snippets
- Auto-extracts CS concept tags (e.g. "recursion", "dynamic programming")

### 🔍 Code Review
- Structured review: correctness, time/space complexity, readability
- Severity-tagged feedback: **Critical**, **Warning**, **Suggestion**, **Praise**
- References specific line numbers and variable names

### 📊 Session-Based Learning Dashboard
- Total problems attempted vs solved independently
- Hint dependency score over time (lower = better)
- Language usage distribution (bar chart)
- Activity streak tracker

### 🕸️ Knowledge Graph
- Visual force-directed graph of CS concepts you've encountered
- Nodes glow brighter with repeated exposure
- Click any node to see related concepts and exposure count
- Built with ReactFlow

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + Framer Motion |
| Code Editor | Monaco Editor (same as VS Code) |
| AI | Claude API (`claude-sonnet-4-6`) with SSE streaming |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password + GitHub OAuth) |
| Charts | Recharts |
| Graph | ReactFlow |

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone & Install

```bash
git clone https://github.com/SKKammar/CodeMentor.git
cd CodeMentor
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Set up the database

Run the SQL in `supabase/schema.sql` in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).

This creates the `sessions` and `concept_graph` tables with Row Level Security enabled.

### 4. Configure GitHub OAuth (optional)

In your Supabase dashboard:
1. Go to **Authentication → Providers → GitHub**
2. Add your GitHub OAuth App Client ID and Secret
3. Set the callback URL to `https://your-domain/auth/callback`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming Claude responses (SSE)
│   │   ├── concepts/route.ts       # Upsert concept tags to DB
│   │   ├── concepts/extract/route.ts # Dedicated concept extraction via Claude
│   │   ├── session/route.ts        # Save session to Supabase
│   │   └── dashboard/route.ts     # Aggregated dashboard stats
│   ├── auth/
│   │   ├── login/page.tsx          # Email + GitHub OAuth login
│   │   └── callback/route.ts       # OAuth redirect handler
│   ├── dashboard/
│   │   ├── page.tsx                # Stats, charts, streak tracker
│   │   └── graph/page.tsx          # Knowledge graph visualization
│   ├── layout.tsx                  # Root layout (fonts, dark theme)
│   └── page.tsx                    # Main editor + AI panel
├── components/
│   ├── MonacoEditor.tsx            # Code editor with auto language detection
│   ├── AiResponsePanel.tsx         # Streaming markdown response display
│   ├── ModeToggle.tsx              # Solve / Explain / Review switcher
│   ├── ProblemInput.tsx            # Problem description input
│   ├── AuthButton.tsx              # Login/logout in header
│   ├── SessionTracker.tsx          # Hint counter + solve status
│   ├── ConceptTags.tsx             # Extracted concept badges
│   ├── dashboard/                  # StatsCards, LanguageChart, HintScoreChart, StreakTracker
│   └── graph/ConceptGraph.tsx      # ReactFlow knowledge graph
├── hooks/
│   ├── useChat.ts                  # Chat state + streaming logic
│   ├── useAuth.ts                  # Supabase auth state
│   └── useSession.ts               # Session saving hook
├── lib/
│   ├── claude.ts                   # Claude API streaming helper
│   ├── prompts.ts                  # System prompts (Socratic, Explain, Review)
│   └── supabase/
│       ├── client.ts               # Browser-side Supabase client
│       ├── server.ts               # Server-side Supabase clients
│       └── auth.ts                 # Auth guard utility for API routes
└── types/
    └── index.ts                    # TypeScript type definitions
```

## Security

- **Row Level Security (RLS)** on all Supabase tables — users can only read/write their own data
- **Auth guards** on `/api/session`, `/api/concepts`, and `/api/concepts/extract` — unauthenticated requests are rejected
- **Rate limiting** on `/api/chat` — conversations are capped at 50 messages to prevent API abuse
- **Service role key** is server-only, never exposed to the client

## License

MIT
