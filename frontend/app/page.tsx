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
        <div className="mb-16 pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-xl">
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Hi, Sarah!
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Record your check-ins with voice. <br />Never lose critical care info between shifts again.
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end">
              <button
                onClick={() => setSelectAnimalOpen(true)}
                className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 sm:h-40 sm:w-40"
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 opacity-50 blur-sm" />
                <div className="relative flex flex-col items-center gap-2 text-white">
                  <Mic className="h-10 w-10 sm:h-12 sm:w-12" />
                  <span className="text-sm font-semibold sm:text-base">Record</span>
                </div>
              </button>
              <p className="mt-4 text-center text-sm text-muted-foreground lg:text-right">
                Tap to start a check-in
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
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
            <div className="mb-4 text-sm text-muted-foreground text-center">
              Showing {filteredAnimals.length} of {animals.length} animals
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
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
            <DialogTitle>Select an animal to check in</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2 max-h-[60vh] overflow-y-auto py-4">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => handleSelectAnimal(animal)}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-accent"
              >
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-border flex items-center justify-center bg-muted text-2xl">
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
                  <p className="font-semibold text-foreground">{animal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {animal.species} &middot; Cage {animal.cage}
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
          animalCage={selectedAnimal.cage}
        />
      )}
    </div>
  )
}
