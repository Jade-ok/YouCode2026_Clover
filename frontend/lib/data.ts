export interface Animal {
  id: string
  name: string
  cage: string
  species: string
  breed: string
  sex: string
  estimatedAge: string
  intakeDate: string
  daysInShelter: number
  status: string[]
  recentSummary: string
  photoPlaceholder: string
  photoUrl: string
}

export interface CheckIn {
  id: string
  animalId: string
  date: string
  time: string
  volunteer: string
  transcript: string
  extracted: {
    feeding?: string
    water?: string
    health?: string
    behavior?: string
    medication?: string
    appointment?: string
    action?: string
  }
}

export const animals: Animal[] = [
  {
    id: "orange-b12",
    name: "Orange",
    cage: "B-12",
    species: "Cat",
    breed: "Orange Tabby",
    sex: "Male",
    estimatedAge: "2 years",
    intakeDate: "2024-03-28",
    daysInShelter: 7,
    status: ["Needs medication", "Skittish", "Vet today"],
    recentSummary: "Paw wound healing, still skittish. Eating trend declining over 2 days.",
    photoPlaceholder: "🐱",
    photoUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: "luna-a04",
    name: "Luna",
    cage: "A-04",
    species: "Dog",
    breed: "Chihuahua Mix",
    sex: "Female",
    estimatedAge: "10 years",
    intakeDate: "2024-03-20",
    daysInShelter: 15,
    status: ["Needs medication", "Senior care"],
    recentSummary: "Taking medication well. Friendly and calm. Good appetite today.",
    photoPlaceholder: "🐕",
    photoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: "mochi-c03",
    name: "Mochi",
    cage: "C-03",
    species: "Rabbit",
    breed: "Holland Lop",
    sex: "Female",
    estimatedAge: "1 year",
    intakeDate: "2024-04-01",
    daysInShelter: 3,
    status: [],
    recentSummary: "Eating well, active and curious. No concerns at this time.",
    photoPlaceholder: "🐰",
    photoUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: "shadow-d07",
    name: "Shadow",
    cage: "D-07",
    species: "Cat",
    breed: "Black DSH",
    sex: "Male",
    estimatedAge: "4 years",
    intakeDate: "2024-03-25",
    daysInShelter: 10,
    status: ["Feeding decline"],
    recentSummary: "Appetite decreased yesterday. Monitoring closely. Otherwise healthy.",
    photoPlaceholder: "🐈‍⬛",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: "bella-a02",
    name: "Bella",
    cage: "A-02",
    species: "Dog",
    breed: "Labrador Mix",
    sex: "Female",
    estimatedAge: "3 years",
    intakeDate: "2024-03-30",
    daysInShelter: 5,
    status: ["Behavior caution"],
    recentSummary: "Resource guarding with food. Use slow approach. Great on walks.",
    photoPlaceholder: "🦮",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: "whiskers-b08",
    name: "Whiskers",
    cage: "B-08",
    species: "Cat",
    breed: "Gray Tabby",
    sex: "Male",
    estimatedAge: "6 years",
    intakeDate: "2024-04-02",
    daysInShelter: 2,
    status: [],
    recentSummary: "New intake, settling in well. Good appetite, friendly demeanor.",
    photoPlaceholder: "😺",
    photoUrl: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop&crop=face"
  }
]

export const checkIns: CheckIn[] = [
  {
    id: "checkin-1",
    animalId: "orange-b12",
    date: "2024-04-04",
    time: "3:45 PM",
    volunteer: "Sarah M.",
    transcript: "B-12 orange tabby, he only ate half his kibble this morning. Drank a little water. The paw wound looks more swollen than yesterday. Vet appointment is set for 3 PM today. Personality-wise he's a bit better than yesterday, but he still flinches if you reach out suddenly.",
    extracted: {
      feeding: "Half kibble",
      water: "Drank a little",
      health: "Paw wound more swollen",
      appointment: "Vet at 3 PM",
      behavior: "Slightly improved, still flinches",
      action: "Monitor after vet visit"
    }
  },
  {
    id: "checkin-2",
    animalId: "orange-b12",
    date: "2024-04-04",
    time: "10:30 AM",
    volunteer: "Mike T.",
    transcript: "Morning check on Orange. Gave him his antibiotic ointment on the paw wound. He was nervous but tolerated it. Left him some wet food to encourage eating.",
    extracted: {
      medication: "Antibiotic ointment applied",
      behavior: "Nervous but tolerated treatment",
      feeding: "Offered wet food"
    }
  },
  {
    id: "checkin-3",
    animalId: "orange-b12",
    date: "2024-04-03",
    time: "6:00 PM",
    volunteer: "Sarah M.",
    transcript: "Evening round for Orange. He ate most of his dinner which is good. Still very skittish, moves to back of cage when I approach. Paw wound looks the same, not worse. Water bowl was half empty.",
    extracted: {
      feeding: "Ate most of dinner",
      behavior: "Very skittish, retreats to back of cage",
      health: "Paw wound stable",
      water: "Drinking normally"
    }
  },
  {
    id: "checkin-4",
    animalId: "orange-b12",
    date: "2024-04-03",
    time: "9:00 AM",
    volunteer: "Emily R.",
    transcript: "Morning medication for Orange. Applied ointment to right front paw as directed. He hissed once but no scratching. Eating has dropped off a bit from yesterday. Making sure he has fresh water.",
    extracted: {
      medication: "Ointment applied to right front paw",
      behavior: "Hissed but no aggression",
      feeding: "Eating decreased from yesterday",
      water: "Fresh water provided"
    }
  }
]

export const insightsData = {
  commonCareNeeds: [
    { need: "Medication administration", count: 12 },
    { need: "Behavior monitoring", count: 8 },
    { need: "Feeding concerns", count: 6 },
    { need: "Post-surgery care", count: 4 },
    { need: "Socialization", count: 3 }
  ],
  medicalPercentage: 42,
  unresolvedFollowups: [
    { animal: "Orange", issue: "Monitor paw wound after vet visit", priority: "high" },
    { animal: "Shadow", issue: "Track feeding for 48 hours", priority: "medium" },
    { animal: "Bella", issue: "Resource guarding training", priority: "medium" }
  ],
  completionRate: 94,
  weeklyStats: {
    totalCheckIns: 147,
    animalsMonitored: 23,
    avgCheckInsPerAnimal: 6.4,
    volunteersActive: 12
  }
}
