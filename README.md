# Chatbot Portfolio — Badreddine EL KHAMLICHI

> A conversational portfolio powered by AI. Ask me anything about my background, skills, and projects — in French or English.

**Live demo → [chatbot-portfolio-eosin.vercel.app](https://chatbot-portfolio-eosin.vercel.app)**

---

## What is this?

This is my **AI-powered portfolio chatbot** — a digital twin of myself built with Next.js and Groq.
Instead of a classic static portfolio, visitors can have a real conversation and ask anything:

- My education and background
- My professional experience
- My technical skills and stack
- My projects
- My hobbies and interests
- How to reach me

The bot answers **in the same language as the user** (French or English), in first person, as if it were me.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| LLM | [Groq](https://groq.com) — Llama 3.3 70B Versatile |
| Styling | Tailwind CSS + inline React styles |
| Deployment | [Vercel](https://vercel.com) |
| Fonts | Geist (Vercel) |

---

## Architecture

```
User message
    │
    ▼
app/page.tsx          ← Chat UI (client component)
    │
    ▼
POST /api/chatbot     ← Next.js API Route (server)
    │
    ▼
Groq API              ← Llama 3.3 70B
(system prompt:       ← "You are Badreddine...")
    │
    ▼
botResponse           ← streamed back to UI
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/BadreddineEK/chatbot-portfolio.git
cd chatbot-portfolio
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com) (free tier: 6 000 req/day).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (Vercel)

1. Push to GitHub (already done)
2. Import the repo on [vercel.com](https://vercel.com)
3. Add the environment variable `GROQ_API_KEY` in **Settings → Environment Variables**
4. Deploy

---

## Features

- **Bilingual** — auto-detects French or English and replies accordingly
- **Contextual** — detailed system prompt covering education, work, skills, projects, hobbies
- **Fast** — Groq inference is near-instant (~200ms)
- **Typing indicator** — animated dots while the bot is thinking
- **Responsive** — works on mobile and desktop
- **Portfolio switcher** — quick links to classic and AI portfolio versions
- **Secure** — API key stays server-side, never exposed to the client

---

## Project Structure

```
chatbot-portfolio/
├── app/
│   ├── api/
│   │   └── chatbot/
│   │       └── route.ts      # API route — Groq call + system prompt
│   ├── globals.css
│   ├── layout.tsx            # Metadata
│   └── page.tsx              # Chat UI
├── public/
├── .env.local                # (not committed) GROQ_API_KEY
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Roadmap

- [ ] Conversation history / multi-turn memory
- [ ] Streaming responses (SSE)
- [ ] Suggested questions chips
- [ ] Rate limiting per IP
- [ ] Analytics on questions asked
- [ ] Fine-tune system prompt with more project details

---

## Author

**Badreddine EL KHAMLICHI**

- [Classic Portfolio](https://badreddineek.github.io/portfolioBadreddine/)
- [AI Portfolio](https://badreddineek.github.io/portfolio-ai/)
- [GitHub](https://github.com/BadreddineEK)
- LinkedIn: search **Badreddine EL KHAMLICHI**

---

*Built with Next.js and Groq — feel free to fork and adapt for your own portfolio.*
