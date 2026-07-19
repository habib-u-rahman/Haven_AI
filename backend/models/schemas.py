"""Pydantic models for HavenAI request/response contracts."""

from typing import List, Optional

from pydantic import BaseModel, Field


class HavenRequest(BaseModel):
    """Incoming request from a refugee or displaced person."""

    message: str = Field(..., description="The refugee's message, in any language")
    location: str = Field(..., description="Their current location (city / country)")
    language: str = Field(default="auto", description="Language code, or 'auto' to detect")
    need_document: bool = Field(default=False, description="Generate an official assistance letter")


class HavenResponse(BaseModel):
    """Full pipeline output returned to the frontend."""

    detected_language: str
    translated_input: str
    situation_summary: str
    urgent_needs: List[str]
    generated_document: Optional[str] = None
    nearby_resources: List[dict]
    emotional_support: str
    next_steps: List[str]
    final_response: str
    response_in_user_language: str
