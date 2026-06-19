import { GraduationCap, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = ["Colleges", "Exams", "Courses", "Rankings", "Reviews"]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            College<span className="text-primary">Kampus</span>
          </span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button className="hidden sm:inline-flex">Sign up</Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
