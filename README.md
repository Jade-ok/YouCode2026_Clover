# 🐾 CareHandoff

> **Voice-powered care handoff tool for animal shelters.** > Built at **YouCode 2026** by **Team Clover** 🍀 

<br>

## 💡 The Problem
Nonprofit organizations face high volunteer and staff turnover 
with limited resources for structured handoffs. 
When people leave, critical knowledge leaves with them — 
often undocumented.

CareHandoff turns voice into structured records. 
Speak for 30 seconds, and the system captures and organizes 
everything for the next person. No forms, no training.

Built for animal shelters where the problem is most urgent, 
but designed to scale across any nonprofit where people rotate 
and knowledge gets lost.

<br>

## 🚀 The Solution
**CareHandoff** is a seamless, voice-first dashboard. Volunteers simply speak their updates after checking on an animal. The app automatically transcribes the audio, extracts key alerts, and generates a structured care log. 

<br>

**Highly Accessible & Cost-Effective:** Volunteers can speak in their native languages, and the app unifies the output in English so the entire team shares a readable, common record. Thanks to our optimized AI pipeline, processing a complete check-in costs **less than 1 cent**.

<br>





## ✨ Features

* 🎙️ Voice-to-Insights: Multilingual voice input (Korean, Mandarin, Punjabi, etc.) with automatic English transcription for team-wide accessibility.
* 🧠 AI Task Extraction: Automatically pulls active alerts and pending tasks from the spoken update.
* 🔍 Interactive Transcript: Hover over any alert or task to instantly highlight the source phrase in the transcript.
* 🐾 Shelter Dashboard: A clean, centralized view to browse all animals, care histories, and to-do lists at a glance.


<br>

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI (Python)
- **AI:** OpenAI Whisper (Speech-to-Text) + GPT-4o-mini (Data Extraction)


<br>

---


<br>

## 💻 Getting Started

Follow these steps to run CareHandoff locally.
<br>
<br>

## Backend Local Setup & Run Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a `.env` file in the backend folder and add: `OPENAI_API_KEY=your_key_here`**



3. **Create and activate a virtual environment (Recommended):**
   * **Windows (Command Prompt / PowerShell):**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **Windows (Git Bash):**
     ```bash
     python -m venv venv
     source venv/Scripts/activate
     ```
   * **Mac/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

6. **Test the API:**
   Open your browser and navigate to:
   * Health Check: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   * API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
<br>

## Frontend Local Setup & Run Instructions

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
