export type CollegeDetails = {
description?: string | null

establishedYear?: number | null

campusSize?: string | null

nirf2025?: number | null
nirf2024?: number | null
nirf2023?: number | null

coursesOffered?: string[] | null

eligibility?: string | null

admissionProcess?: string | null

placementRate?: string | number | null

averagePackage?: string | number | null

highestPackage?: string | number | null

topRecruiters?: string[] | null

hostelAvailable?: boolean | null

hostelFees?: number | null

website?: string | null
}

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

fees: number

feesLabel: string

stream: string

type: "Government" | "Private" | "Deemed"

ranking: number

rankingBody: string

courses: number

accredited: string

exams: string[]

featured?: boolean

details?: CollegeDetails | null
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

export const TYPES = [
"Government",
"Private",
"Deemed",
] as const
