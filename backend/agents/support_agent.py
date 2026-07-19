"""Support Agent — Groq LLaMA.

Provides warm emotional support and clear, simple next steps.
"""

import os

from dotenv import load_dotenv
from groq import Groq

from agents.utils import extract_json
from prompts.support_prompt import SUPPORT_PROMPT

load_dotenv(override=True)

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

_client = None


def _get_client() -> Groq:
    """Lazily create the Groq client so the app can boot without a key."""
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = Groq(api_key=api_key)
    return _client


def run_support_agent(situation_summary: str, urgent_needs: list) -> dict:
    """Generate emotional support and prioritized next steps.

    Returns: {"emotional_support": str, "next_steps": list[str]}
    """
    print("[Support Agent] Preparing emotional support and next steps...")

    client = _get_client()
    needs_text = ", ".join(urgent_needs) if urgent_needs else "general assistance"
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.6,
        messages=[
            {"role": "system", "content": SUPPORT_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Situation summary:\n{situation_summary}\n\n"
                    f"Urgent needs: {needs_text}"
                ),
            },
        ],
    )
    result = extract_json(response.choices[0].message.content)

    support = result.get("emotional_support", "")
    steps = [str(s) for s in result.get("next_steps", [])]
    print(f"[Support Agent] Generated {len(steps)} next steps.")
    return {"emotional_support": support, "next_steps": steps}
