from fastapi import APIRouter, UploadFile, File
from services.stt_service import transcribe_audio
from services.llm_service import extract_data_with_ai

router = APIRouter(prefix="/api", tags=["analyze"])

@router.post("/analyze-audio")
async def analyze_audio(audio_file: UploadFile = File(...)):
    # BE-4: Receive audio file, process it, and return Draft data
    # 1. Convert Audio to Text (STT - BE-2)
    transcript = await transcribe_audio(audio_file.file)
    
    # 2. Extract Data using AI (LLM - BE-3)
    extracted_data = await extract_data_with_ai(transcript)
    
    return {
        "transcript": transcript,
        "extracted_data": extracted_data
    }