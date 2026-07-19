"""Document Agent — GPT-4o.

Generates a formal assistance letter (asylum / support / medical request)
the person can present to authorities and aid organizations.
"""

import os
from datetime import date

from dotenv import load_dotenv
from openai import OpenAI

from prompts.document_prompt import DOCUMENT_PROMPT

load_dotenv()

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

_client = None


def _get_client() -> OpenAI:
    """Lazily create the OpenAI client so the app can boot without a key."""
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        _client = OpenAI(api_key=api_key)
    return _client


def run_document_agent(situation_summary: str, location: str) -> str:
    """Generate a formal assistance letter based on the situation.

    Returns the full letter text.
    """
    print("[Document Agent] Generating official assistance letter...")

    client = _get_client()
    today = date.today().strftime("%B %d, %Y")
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.4,
        messages=[
            {"role": "system", "content": DOCUMENT_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Today's date: {today}\n"
                    f"Location: {location}\n\n"
                    f"Situation summary:\n{situation_summary}"
                ),
            },
        ],
    )
    document = response.choices[0].message.content.strip()
    print("[Document Agent] Letter generated.")
    return document
