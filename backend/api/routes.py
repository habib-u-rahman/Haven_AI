"""HavenAI API routes — orchestrates the 5-agent pipeline."""

import asyncio

from fastapi import APIRouter

from agents.language_agent import run_language_agent, translate_back
from agents.situation_agent import run_situation_agent
from agents.document_agent import run_document_agent
from agents.resource_agent import run_resource_agent
from agents.support_agent import run_support_agent
from models.schemas import HavenRequest, HavenResponse

router = APIRouter(prefix="/api", tags=["haven"])

FALLBACK_RESOURCES = [
    {
        "name": "UNHCR — UN Refugee Agency",
        "type": "unhcr",
        "description": "Registers refugees and coordinates protection, shelter and aid.",
        "phone": "",
        "location": "Offices in most countries",
        "website": "help.unhcr.org",
        "contact": "Visit help.unhcr.org and select your country.",
    },
    {
        "name": "Red Cross / Red Crescent",
        "type": "general",
        "description": "Emergency food, medical aid and family reunification services.",
        "phone": "",
        "location": "National societies worldwide",
        "website": "ifrc.org",
        "contact": "Search for the national Red Cross or Red Crescent society in your country.",
    },
]


@router.get("/health")
def health():
    """Simple health check for deployment monitoring."""
    return {"status": "ok"}


@router.post("/haven", response_model=HavenResponse)
async def haven(request: HavenRequest):
    """Run the full HavenAI multi-agent pipeline.

    Stages 1-2 are sequential (each depends on the previous); the Document,
    Resource, and Support agents only need the situation analysis, so they
    run in PARALLEL to cut response time. Every agent call is wrapped in
    try/except so a single failure never breaks the pipeline.
    """
    print("\n========== HavenAI pipeline started ==========")

    # ---- 1. Language Agent: detect language + translate to English ----
    try:
        lang_result = await asyncio.to_thread(
            run_language_agent, request.message, request.location
        )
        detected_language = lang_result["detected_language"]
        translated_input = lang_result["translated_text"]
    except Exception as e:
        print(f"[Language Agent] FAILED: {e} — using original message as English.")
        detected_language = request.language if request.language != "auto" else "English"
        translated_input = request.message

    # ---- 2. Situation Agent: understand needs and severity ----
    try:
        situation = await asyncio.to_thread(
            run_situation_agent, translated_input, request.location
        )
        situation_summary = situation["situation_summary"]
        urgent_needs = situation["urgent_needs"]
        severity = situation["severity"]
    except Exception as e:
        print(f"[Situation Agent] FAILED: {e} — using generic assessment.")
        situation_summary = (
            "A displaced person is requesting assistance. "
            "Their full situation could not be automatically analyzed."
        )
        urgent_needs = ["shelter", "food", "legal"]
        severity = "medium"

    # ---- 3/4/5. Document + Resource + Support agents run in parallel ----
    async def _document():
        if not request.need_document:
            return None
        try:
            return await asyncio.to_thread(
                run_document_agent, situation_summary, request.location
            )
        except Exception as e:
            print(f"[Document Agent] FAILED: {e} — continuing without document.")
            return (
                "We could not generate your document automatically right now. "
                "Please try again, or ask a UNHCR office or legal aid organization "
                "to help you write a request letter."
            )

    async def _resources():
        try:
            return await asyncio.to_thread(
                run_resource_agent, request.location, urgent_needs
            )
        except Exception as e:
            print(f"[Resource Agent] FAILED: {e} — using universal fallback resources.")
            return FALLBACK_RESOURCES

    async def _support():
        try:
            return await asyncio.to_thread(
                run_support_agent, situation_summary, urgent_needs
            )
        except Exception as e:
            print(f"[Support Agent] FAILED: {e} — using fallback message.")
            return {
                "emotional_support": (
                    "You have been through a lot, and reaching out for help was the "
                    "right step. You are not alone — organizations exist whose only "
                    "job is to protect and support people in your situation."
                ),
                "next_steps": [
                    "Contact the nearest UNHCR office to register for assistance.",
                    "If you are in immediate danger, call the local emergency number.",
                    "Keep any identity documents you have in a safe place.",
                ],
            }

    generated_document, nearby_resources, support = await asyncio.gather(
        _document(), _resources(), _support()
    )
    emotional_support = support["emotional_support"]
    next_steps = support["next_steps"]

    # ---- Compose a COMPACT final response (keeps translate-back fast).
    # Full resource details are rendered as cards by the frontend, so the
    # translated text only names the organizations. ----
    steps_text = "\n".join(f"{i}. {step}" for i, step in enumerate(next_steps, 1))
    resource_names = ", ".join(r["name"] for r in nearby_resources[:5])
    final_response = (
        f"{emotional_support}\n\n"
        f"What we understood:\n{situation_summary}\n\n"
        f"Your next steps:\n{steps_text}\n\n"
        f"Organizations that can help you: {resource_names}. "
        "Their full contact details are shown on this page."
    )

    # ---- 6. Language Agent again: translate response back to the user ----
    try:
        response_in_user_language = await asyncio.to_thread(
            translate_back, final_response, detected_language
        )
    except Exception as e:
        print(f"[Language Agent] Translate-back FAILED: {e} — returning English.")
        response_in_user_language = final_response

    print("========== HavenAI pipeline finished ==========\n")

    return HavenResponse(
        detected_language=detected_language,
        translated_input=translated_input,
        situation_summary=situation_summary,
        urgent_needs=urgent_needs,
        severity=severity,
        generated_document=generated_document,
        nearby_resources=nearby_resources,
        emotional_support=emotional_support,
        next_steps=next_steps,
        final_response=final_response,
        response_in_user_language=response_in_user_language,
    )
