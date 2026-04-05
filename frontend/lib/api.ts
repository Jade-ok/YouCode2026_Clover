import type { Animal } from "./data"

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

function speciesEmoji(species: string): string {
  switch (species.toLowerCase()) {
    case "dog": return "🐕"
    case "cat": return "🐱"
    case "rabbit": return "🐰"
    case "bird": return "🐦"
    default: return "🐾"
  }
}

function parseCage(location: string): string {
  const match = location.match(/([A-Za-z]-\d+|\d+)/i)
  return match ? match[0].toUpperCase() : location
}

function calcDaysInShelter(intakeDate: string): number {
  const intake = new Date(intakeDate)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - intake.getTime()) / (1000 * 60 * 60 * 24)))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAnimal(raw: any): Animal {
  const photo: string | null = raw.profile?.photo ?? null
  return {
    id: raw.id,
    name: raw.profile.name,
    cage: parseCage(raw.profile.cage_location),
    species: raw.profile.species,
    breed: raw.profile.breed,
    sex: raw.profile.gender,
    estimatedAge: raw.profile.age,
    intakeDate: raw.permanent_data.intake_date,
    daysInShelter: calcDaysInShelter(raw.permanent_data.intake_date),
    status: raw.permanent_data.cautions ?? [],
    recentSummary:
      (raw.permanent_data.cautions ?? []).join(". ") || "No current concerns.",
    photoPlaceholder: speciesEmoji(raw.profile.species),
    photoUrl: photo ? `${API_BASE}${photo}` : "",
  }
}

export async function getAnimals(): Promise<Animal[]> {
  const res = await fetch(`${API_BASE}/api/animals`)
  if (!res.ok) throw new Error("Failed to fetch animals")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await res.json()
  return data.map(mapAnimal)
}

export interface ExtractedData {
  active_alerts: string[]
  action_items: string[]
}

export interface HistoryEntry {
  entry_id: string
  timestamp: string
  recorded_by: string
  transcript: string
}

export interface TodoEntry {
  id: string
  task: string
  is_completed: boolean
}

export interface AnimalDetail extends Animal {
  chronicConditions: string[]
  history: HistoryEntry[]
  todos: TodoEntry[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAnimalDetail(raw: any): AnimalDetail {
  return {
    ...mapAnimal(raw),
    chronicConditions: raw.permanent_data.chronic_conditions ?? [],
    history: raw.history ?? [],
    todos: raw.todos ?? [],
  }
}

export async function getAnimal(id: string): Promise<AnimalDetail> {
  const res = await fetch(`${API_BASE}/api/animals/${id}`)
  if (!res.ok) throw new Error("Animal not found")
  const data = await res.json()
  return mapAnimalDetail(data)
}

export interface AnalyzeResult {
  transcript: string
  language: string
  extracted_data: ExtractedData
}

export async function analyzeAudio(blob: Blob): Promise<AnalyzeResult> {
  const form = new FormData()
  form.append("audio_file", blob, "recording.webm")
  const res = await fetch(`${API_BASE}/api/analyze-audio`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) throw new Error("Audio analysis failed")
  return res.json()
}

export async function analyzeText(transcript: string): Promise<AnalyzeResult> {
  const res = await fetch(`${API_BASE}/api/analyze-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  })
  if (!res.ok) throw new Error("Text analysis failed")
  return res.json()
}

export async function saveCheckIn(
  animalId: string,
  transcript: string,
  extractedData: ExtractedData,
  recordedBy = "Volunteer Elly"
): Promise<void> {
  const payload = {
    entry_id: `entry-${Date.now()}`,
    timestamp: new Date().toISOString(),
    recorded_by: recordedBy,
    transcript,
    extracted_data: extractedData,
  }
  const res = await fetch(`${API_BASE}/api/animals/${animalId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to save check-in")
}
