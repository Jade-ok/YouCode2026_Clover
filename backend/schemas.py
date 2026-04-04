# Pydantic models for data validation (Frontend <-> Backend <-> AI)
from pydantic import BaseModel
from typing import List, Optional


class FeedingData(BaseModel):
    food: str
    water: str


class ExtractedData(BaseModel):
    health: List[str] = []
    behavior: List[str] = []
    feeding: Optional[FeedingData] = None
    medications: List[str] = []
    action_items: List[str] = []
    cautions: List[str] = []


class TimelineEntry(BaseModel):
    entry_id: str
    timestamp: str
    recorded_by: str
    transcript: str
    extracted_data: ExtractedData


class Animal(BaseModel):
    id: str
    name: str
    species: str
    breed: str
    sex: str
    estimated_age: str
    status: str
    intake_date: str
    rescue_location: str
    photo: Optional[str] = None
    current_summary: str
    active_cautions: List[str] = []
    active_action_items: List[str] = []
    timeline: List[TimelineEntry] = []
