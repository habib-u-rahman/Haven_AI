"""Shared helpers for HavenAI agents."""

import json
import re


def extract_json(text: str) -> dict:
    """Parse a JSON object out of an LLM response.

    Models sometimes wrap JSON in ```json fences or add prose around it,
    so strip fences first and fall back to grabbing the outermost {...} block.
    Raises ValueError if no JSON object can be recovered.
    """
    if not text:
        raise ValueError("Empty response from model")

    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group(0))

    raise ValueError(f"Could not parse JSON from model response: {text[:200]}")
