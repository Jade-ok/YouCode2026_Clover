"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, Sparkles, AlertTriangle, CheckCircle2, ListTodo, Pencil, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { analyzeAudio, analyzeText, saveCheckIn } from "@/lib/api"
import type { ExtractedData } from "@/lib/api"

interface RecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  animalId?: string
  animalName?: string
  animalAge?: string
  animalBreed?: string
  animalCage?: string
  onSave?: (data: { transcript: string; alerts: string[]; tasks: string[] }, rawEntry?: any) => void
}

interface ExtractedItem {
  text: string
}

function mapExtractedData(data: ExtractedData): { alerts: ExtractedItem[]; tasks: ExtractedItem[] } {
  return {
    alerts: (data.active_alerts ?? []).map((t) => ({ text: t })),
    tasks: (data.action_items ?? []).map((t) => ({ text: t })),
  }
}

type Phase = "record" | "summary"

export function RecordModal({
  open,
  onOpenChange,
  animalId,
  animalName = "Animal",
  animalAge = "",
  animalBreed = "",
  animalCage = "",
  onSave,
}: RecordModalProps) {
  const [phase, setPhase] = useState<Phase>("record")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [lastSavedTranscript, setLastSavedTranscript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [extractedData, setExtractedData] = useState<{ alerts: ExtractedItem[]; tasks: ExtractedItem[] }>({ alerts: [], tasks: [] })
  const [rawExtracted, setRawExtracted] = useState<ExtractedData | null>(null)
  const [micError, setMicError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const transcriptModified = transcript !== lastSavedTranscript && lastSavedTranscript !== ""

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleStartRecording = async () => {
    setMicError(null)
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
      setPhase("record")
      setLastSavedTranscript("")
      setRecordingTime(0)
      setExtractedData({ alerts: [], tasks: [] })
      setRawExtracted(null)
    } catch {
      setMicError("Microphone access denied. Please allow microphone access and try again.")
    }
  }

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current) return

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())

      setIsRecording(false)
      setIsGenerating(true)
      setPhase("summary")

      try {
        const result = await analyzeAudio(blob)
        setTranscript(result.transcript)
        setLastSavedTranscript(result.transcript)
        setRawExtracted(result.extracted_data)
        setExtractedData(mapExtractedData(result.extracted_data))
      } catch {
        setTranscript("")
        setMicError("Failed to analyze audio. Check that the backend is running.")
      } finally {
        setIsGenerating(false)
      }
    }

    mediaRecorderRef.current.stop()
  }

  const handleGenerateSummary = async (textOverride?: string) => {
    const text = textOverride ?? transcript
    if (!text.trim()) return

    setMicError(null)
    setIsGenerating(true)
    setIsEditing(false)
    setPhase("summary")

    try {
      const result = await analyzeText(text)
      setRawExtracted(result.extracted_data)
      setExtractedData(mapExtractedData(result.extracted_data))
      setLastSavedTranscript(text)
    } catch {
      setMicError("Failed to analyze text. Check that the backend is running.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (animalId && rawExtracted) {
      try {
        await saveCheckIn(animalId, transcript, rawExtracted)
        // Refresh the page automatically after successfully saving
        window.location.reload()
      } catch {
        console.error("Failed to persist check-in to backend")
      }
    }

    const rawEntry =
      animalId && rawExtracted
        ? {
            entry_id: `entry-${Date.now()}`,
            animal_id: animalId,
            timestamp: new Date().toISOString(),
            recorded_by: "Volunteer",
            transcript,
            extracted_data: rawExtracted,
          }
        : undefined

    if (onSave) {
      onSave(
        {
          transcript,
          alerts: extractedData.alerts.map((a) => a.text),
          tasks: extractedData.tasks.map((t) => t.text),
        },
        rawEntry
      )
    }

    onOpenChange(false)
    resetState()
  }

  const handleClose = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
    }
    onOpenChange(false)
    resetState()
  }

  const resetState = () => {
    setTranscript("")
    setPhase("record")
    setIsRecording(false)
    setRecordingTime(0)
    setLastSavedTranscript("")
    setIsEditing(false)
    setIsGenerating(false)
    setExtractedData({ alerts: [], tasks: [] })
    setRawExtracted(null)
    setMicError(null)
    audioChunksRef.current = []
    mediaRecorderRef.current = null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto transition-all duration-300",
          phase === "summary" && !isGenerating ? "!max-w-7xl !w-[95vw]" : "!max-w-lg"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="text-xl font-bold">
              Record Care Log for{" "}
              <span className="text-primary">{animalName}</span>
              {animalAge && <span className="ml-1.5 text-base font-normal text-muted-foreground">{animalAge}</span>}
            </div>
            {(animalBreed || animalCage) && (
              <div className="mt-0.5 text-sm font-normal text-muted-foreground">
                {[animalBreed, animalCage ? `Location ${animalCage}` : ""].filter(Boolean).join(" · ")}
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Record a voice check-in for {animalName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error message */}
          {micError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {micError}
            </div>
          )}

          {/* Phase 1: Recording */}
          {phase === "record" && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={cn(
                  "relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300",
                  isRecording
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                )}
              >
                {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                {isRecording && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                    {formatTime(recordingTime)}
                  </span>
                )}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>

              {isRecording && (
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                      Transcript
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                        <span className="text-xs font-normal text-muted-foreground">Live</span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="min-h-[60px] text-sm text-muted-foreground italic">
                      Listening... transcript will appear after you stop.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Phase 2: Summary */}
          {phase === "summary" && (
            <>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Generating AI Summary...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transcript */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Mic className="h-4 w-4 text-muted-foreground" />
                          Transcript
                          {!isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto gap-1.5 text-xs"
                              onClick={() => {
                                setIsEditing(true)
                                setTimeout(() => textareaRef.current?.focus(), 0)
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            ref={textareaRef}
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            className="min-h-[150px] resize-none text-sm leading-relaxed"
                          />
                        ) : (
                          <p className="min-h-[150px] text-sm leading-relaxed text-foreground">
                            {transcript || <span className="text-muted-foreground italic">No transcript available.</span>}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* AI Summary */}
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Sparkles className="h-4 w-4 text-primary" />
                          AI Summary
                          <Badge variant="outline" className="ml-auto border-primary/30 bg-primary/10 text-primary text-xs">
                            Auto-extracted
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg bg-card p-3">
                          <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Active Alerts
                          </div>
                          <ul className="mt-2 space-y-2">
                            {extractedData.alerts.length > 0 ? (
                              extractedData.alerts.map((alert, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                                  {alert.text}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-muted-foreground italic">No alerts detected.</li>
                            )}
                          </ul>
                        </div>

                        <div className="rounded-lg bg-card p-3">
                          <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                            <ListTodo className="h-4 w-4 text-primary" />
                            Pending Tasks
                          </div>
                          <ul className="mt-2 space-y-2">
                            {extractedData.tasks.length > 0 ? (
                              extractedData.tasks.map((task, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  {task.text}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-muted-foreground italic">No tasks detected.</li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Regenerate if transcript edited */}
                  {transcriptModified && (
                    <Button
                      onClick={() => handleGenerateSummary()}
                      disabled={isGenerating || !transcript.trim()}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      Regenerate AI Summary
                    </Button>
                  )}

                  {!transcriptModified && (
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Save Care Log
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
