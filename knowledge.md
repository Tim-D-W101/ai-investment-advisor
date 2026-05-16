# InvestNow — Project Knowledge Base

## Overview

A Next.js application for AI-powered portfolio management, built for South African investors.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth (email + password)
- **Icons:** lucide-react

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (centered layout, no header)
│   │   ├── auth/
│   │   │   └── callback/route.ts  # OAuth & email link redirect handler
│   │   ├── login/page.tsx         # Login page with Supabase Auth
│   │   └── signup/page.tsx        # Signup page with Supabase Auth
│   │   └── layout.tsx             # Centered card layout for auth pages
│   ├── (app)/                     # Authenticated route group (with header)
│   │   └── dashboard/page.tsx     # Protected dashboard (server component)
│   │   └── layout.tsx             # App layout with Header component
│   ├── globals.css                 # Tailwind v4 theme & global styles
│   ├── layout.tsx                  # Root layout (metadata, fonts)
│   └── page.tsx                    # Landing page (hero, features, CTA)
├── components/
│   └── Header.tsx                  # Nav header with auth state (client)
├── lib/
│   └── supabase/
│       ├── browser.ts              # Supabase client for client components
│       ├── server.ts               # Supabase client for server components
│       └── middleware.ts           # Supabase client for middleware
├── middleware.ts                   # Route protection & redirects
└── ...
```

## Key Decisions

### Tailwind CSS v4
- No `tailwind.config.ts` — theme variables are defined in `globals.css` via the `@theme` directive.
- Custom colours: `navy` (#1F4E79), `navy-dark`, `navy-light`, `grey-soft`, `grey`, `grey-dark`.

### Route Groups
- `(auth)` — Login, signup, and auth callback routes. Uses a minimal centered layout without the app header.
- `(app)` — Authenticated routes like dashboard. Includes the Header component and expects auth state.

### Authentication
- Uses `@supabase/ssr` for cookie-based session management with Next.js App Router.
- Middleware (`src/middleware.ts`) protects `/dashboard` by redirecting unauthenticated users to `/login`.
- Auth pages redirect authenticated users to `/dashboard`.
- Three Supabase client utilities for different contexts:
  - `server.ts` — `cookies()` from `next/headers` for server components.
  - `browser.ts` — `createBrowserClient` for client components.
  - `middleware.ts` — request-scoped cookies for edge middleware.

### Environment Variables (required)

Create a `.env.local` file (copy from `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project at **Settings > API**.

## Onboarding Quiz

The onboarding quiz at `/onboarding` helps determine a user's investor profile.

### Questions (5 total)

| # | Question | Answers |
|---|----------|---------|
| 1 | What's your age range? | Under 25, 25–34, 35–44, 45–54, 55+ |
| 2 | When do you plan to use this money? | <1 year, 1–3 years, 3–5 years, 5–10 years, 10+ years |
| 3 | How much can you invest monthly? | R0–500, R500–2,000, R2,000–5,000, R5,000–15,000, R15,000+ |
| 4 | If your investments dropped 20%, what would you do? | Sell everything, Sell some, Hold, Buy more |
| 5 | What's your main investment goal? | Emergency fund, Short-term, Major purchase, Long-term wealth, Retirement |

### Scoring Rules

Each answer is scored 1–5 (see OnboardingQuiz.tsx for exact values).

| Total Score | Profile Type |
|-------------|-------------|
| 5–11 | Conservative |
| 12–18 | Balanced |
| 19–25 | Aggressive |

### Supabase Schema: `profiles`

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
  profile_type text not null,
  created_at timestamp with time zone default now()
);

-- Row-level security
alter table profiles enable row level security;

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);
```

### Behaviour
- Unauthenticated users are redirected to `/login`.
- Users with an existing profile are redirected to `/dashboard`.
- After completion, redirects to `/dashboard?onboarded=true` with a celebration animation.

## Design System

| Token         | Value    | Usage                         |
|---------------|----------|-------------------------------|
| navy          | #1F4E79  | Primary brand colour          |
| navy-dark     | #15365e  | Hover / darker accents        |
| navy-light    | #2a6aa8  | Interactive highlights        |
| white         | #ffffff  | Backgrounds, cards            |
| grey-soft     | #f5f7fa  | Subtle backgrounds            |
| grey          | #e1e5eb  | Borders, dividers             |
| grey-dark     | #9ca3af  | Muted text, placeholders      |
