import Image from "next/image"
import { notFound } from "next/navigation"
import { getCollegeById } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function CollegePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const college = await getCollegeById(Number(id))

  if (!college) {
    notFound()
  }

  const details = college.details

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Image */}
      <div className="relative h-[450px] w-full">
        <Image
          src={college.image || "/placeholder.svg"}
          alt={college.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            {college.name}
          </h1>

          <p className="mt-2 text-lg text-muted-foreground">
            {college.location}, {college.city}, {college.state}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-10">

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">
              Ranking
            </p>
            <p className="text-2xl font-bold">
              #{college.ranking}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">
              Rating
            </p>
            <p className="text-2xl font-bold">
              {college.rating}/5
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">
              Fees
            </p>
            <p className="text-2xl font-bold">
              ₹{college.fees.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">
              Courses
            </p>
            <p className="text-2xl font-bold">
              {college.courses}+
            </p>
          </div>

        </div>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            College Overview
          </h2>

          <p className="leading-7 text-muted-foreground">
            {details?.description ||
              `${college.name} is one of India's leading institutions offering quality education and excellent career opportunities.`}
          </p>
        </section>

        {/* College Information */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            College Information
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Established
              </p>
              <p className="text-xl font-bold">
                {details?.establishedYear || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Campus Size
              </p>
              <p className="text-xl font-bold">
                {details?.campusSize || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Accreditation
              </p>
              <p className="text-xl font-bold">
                {college.accredited}
              </p>
            </div>

          </div>
        </section>

        {/* NIRF Rankings */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            NIRF Ranking History
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border p-5">
              <p>2025</p>
              <p className="text-2xl font-bold">
                #{details?.nirf2025 || "-"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p>2024</p>
              <p className="text-2xl font-bold">
                #{details?.nirf2024 || "-"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p>2023</p>
              <p className="text-2xl font-bold">
                #{details?.nirf2023 || "-"}
              </p>
            </div>

          </div>
        </section>

        {/* Courses Offered */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Courses Offered
          </h2>

          <div className="flex flex-wrap gap-2">
            {details?.coursesOffered?.map((course: string) => (
              <span
                key={course}
                className="rounded-lg border px-3 py-2"
              >
                {course}
              </span>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Eligibility
          </h2>

          <p className="text-muted-foreground">
            {details?.eligibility || "Not Available"}
          </p>
        </section>

        {/* Admission Process */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Admission Process
          </h2>

          <p className="text-muted-foreground">
            {details?.admissionProcess || "Not Available"}
          </p>
        </section>

        {/* Accepted Exams */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Accepted Exams
          </h2>

          <div className="flex flex-wrap gap-2">
            {college.exams.map((exam) => (
              <span
                key={exam}
                className="rounded-lg border px-3 py-2"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>

        {/* Placement Statistics */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Placement Statistics
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Placement Rate
              </p>
              <p className="text-2xl font-bold">
                {details?.placementRate || "-"}%
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Average Package
              </p>
              <p className="text-2xl font-bold">
                ₹{details?.averagePackage || "-"} LPA
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Highest Package
              </p>
              <p className="text-2xl font-bold">
                ₹{details?.highestPackage || "-"} LPA
              </p>
            </div>

          </div>
        </section>

        {/* Recruiters */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Top Recruiters
          </h2>

          <div className="flex flex-wrap gap-2">
            {details?.topRecruiters?.map((company: string) => (
              <span
                key={company}
                className="rounded-lg border px-3 py-2"
              >
                {company}
              </span>
            ))}
          </div>
        </section>

        {/* Hostel */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Hostel Information
          </h2>

          <p>
            Hostel Available:{" "}
            <strong>
              {details?.hostelAvailable ? "Yes" : "No"}
            </strong>
          </p>

          <p className="mt-2">
            Hostel Fees: ₹
            {details?.hostelFees?.toLocaleString("en-IN") || "N/A"}
          </p>
        </section>

        {/* Website */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold">
            Official Website
          </h2>

          {details?.website ? (
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Visit Website
            </a>
          ) : (
            <p>Not Available</p>
          )}
        </section>

      </div>
    </main>
  )
}
