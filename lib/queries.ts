import { db } from "@/lib/db"
import { colleges as collegesTable } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import type { College } from "@/lib/colleges"

export async function getColleges(): Promise<College[]> {
  const rows = await db.select().from(collegesTable).orderBy(asc(collegesTable.ranking))
  return rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    shortName: r.shortName,
    location: r.location,
    city: r.city,
    state: r.state,
    image: r.image,
    rating: r.rating,
    reviews: r.reviews,
    fees: r.fees,
    feesLabel: r.feesLabel,
    stream: r.stream,
    type: r.type as College["type"],
    ranking: r.ranking,
    rankingBody: r.rankingBody,
    courses: r.courses,
    accredited: r.accredited,
    exams: r.exams,
    featured: r.featured,
  }))
}
