import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCollegeById } from "@/lib/queries"

export const dynamic = "force-dynamic"

type PageProps = {
params: Promise<{ id: string }>
}

export async function generateMetadata(
{ params }: PageProps
): Promise<Metadata> {
const { id } = await params

const college = await getCollegeById(Number(id))

if (!college) {
return {
title: "College Not Found | CollegeKampus",
}
}

return {
title: `${college.name} | CollegeKampus`,


description:
  college.details?.description ||
  `${college.name} admissions, placements, fees, rankings, courses and campus information.`,

keywords: [
  college.name,
  `${college.name} admissions`,
  `${college.name} placements`,
  `${college.name} fees`,
  `${college.name} ranking`,
  `${college.name} courses`,
  college.city,
  college.state,
  "CollegeKampus",
],

openGraph: {
  title: `${college.name} | CollegeKampus`,
  description:
    college.details?.description ||
    `${college.name} admissions, placements, fees and rankings.`,
  images: [
    {
      url: college.image,
      width: 1200,
      height: 630,
      alt: college.name,
    },
  ],
  type: "website",
},

twitter: {
  card: "summary_large_image",
  title: `${college.name} | CollegeKampus`,
  description:
    college.details?.description ||
    `${college.name} admissions, placements and rankings.`,
  images: [college.image],
},


}
}

export default async function CollegePage({
  params,
}: PageProps) {
  const { id } = await params

  const college = await getCollegeById(Number(id))

  if (!college) {
    notFound()
  }

  const details = college.details

  const gallery = await getCollegeGallery(Number(id))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    image: college.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: college.city,
      addressRegion: college.state,
      addressCountry: "India",
    },
    url: details?.website || "",
    description: details?.description || "",
  }

  return (
    <main className="min-h-screen bg-background">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

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

        {/* YOUR EXISTING SECTIONS HERE */}

        {/* Campus Gallery */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Campus Gallery
          </h2>

          {gallery.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="relative h-64 overflow-hidden rounded-xl"
                >
                  <Image
                    src={img.imageUrl}
                    alt={`${college.name} Campus`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No gallery images available.</p>
          )}
        </section>

      </div>
    </main>
  )
}
