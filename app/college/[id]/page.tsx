import { getCollegeById } from "@/lib/queries"
import { notFound } from "next/navigation"

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
    <div className="max-w-6xl mx-auto p-6">

      <img
        src={college.image}
        alt={college.name}
        className="w-full h-96 object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-6">
        {college.name}
      </h1>

      <p className="text-muted-foreground mt-2">
        {college.location}, {college.state}
      </p>

      <div className="grid md:grid-cols-4 gap-4 mt-8">

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Ranking</h3>
          <p>#{college.ranking}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Rating</h3>
          <p>{college.rating}/5</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Fees</h3>
          <p>₹{college.fees.toLocaleString()}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Courses</h3>
          <p>{college.courses}</p>
        </div>

      </div>

    </div>
  )
}
