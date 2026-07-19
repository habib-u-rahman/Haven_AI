"""Resource Agent — Groq LLaMA.

Finds nearby support services (UNHCR offices, food, shelter, legal aid,
medical assistance) based on the user's location and urgent needs.
"""

import os

from dotenv import load_dotenv
from groq import Groq

from agents.utils import extract_json
from prompts.resource_prompt import RESOURCE_PROMPT

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


def run_resource_agent(location: str, urgent_needs: list) -> list:
    """Find support services near the given location.

    Returns a list of dicts: {"name", "type", "description", "contact"}
    """
    print(f"[Resource Agent] Finding support services near {location}...")

    client = _get_client()
    needs_text = ", ".join(urgent_needs) if urgent_needs else "general assistance"
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.2,
        messages=[
            {"role": "system", "content": RESOURCE_PROMPT},
            {
                "role": "user",
                "content": f"Location: {location}\nUrgent needs: {needs_text}",
            },
        ],
    )
    result = extract_json(response.choices[0].message.content)

    resources = result.get("resources", [])
    # Keep only well-formed entries so the frontend never breaks on a bad dict.
    resources = [
        {
            "name": str(r.get("name", "Unknown organization")),
            "type": str(r.get("type", "general")),
            "description": str(r.get("description", "")),
            "contact": str(r.get("contact", "Search online for the nearest office")),
        }
        for r in resources
        if isinstance(r, dict)
    ]
    print(f"[Resource Agent] Found {len(resources)} resources.")
    return resources
