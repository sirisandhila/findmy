import { SiteHeader } from "@/components/site-header"
import { CollegeDiscovery } from "@/components/college-discovery"
import { getColleges } from "@/lib/queries"

export default async function Page() {
  const colleges = await getColleges()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <CollegeDiscovery colleges={colleges} />
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            CollegeKampus — Discover, compare, and choose the right college. Data
            shown is for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}
