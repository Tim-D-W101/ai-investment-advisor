# InvestNow — Project Knowledge Base

## Overview

An AI-powered investment education and portfolio tracking app for South African investors. Built with Next.js (App Router), Supabase, and Claude AI.

**Compliance note:** InvestNow is NOT an FSP-licensed entity. All AI output is educational information only — not regulated financial advice under the FAIS Act.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS v4 (theme variables in `globals.css`, no tailwind.config.ts)
- **Auth / DB:** Supabase Auth + Postgres
- **AI:** Claude API via `@anthropic-ai/sdk` (model: `claude-sonnet-4-6`)
- **Charts:** Recharts
- **Icons:** lucide-react
- **Animations:** Framer Motion
- **Market data:** Alpha Vantage (`ALPHA_VANTAGE_KEY` env var)
- **Hosting:** Vercel

## Voice and Tone

- South African English, plain language, no jargon
- Currency always in ZAR with thousand separators (use `toLocaleString("en-ZA")`)
- Never use the word "advice" — use "guidance" or "insights"
- Always show legal disclaimer on AI output
- Mobile-first design

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (centered layout)
│   │   ├── auth/callback/route.ts # OAuth & email link exchange
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/                     # Authenticated route group (header + footer)
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Server component, fetches profile + holdings
│   │   │   ├── RecommendationPanel.tsx  # Client: calls /api/recommend, shows pie chart
│   │   │   └── CelebrationWrapper.tsx
│   │   ├── onboarding/
│   │   │   ├── page.tsx
│   │   │   ├── OnboardingQuiz.tsx # 5-question quiz with Framer Motion
│   │   │   └── actions.ts         # saveProfile server action
│   │   ├── portfolio/
│   │   │   ├── page.tsx           # Server component, fetches holdings
│   │   │   └── PortfolioTracker.tsx  # Client: add/remove holdings, live prices
│   │   ├── explore/page.tsx       # JSE stocks & ETF browser
│   │   ├── stock/[ticker]/
│   │   │   ├── page.tsx           # Stock detail page (server)
│   │   │   └── StockExplainer.tsx # Client: fetches /api/explain
│   │   └── settings/page.tsx      # Profile view, legal links
│   ├── api/
│   │   ├── recommend/route.ts     # POST: generate/return AI portfolio (cached per user)
│   │   │                          # DELETE: clear cached recommendation
│   │   ├── explain/route.ts       # POST { ticker } → AI plain-language explanation
│   │   ├── price/route.ts         # GET ?ticker=NPN.JO → live price from Alpha Vantage
│   │   ├── holdings/route.ts      # GET: list, POST: add holding
│   │   └── holdings/[id]/route.ts # DELETE: remove holding
│   ├── pricing/page.tsx           # Free vs Pro tiers
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── disclaimer/page.tsx        # Investment disclaimer (FSP compliance)
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── Header.tsx                 # Responsive nav, auth-aware, active link highlighting
│   └── Celebration.tsx
├── lib/
│   ├── claude.ts                  # Anthropic SDK: getPortfolioRecommendation, explainStock
│   └── supabase/
│       ├── browser.ts             # Client-side Supabase client
│       ├── server.ts              # Server-side Supabase client (cookies)
│       └── middleware.ts          # Edge middleware Supabase client
└── middleware.ts                  # Route protection for all (app) routes
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
ALPHA_VANTAGE_KEY=your-key
```

## Database Schema (Supabase)

### `profiles` table
```sql
create table profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  age_range text not null,
  horizon text not null,
  monthly_amount text not null,
  risk_reaction text not null,
  goal text not null,
  risk_score integer not null,
  profile_type text not null,       -- 'Conservative' | 'Balanced' | 'Aggressive'
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can read their own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = user_id);
```

### `recommendations` table
```sql
create table recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  portfolio_json jsonb not null,    -- { portfolio: [...], summary: "..." }
  created_at timestamp with time zone default now()
);

alter table recommendations enable row level security;
create policy "Users can insert their own recommendations" on recommendations for insert with check (auth.uid() = user_id);
create policy "Users can read their own recommendations" on recommendations for select using (auth.uid() = user_id);
create policy "Users can delete their own recommendations" on recommendations for delete using (auth.uid() = user_id);
```

### `holdings` table
```sql
create table holdings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  name text not null,
  units numeric not null,
  avg_price numeric not null,
  purchase_date date,
  created_at timestamp with time zone default now()
);

alter table holdings enable row level security;
create policy "Users can manage their own holdings" on holdings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Onboarding Quiz

### Questions (5 total)

| # | Question | Answer options | Scores |
|---|----------|----------------|--------|
| 1 | Age range | Under 25, 25–34, 35–44, 45–54, 55+ | 5, 4, 3, 2, 1 |
| 2 | Investment horizon | <1 yr, 1–3 yrs, 3–5 yrs, 5–10 yrs, 10+ yrs | 1, 2, 3, 4, 5 |
| 3 | Monthly investment | R0–500, R500–2k, R2k–5k, R5k–15k, R15k+ | 1, 2, 3, 4, 5 |
| 4 | Drop 20% reaction | Sell all, Sell some, Hold, Buy more | 1, 2, 3, 5 |
| 5 | Primary goal | Emergency fund, Short-term, Major purchase, Long-term wealth, Retirement | 1, 2, 3, 4, 5 |

### Profile scoring

| Score | Profile |
|-------|---------|
| 5–11  | Conservative |
| 12–18 | Balanced |
| 19–25 | Aggressive |

## Claude Prompt (portfolio recommendation)

**System:** You are a JSE-focused investment educator for South African retail investors. Provide clear, plain-language portfolio guidance in ZAR. Always include 1 cash/money market, 1–2 ETFs, 2–4 JSE-listed stocks, optionally 1 global ETF. Educational only — not regulated advice. Return ONLY valid JSON: `{"portfolio": [{"ticker": "STX40", "name": "...", "type": "ETF", "allocation_percent": 30, "reasoning": "..."}], "summary": "..."}`

**User:** Profile: {profile_type} investor, age {age_range}, horizon {horizon}, monthly investment {monthly_amount}, goal {goal}.

## Design System

| Token       | Value    | Usage                    |
|-------------|----------|--------------------------|
| navy        | #1F4E79  | Primary brand colour     |
| navy-dark   | #15365e  | Hover / darker accents   |
| navy-light  | #2a6aa8  | Interactive highlights   |
| white       | #ffffff  | Backgrounds, cards       |
| grey-soft   | #f5f7fa  | Subtle backgrounds       |
| grey        | #e1e5eb  | Borders, dividers        |
| grey-dark   | #9ca3af  | Muted text, placeholders |

## Important Rules

1. Always show FSP disclaimer on AI output and in app footer
2. Never expose ANTHROPIC_API_KEY or ALPHA_VANTAGE_KEY client-side
3. Cache market prices for 15 minutes minimum (in-memory Map in API route)
4. Round all displayed numbers — no floating-point artifacts
5. All currency formatted as ZAR with thousand separators
6. All percentages to 2 decimal places
7. Use `await params` for dynamic route params (Next.js 16+ async params)
8. Use `RouteContext<'/path/[param]'>` for typed route handler context
