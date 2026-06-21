import { db } from "@/lib/db"
import {
colleges as collegesTable,
collegeDetails,
} from "@/lib/db/schema"

import { asc, eq } from "drizzle-orm"
import type { College } from "@/lib/colleges"

export async function getColleges(): Promise<College[]> {
const rows = await db
.select()
.from(collegesTable)
.orderBy(asc(collegesTable.ranking))

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

export async function getCollegeById(id: number) {
const result = await db
.select({
college: collegesTable,
details: collegeDetails,
})
.from(collegesTable)
.leftJoin(
collegeDetails,
eq(collegesTable.id, collegeDetails.collegeId)
)
.where(eq(collegesTable.id, id))
.limit(1)

if (!result.length) {
return null
}

const row = result[0]

return {
id: String(row.college.id),
name: row.college.name,
shortName: row.college.shortName,
location: row.college.location,
city: row.college.city,
state: row.college.state,
image: row.college.image,
rating: row.college.rating,
reviews: row.college.reviews,
fees: row.college.fees,
feesLabel: row.college.feesLabel,
stream: row.college.stream,
type: row.college.type,
ranking: row.college.ranking,
rankingBody: row.college.rankingBody,
courses: row.college.courses,
accredited: row.college.accredited,
exams: row.college.exams,
featured: row.college.featured,

```
details: row.details
  ? {
      description: row.details.description,
      establishedYear: row.details.establishedYear,
      campusSize: row.details.campusSize,

      nirf2025: row.details.nirf2025,
      nirf2024: row.details.nirf2024,
      nirf2023: row.details.nirf2023,

      coursesOffered: row.details.coursesOffered,

      eligibility: row.details.eligibility,
      admissionProcess: row.details.admissionProcess,

      placementRate: row.details.placementRate,
      averagePackage: row.details.averagePackage,
      highestPackage: row.details.highestPackage,

      topRecruiters: row.details.topRecruiters,

      hostelAvailable: row.details.hostelAvailable,
      hostelFees: row.details.hostelFees,

      website: row.details.website,
    }
  : null,
```

}
}

