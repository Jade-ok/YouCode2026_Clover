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
    <Link href={`/animals/${animal.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-card shadow-[0_2px_16px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.16)]">
        {/* Photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {animal.photoUrl ? (
            <Image
              src={animal.photoUrl}
              alt={animal.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              {animal.photoPlaceholder}
            </div>
          )}
          {/* Gradient blend into card bg */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/60 to-transparent" />
        </div>

        {/* Info */}
        <div className="px-4 pb-4 pt-2">
          {/* Name + Cage */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
            <span className="flex items-center gap-0.5 text-xs font-medium text-foreground/60">
              <MapPin className="h-3 w-3" />
              {animal.cage}
            </span>
          </div>

          {/* Breed */}
          <p className="mt-0.5 text-sm font-semibold text-foreground/80">{animal.breed}</p>

          {/* Sex · Age */}
          <p className="mt-0.5 text-sm font-semibold text-foreground/80">
            {animal.sex} · {animal.estimatedAge}
          </p>
        </div>
      </div>
    </Link>
  )
}
