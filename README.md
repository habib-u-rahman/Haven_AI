# HavenAI

> **AI-powered refuge for the displaced.**

HavenAI is an intelligent multi-agent platform that helps refugees and displaced people get immediate assistance — translating their situation, generating official documents, finding nearby support services, and providing emotional guidance — **all in their own language**.

Built solo in 10 hours for the **Hack-Nation Global AI Hackathon**.

## How it works

A person writes a message in *any* language, shares their location, and HavenAI's five specialized agents work together:

| # | Agent | Model | Role |
|---|-------|-------|------|
| 1 | **Language Agent** | Gemini Flash | Detects the user's language, translates to English, and translates the final answer back |
| 2 | **Situation Agent** | GPT-4o | Deeply understands the situation, identifies urgent needs (food, shelter, medical, legal, safety), assesses severity |
| 3 | **Document Agent** | GPT-4o | Generates a formal assistance letter (asylum / support / medical request) with fill-in placeholders |
| 4 | **Resource Agent** | Groq LLaMA 3.1 | Lists nearby UNHCR offices, food, shelter, legal aid and medical services for the user's location |
| 5 | **Support Agent** | Groq LLaMA 3.1 | Warm emotional support plus 3–5 clear, prioritized next steps in simple words |

If any single agent fails, the pipeline continues with a graceful fallback — the user always gets help.

## Tech stack

- **Backend:** Python, FastAPI, Uvicorn
- **LLMs:** Google Gemini Flash (translation), OpenAI GPT-4o (understanding + documents), Groq LLaMA 3.1 8B (fast responses)
- **Frontend:** Next.js + Tailwind CSS (in `frontend/`)
- **Deployment:** Render (backend) + Vercel (frontend)

## Running the backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # then paste your real API keys into .env

uvicorn main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

### Environment variables (`backend/.env`)

```
OPENAI_API_KEY=...
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

## API endpoints

### `GET /api/health`

Health check. Returns `{"status": "ok"}`.

### `POST /api/haven`

Runs the full 5-agent pipeline.

**Request body:**

```json
{
  "message": "أحتاج إلى مأوى وطعام لعائلتي، لقد وصلنا للتو",
  "location": "Berlin, Germany",
  "language": "auto",
  "need_document": true
}
```

**Response:**

```json
{
  "detected_language": "Arabic",
  "translated_input": "I need shelter and food for my family, we just arrived",
  "situation_summary": "...",
  "urgent_needs": ["shelter", "food"],
  "generated_document": "Formal assistance letter text...",
  "nearby_resources": [
    {"name": "UNHCR Germany", "type": "unhcr", "description": "...", "contact": "..."}
  ],
  "emotional_support": "...",
  "next_steps": ["Register at the nearest arrival center...", "..."],
  "final_response": "Full composed answer in English",
  "response_in_user_language": "الرد الكامل بلغة المستخدم"
}
```

## Deployment

- **Render:** point at `backend/`, build command `pip install -r requirements.txt`, start command from the `Procfile` (`uvicorn main:app --host 0.0.0.0 --port $PORT`). Add the three API keys as environment variables.
- **Vercel:** deploy `frontend/` and set the backend URL as an environment variable.

---

*HavenAI is an assistance tool, not a substitute for legal advice or emergency services. In immediate danger, always contact local emergency services first.*
