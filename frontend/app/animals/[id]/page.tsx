"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { RecordModal } from "@/components/record-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mic,
  AlertTriangle,
  Sparkles,
  Clock,
  User,
  CheckCircle2,
  Circle,
  ListTodo,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { getAnimal } from "@/lib/api"
import type { AnimalDetail, TemporaryEntry } from "@/lib/api"
import { cn } from "@/lib/utils"

function formatTimestamp(ts: string): { date: string; time: string } {
  const d = new Date(ts)
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  }
}

export default function AnimalCasePage() {
  const params = useParams()
  const animalId = params.id as string

  const [animal, setAnimal] = useState<AnimalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)
  const [recordModalOpen, setRecordModalOpen] = useState(false)

  // Local state for newly saved check-ins this session
  const [newEntries, setNewEntries] = useState<TemporaryEntry[]>([])
  const [tasks, setTasks] = useState<{ id: string; task: string; completed: boolean }[]>([])

  useEffect(() => {
    getAnimal(animalId)
      .then((data) => {
        setAnimal(data)
        // Seed tasks from the most recent entry's action_items
        const latest = data.temporaryData[0]
        if (latest) {
          setTasks(
            latest.extracted_data.action_items.map((item, i) => ({
              id: `task-${i}`,
              task: item,
              completed: false,
            }))
          )
        }
      })
      .catch(() => setNotFoundError(true))
      .finally(() => setLoading(false))
  }, [animalId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (notFoundError || !animal) {
    notFound()
  }

  // Alerts: permanent cautions + latest health observations
  const latest = [...newEntries, ...(animal!.temporaryData ?? [])][0]
  const alerts = [
    ...(animal!.status ?? []),
    ...(latest?.extracted_data.health ?? []),
    ...(latest?.extracted_data.cautions ?? []),
  ]

  const allEntries = [...newEntries, ...(animal!.temporaryData ?? [])]

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0
    return a.completed ? 1 : -1
  })

  const handleSaveCheckIn = (data: { transcript: string; alerts: string[]; tasks: string[] }, rawEntry?: TemporaryEntry) => {
    if (rawEntry) {
      setNewEntries((prev) => [rawEntry, ...prev])
      setTasks((prev) => [
        ...data.tasks.map((task, i) => ({ id: `new-${Date.now()}-${i}`, task, completed: false })),
        ...prev,
      ])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Animal Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-5xl">
              {animal!.photoPlaceholder}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{animal!.name}</h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {animal!.breed} · {animal!.sex} · {animal!.estimatedAge}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Cage {animal!.cage}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {animal!.daysInShelter} days in shelter
                </span>
              </div>
              {animal!.chronicConditions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {animal!.chronicConditions.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {newEntries.length > 0 && (
              <Button
                onClick={() => {
                  setNewEntries([])
                  setTasks([])
                }}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            )}
            <Button
              onClick={() => setRecordModalOpen(true)}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <Mic className="h-5 w-5" />
              Record Check-In
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Handoff Summary */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Today&apos;s Handoff Summary
                <Badge variant="outline" className="ml-auto border-primary/30 bg-primary/10 text-primary">
                  AI Summary
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Alerts */}
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Active Alerts
                  </div>
                  {alerts.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {alerts.map((alert, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No active alerts.</p>
                  )}
                </div>

                {/* Tasks */}
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <ListTodo className="h-5 w-5 text-primary" />
                    To-Do List
                  </div>
                  {sortedTasks.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {sortedTasks.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => toggleTask(item.id)}
                          className={cn(
                            "flex cursor-pointer items-start gap-2 text-sm rounded-md px-1 py-0.5 -mx-1 transition-colors hover:bg-muted/50",
                            item.completed ? "text-muted-foreground/60" : "text-muted-foreground"
                          )}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          )}
                          <span className={cn(item.completed && "line-through")}>{item.task}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No pending tasks.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check-In Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Check-In Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No check-ins recorded yet.</p>
              ) : (
                <div className="relative">
                  <div
                    className="absolute left-[15px] top-4 w-0.5 bg-border"
                    style={{ height: "calc(100% - 2rem)" }}
                  />
                  <div className="space-y-6">
                    {allEntries.map((entry, idx) => {
                      const { date, time } = formatTimestamp(entry.timestamp)
                      const isNew = newEntries.some((e) => e.entry_id === entry.entry_id)
                      return (
                        <div key={entry.entry_id} className="relative">
                          <div className="flex gap-4">
                            <div
                              className={cn(
                                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                isNew
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Mic className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-medium text-foreground">{date}</span>
                                <span className="text-muted-foreground">at {time}</span>
                                {isNew && (
                                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                                    New
                                  </Badge>
                                )}
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  {entry.recorded_by}
                                </span>
                              </div>
                              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                                <p className="text-sm leading-relaxed text-foreground">
                                  &quot;{entry.transcript}&quot;
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <RecordModal
        open={recordModalOpen}
        onOpenChange={setRecordModalOpen}
        animalId={animalId}
        animalName={animal!.name}
        animalCage={animal!.cage}
        onSave={handleSaveCheckIn}
      />
    </div>
  )
}
