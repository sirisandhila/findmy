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
.select()
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
id: String(row.colleges.id),
name: row.colleges.name,
shortName: row.colleges.shortName,
location: row.colleges.location,
city: row.colleges.city,
state: row.colleges.state,
image: row.colleges.image,
rating: row.colleges.rating,
reviews: row.colleges.reviews,
fees: row.colleges.fees,
feesLabel: row.colleges.feesLabel,
stream: row.colleges.stream,
type: row.colleges.type,
ranking: row.colleges.ranking,
rankingBody: row.colleges.rankingBody,
courses: row.colleges.courses,
accredited: row.colleges.accredited,
exams: row.colleges.exams,
featured: row.colleges.featured,

```
details: row.collegeDetails
  ? {
      description: row.collegeDetails.description,
      establishedYear: row.collegeDetails.establishedYear,
      campusSize: row.collegeDetails.campusSize,

      nirf2025: row.collegeDetails.nirf2025,
      nirf2024: row.collegeDetails.nirf2024,
      nirf2023: row.collegeDetails.nirf2023,

      coursesOffered: row.collegeDetails.coursesOffered,

      eligibility: row.collegeDetails.eligibility,
      admissionProcess: row.collegeDetails.admissionProcess,

      placementRate: row.collegeDetails.placementRate,
      averagePackage: row.collegeDetails.averagePackage,
      highestPackage: row.collegeDetails.highestPackage,

      topRecruiters: row.collegeDetails.topRecruiters,

      hostelAvailable: row.collegeDetails.hostelAvailable,
      hostelFees: row.collegeDetails.hostelFees,

      website: row.collegeDetails.website,
    }
  : null,
```

}
}
