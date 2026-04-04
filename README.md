# YouCode2026_Clover

## Backend Local Setup & Run Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (Recommended):**
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

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

5. **Test the API:**
   Open your browser and navigate to:
   * Health Check: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   * API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)