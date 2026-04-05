"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import type { Animal } from "@/lib/data"

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link 
      href={`/animals/${animal.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="p-4">
              {/* Photo */}
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-border flex items-center justify-center bg-muted">
                {animal.photoUrl ? (
                  <Image
                    src={animal.photoUrl}
                    alt={animal.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">{animal.photoPlaceholder}</span>
                )}
              </div>
              
              {/* Name */}
              <h3 className="mt-4 text-center text-xl font-bold text-foreground">
                {animal.name}
              </h3>
              
              {/* Breed */}
              <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
                {animal.breed}
              </p>
              
              {/* Info row */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{animal.sex}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{animal.estimatedAge}</span>
              </div>
              
              {/* Location badge */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Cage {animal.cage}
                </div>
              </div>
        </div>
      </div>
    </Link>
  )
}
