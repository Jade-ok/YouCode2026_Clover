from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.stt_service import transcribe_audio
from services.llm_service import extract_data_with_ai

router = APIRouter(prefix="/api", tags=["analyze"])


class TextAnalyzeRequest(BaseModel):
    transcript: str


@router.post("/transcribe")
async def transcribe(audio_file: UploadFile = File(...)):
    try:
        result = await transcribe_audio(audio_file)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-audio")
async def analyze_audio(audio_file: UploadFile = File(...)):
    # BE-4: Receive audio file, process it, and return Draft data
    # 1. Convert Audio to Text (STT - BE-2)
    try:
        stt_result = await transcribe_audio(audio_file)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 2. Extract Data using AI (LLM - BE-3)
    extracted_data = await extract_data_with_ai(stt_result["transcript"])

    return {
        "transcript": stt_result["transcript"],
        "language": stt_result["language"],
        "extracted_data": extracted_data
    }


@router.post("/analyze-text")
async def analyze_text(body: TextAnalyzeRequest):
    extracted_data = await extract_data_with_ai(body.transcript)
    return {
        "transcript": body.transcript,
        "language": "unknown",
        "extracted_data": extracted_data
    }