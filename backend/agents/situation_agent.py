"""Situation Agent — GPT-4o.

Deeply understands the refugee's situation, identifies urgent needs,
and assesses severity.
"""

import os

from dotenv import load_dotenv
from openai import OpenAI

from agents.utils import extract_json
from prompts.situation_prompt import SITUATION_PROMPT

load_dotenv(override=True)

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


def run_situation_agent(translated_message: str, location: str) -> dict:
    """Analyze the situation described in the (English) message.

    Returns: {"situation_summary": str, "urgent_needs": list[str], "severity": str}
    """
    print("[Situation Agent] Analyzing situation with GPT-4o...")

    client = _get_client()
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.3,
        messages=[
            {"role": "system", "content": SITUATION_PROMPT},
            {
                "role": "user",
                "content": f"Location: {location}\n\nMessage:\n{translated_message}",
            },
        ],
    )
    result = extract_json(response.choices[0].message.content)

    summary = result.get("situation_summary", "")
    needs = result.get("urgent_needs", [])
    severity = result.get("severity", "medium")
    print(f"[Situation Agent] Severity: {severity} | Urgent needs: {needs}")
    return {
        "situation_summary": summary,
        "urgent_needs": needs,
        "severity": severity,
    }
