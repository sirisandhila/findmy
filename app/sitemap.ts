import { getColleges } from "@/lib/queries"

export default async function sitemap() {
  const colleges = await getColleges()

  return [
    {
      url: "https://findmy-v8cc.vercel.app",
      lastModified: new Date(),
    },

    ...colleges.map((college) => ({
      url: `https://findmy-v8cc.vercel.app/college/${college.id}`,
      lastModified: new Date(),
    })),
  ]
}
