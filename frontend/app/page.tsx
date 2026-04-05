"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AnimalCard } from "@/components/animal-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, X, Mic, Loader2 } from "lucide-react"
import { RecordModal } from "@/components/record-modal"
import Image from "next/image"
import { getAnimals } from "@/lib/api"
import type { Animal } from "@/lib/data"

export default function Dashboard() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectAnimalOpen, setSelectAnimalOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [recordModalOpen, setRecordModalOpen] = useState(false)

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

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal)
    setSelectAnimalOpen(false)
    setRecordModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-4 rounded-3xl px-8 py-10">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl">
            <div className="absolute -left-8 -top-8 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-300/20 blur-2xl" />
          </div>

          <div className="flex items-center justify-between gap-12 px-6">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Voice Handoff for Animal Shelters
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl leading-[1.2]">
                Hi, Sarah!<br />
                <span className="text-primary">Speak</span> your care notes.
              </h1>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Voice → AI summary
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Alerts & to-dos auto-extracted
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Full care history per animal
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center">
              <button
                onClick={() => setSelectAnimalOpen(true)}
                className="group relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/40 active:scale-95"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 animate-ping opacity-30" />
                <span className="absolute -inset-3 rounded-full bg-green-500/20 animate-ping opacity-20 [animation-delay:0.3s]" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 opacity-50 blur-sm" />
                <div className="relative flex flex-col items-center gap-2 text-white">
                  <Mic className="h-12 w-12" />
                  <span className="text-sm font-semibold">Record</span>
                </div>
              </button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Tap to record your care log
              </p>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div className="mb-4 flex justify-center">
          <div className="relative w-full max-w-lg">
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
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-3 text-sm text-muted-foreground text-center">
              Showing {filteredAnimals.length} of {animals.length} animals
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Select Animal Modal */}
      <Dialog open={selectAnimalOpen} onOpenChange={setSelectAnimalOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select an animal to log care notes for</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2 max-h-[60vh] overflow-y-auto py-4">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => handleSelectAnimal(animal)}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30"
              >
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-border flex items-center justify-center bg-muted text-2xl shrink-0">
                  {animal.photoUrl ? (
                    <Image
                      src={animal.photoUrl}
                      alt={animal.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    animal.photoPlaceholder
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-foreground">{animal.name}</p>
                    <p className="text-xs text-muted-foreground">{animal.estimatedAge}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {animal.breed} &middot; Location {animal.cage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedAnimal && (
        <RecordModal
          open={recordModalOpen}
          onOpenChange={setRecordModalOpen}
          animalId={selectedAnimal.id}
          animalName={selectedAnimal.name}
          animalAge={selectedAnimal.estimatedAge}
          animalBreed={selectedAnimal.breed}
          animalCage={selectedAnimal.cage}
        />
      )}
    </div>
  )
}
