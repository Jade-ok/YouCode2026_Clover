"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mic,
  Square,
  Sparkles,
  Utensils,
  Droplets,
  Heart,
  Brain,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAnimals, analyzeAudio, saveCheckIn } from "@/lib/api"
import type { ExtractedData } from "@/lib/api"
import type { Animal } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RecordPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [extracted, setExtracted] = useState<ExtractedData | null>(null)
  const [showExtracted, setShowExtracted] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [saved, setSaved] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      if (data.length > 0) setSelectedAnimal(data[0])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleStartRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.start()
      setIsRecording(true)
      setTranscript("")
      setShowExtracted(false)
      setRecordingTime(0)
      setSaved(false)
      setExtracted(null)
    } catch {
      setError("Microphone access denied. Please allow microphone access.")
    }
  }

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current) return

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())

      setIsRecording(false)
      setIsAnalyzing(true)

      try {
        const result = await analyzeAudio(blob)
        setTranscript(result.transcript)
        setExtracted(result.extracted_data)
        setShowExtracted(true)
      } catch {
        setError("Failed to analyze audio. Make sure the backend is running.")
      } finally {
        setIsAnalyzing(false)
      }
    }

    mediaRecorderRef.current.stop()
  }

  const handleSave = async () => {
    if (selectedAnimal && extracted && transcript) {
      try {
        await saveCheckIn(selectedAnimal.id, transcript, extracted)
      } catch {
        console.error("Failed to save check-in")
      }
    }
    setSaved(true)
    setTimeout(() => {
      setTranscript("")
      setShowExtracted(false)
      setRecordingTime(0)
      setSaved(false)
      setExtracted(null)
    }, 2000)
  }

  const handleReset = () => {
    setTranscript("")
    setShowExtracted(false)
    setIsRecording(false)
    setRecordingTime(0)
    setSaved(false)
    setExtracted(null)
    setError(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Record Check-In</h1>
          <p className="mt-2 text-muted-foreground">
            Record a voice note and let AI extract the important details
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {saved ? (
          <Card className="border-success/30 bg-success/10">
            <CardContent className="flex flex-col items-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">Check-In Saved!</h2>
              <p className="mt-2 text-muted-foreground">
                The check-in for {selectedAnimal?.name} has been recorded.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Animal Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Animal</CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between" disabled={animals.length === 0}>
                      {selectedAnimal ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedAnimal.photoPlaceholder}</span>
                          <div className="text-left">
                            <div className="font-medium">{selectedAnimal.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Cage {selectedAnimal.cage} · {selectedAnimal.breed}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Loading animals...</span>
                      )}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    {animals.map((animal) => (
                      <DropdownMenuItem
                        key={animal.id}
                        onClick={() => setSelectedAnimal(animal)}
                        className="flex items-center gap-3 py-3"
                      >
                        <span className="text-xl">{animal.photoPlaceholder}</span>
                        <div>
                          <div className="font-medium">{animal.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Cage {animal.cage} · {animal.breed}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Recording */}
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={isAnalyzing}
                    className={cn(
                      "relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300",
                      isRecording
                        ? "bg-destructive text-destructive-foreground animate-pulse"
                        : isAnalyzing
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                    )}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-12 w-12 animate-spin" />
                    ) : isRecording ? (
                      <Square className="h-12 w-12" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                    {isRecording && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground shadow-lg">
                        {formatTime(recordingTime)}
                      </span>
                    )}
                  </button>
                  <p className="text-center text-muted-foreground">
                    {isAnalyzing
                      ? "Analyzing audio..."
                      : isRecording
                      ? "Recording... Click to stop"
                      : "Click to start recording your check-in"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            {transcript && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="min-h-[80px] text-sm leading-relaxed text-foreground">{transcript}</p>
                </CardContent>
              </Card>
            )}

            {/* Extracted Data */}
            {showExtracted && extracted && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Extracted Insights
                    <Badge variant="outline" className="ml-auto border-primary/30 bg-primary/10 text-primary">
                      Auto-extracted
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {extracted.feeding && (
                      <div className="flex items-start gap-2.5 rounded-lg bg-card p-3">
                        <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Feeding</div>
                          <div className="text-sm text-foreground">
                            Food: {extracted.feeding.food} · Water: {extracted.feeding.water}
                          </div>
                        </div>
                      </div>
                    )}
                    {extracted.health.length > 0 && (
                      <div className="flex items-start gap-2.5 rounded-lg bg-card p-3">
                        <Heart className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Health</div>
                          <div className="text-sm text-foreground">{extracted.health.join(", ")}</div>
                        </div>
                      </div>
                    )}
                    {extracted.behavior.length > 0 && (
                      <div className="flex items-start gap-2.5 rounded-lg bg-card p-3">
                        <Brain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Behavior</div>
                          <div className="text-sm text-foreground">{extracted.behavior.join(", ")}</div>
                        </div>
                      </div>
                    )}
                    {extracted.action_items.length > 0 && (
                      <div className="flex items-start gap-2.5 rounded-lg bg-card p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Action Items</div>
                          <div className="text-sm text-foreground">{extracted.action_items.join(", ")}</div>
                        </div>
                      </div>
                    )}
                    {extracted.medications.length > 0 && (
                      <div className="flex items-start gap-2.5 rounded-lg bg-card p-3">
                        <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Medications</div>
                          <div className="text-sm text-foreground">{extracted.medications.join(", ")}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {showExtracted && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Save Check-In
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
