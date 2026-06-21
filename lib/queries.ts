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
details: row.college_details
  ? {
      description: row.college_details.description,
      establishedYear: row.college_details.establishedYear,
      campusSize: row.college_details.campusSize,

      nirf2025: row.college_details.nirf2025,
      nirf2024: row.college_details.nirf2024,
      nirf2023: row.college_details.nirf2023,

      coursesOffered: row.college_details.coursesOffered,

      eligibility: row.college_details.eligibility,
      admissionProcess: row.college_details.admissionProcess,

      placementRate: row.college_details.placementRate,
      averagePackage: row.college_details.averagePackage,
      highestPackage: row.college_details.highestPackage,

      topRecruiters: row.college_details.topRecruiters,

      hostelAvailable: row.college_details.hostelAvailable,
      hostelFees: row.college_details.hostelFees,

      website: row.college_details.website,
    }
  : null,
```

}
}
