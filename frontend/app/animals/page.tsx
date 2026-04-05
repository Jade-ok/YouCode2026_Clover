"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AnimalCard } from "@/components/animal-card"
import { RecordModal } from "@/components/record-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mic, X, LayoutGrid, List, Loader2 } from "lucide-react"
import { getAnimals } from "@/lib/api"
import type { Animal } from "@/lib/data"

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    getAnimals()
      .then(setAnimals)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredAnimals = animals.filter(animal => {
    const q = searchQuery.toLowerCase()
    return (
      animal.name.toLowerCase().includes(q) ||
      animal.cage.toLowerCase().includes(q) ||
      animal.breed.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Animal Cases</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage all animal cases in your shelter
            </p>
          </div>
          <Button
            onClick={() => setRecordModalOpen(true)}
            size="lg"
            className="gap-2 shadow-lg shadow-primary/20"
          >
            <Mic className="h-5 w-5" />
            Record Check-In
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, cage, or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredAnimals.length} of {animals.length} animals
            </div>

            <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
              {filteredAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>

            {filteredAnimals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No animals found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <RecordModal open={recordModalOpen} onOpenChange={setRecordModalOpen} />
    </div>
  )
}
