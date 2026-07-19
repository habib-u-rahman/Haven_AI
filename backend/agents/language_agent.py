"""Language Agent — Gemini Flash.

Detects the language of the user's message, translates it to English for the
rest of the pipeline, and translates the final response back to the user's
own language at the end.
"""

import os

import google.generativeai as genai
from dotenv import load_dotenv

from agents.utils import extract_json
from prompts.language_prompt import LANGUAGE_PROMPT, TRANSLATE_BACK_PROMPT

load_dotenv()

# gemini-1.5-flash has been retired by Google; gemini-2.0-flash is the free-tier
# successor. Override with GEMINI_MODEL in .env if needed.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

_configured = False


def _get_model(system_prompt: str):
    """Lazily configure the Gemini client so the app can boot without a key."""
    global _configured
    if not _configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set")
        genai.configure(api_key=api_key)
        _configured = True
    return genai.GenerativeModel(GEMINI_MODEL, system_instruction=system_prompt)


def run_language_agent(message: str, location: str) -> dict:
    """Detect the message language and translate it to English.

    Returns: {"detected_language": str, "translated_text": str}
    """
    print("[Language Agent] Detecting language and translating to English...")

    model = _get_model(LANGUAGE_PROMPT)
    response = model.generate_content(
        f"User location: {location}\nUser message:\n{message}"
    )
    result = extract_json(response.text)

    detected = result.get("detected_language", "English")
    translated = result.get("translated_text", message)
    print(f"[Language Agent] Detected language: {detected}")
    return {"detected_language": detected, "translated_text": translated}


def translate_back(text: str, target_language: str) -> str:
    """Translate the final English response into the user's own language."""
    if target_language.strip().lower() in ("english", "en", ""):
        return text

    print(f"[Language Agent] Translating final response to {target_language}...")
    model = _get_model(TRANSLATE_BACK_PROMPT)
    response = model.generate_content(
        f"Target language: {target_language}\n\nText to translate:\n{text}"
    )
    return response.text.strip()
