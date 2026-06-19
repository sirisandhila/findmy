export type College = {
  id: string
  name: string
  shortName: string
  location: string
  city: string
  state: string
  image: string
  rating: number
  reviews: number
  fees: number // total course fee in INR
  feesLabel: string
  stream: string
  type: "Government" | "Private" | "Deemed"
  ranking: number
  rankingBody: string
  courses: number
  accredited: string
  exams: string[]
  featured?: boolean
}

export const STREAMS = [
  "Engineering",
  "Management",
  "Medical",
  "Law",
  "Arts & Science",
  "Commerce",
] as const

export const STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Uttar Pradesh",
] as const

export const TYPES = ["Government", "Private", "Deemed"] as const
