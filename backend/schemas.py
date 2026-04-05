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


class TemporaryDataEntry(BaseModel):
    entry_id: str
    animal_id: str
    timestamp: str
    recorded_by: str
    transcript: str
    extracted_data: ExtractedData


class AnimalProfile(BaseModel):
    name: str
    species: str
    breed: str
    gender: str
    age: str
    cage_location: str
    photo: Optional[str] = None


class PermanentData(BaseModel):
    intake_date: str
    chronic_conditions: List[str] = []
    cautions: List[str] = []


class Animal(BaseModel):
    id: str
    profile: AnimalProfile
    permanent_data: PermanentData


class AnimalListResponse(BaseModel):
    id: str
    profile: AnimalProfile


class TimelineEntry(BaseModel):
    entry_id: str
    animal_id: str
    timestamp: str
    recorded_by: str
    transcript: str
    extracted_data: ExtractedData


class ConfirmRequest(BaseModel):
    entry_id: str
    transcript: Optional[str] = None
    extracted_data: Optional[ExtractedData] = None


class AnimalDetailResponse(Animal):
    temporary_data: List[TemporaryDataEntry] = []
    timeline: List[TimelineEntry] = []
