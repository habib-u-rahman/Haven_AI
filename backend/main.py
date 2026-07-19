"""HavenAI — AI-powered refuge for the displaced.

FastAPI entry point. Run locally with:
    uvicorn main:app --reload --port 8000
"""

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from api.routes import router  # noqa: E402  (needs env loaded first)

app = FastAPI(
    title="HavenAI",
    description="Intelligent multi-agent platform helping refugees and displaced "
    "people get immediate assistance in their own language.",
    version="1.0.0",
)

# Allow the Next.js frontend (and hackathon demos) to call from anywhere.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    """Welcome endpoint."""
    return {
        "app": "HavenAI",
        "tagline": "AI-powered refuge for the displaced",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
