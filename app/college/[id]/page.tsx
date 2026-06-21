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

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <Image
          src={college.image || "/placeholder.svg"}
          alt={college.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            {college.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {college.location}, {college.city}, {college.state}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-10">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Ranking</p>
            <p className="text-2xl font-bold">
              #{college.ranking}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold">
              {college.rating}/5
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Fees</p>
            <p className="text-2xl font-bold">
              ₹{college.fees.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Courses</p>
            <p className="text-2xl font-bold">
              {college.courses}+
            </p>
          </div>
        </div>

        {/* About */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            About College
          </h2>

          <p className="text-muted-foreground leading-7">
            {college.name} is one of the leading institutions in India,
            offering high-quality education, modern infrastructure,
            experienced faculty, research opportunities, and strong
            industry connections.
          </p>
        </section>

        {/* Exams */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Accepted Exams
          </h2>

          <div className="flex flex-wrap gap-2">
            {college.exams.map((exam) => (
              <span
                key={exam}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>

        {/* Placement Stats */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Placement Statistics
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Placement Rate
              </p>
              <p className="text-2xl font-bold">90%</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Average Package
              </p>
              <p className="text-2xl font-bold">₹12 LPA</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">
                Highest Package
              </p>
              <p className="text-2xl font-bold">₹45 LPA</p>
            </div>
          </div>
        </section>

        {/* Admission Process */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Admission Process
          </h2>

          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Appear for the required entrance examination.</li>
            <li>Participate in counselling and seat allocation.</li>
            <li>Complete document verification.</li>
            <li>Pay admission fees and confirm enrollment.</li>
          </ol>
        </section>
      </div>
    </main>
  )
}
