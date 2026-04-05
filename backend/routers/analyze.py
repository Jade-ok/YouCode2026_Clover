from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.stt_service import transcribe_audio
from services.llm_service import extract_data_with_ai

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze-audio")
async def analyze_audio(audio_file: UploadFile = File(...)):
    try:
        stt_result = await transcribe_audio(audio_file)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        extracted_data = await extract_data_with_ai(stt_result["transcript"])
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "transcript": stt_result["transcript"],
        "language": stt_result["language"],
        "extracted_data": extracted_data,
    }
