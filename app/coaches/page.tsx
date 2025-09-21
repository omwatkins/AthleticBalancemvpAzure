import { createClient } from "@/lib/azure/server"
import { COACHES } from "@/lib/coaches"
import Link from "next/link"

export const metadata = {
  title: "Coaches • Athletic Balance",
}

export default async function CoachesPage() {
  const supabase = await createClient()

  // Authentication is now handled optionally through the navigation component
  // if (supabase) {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser()

  //   if (!user) {
  //     redirect("/login")
  //   }
  // }

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Choose Your Coach</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          19 specialized AI coaches for teen athletes. Text-only sessions focused on real progress.
        </p>
      </header>

      <section className="space-y-8">
        {/* Performance & Training */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary">Performance & Training</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COACHES.filter((c) =>
              ["coach-strong", "coach-skills", "coach-clutch", "coach-neuro"].includes(c.slug),
            ).map((c) => (
              <Link
                key={c.slug}
                href={`/coaches/${c.slug}`}
                className="group rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl">{c.emoji}</div>
                <h3 className="mt-2 text-sm sm:text-base font-semibold leading-tight">{c.name}</h3>
                <p className="mt-1 text-[12px] sm:text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-3 inline-flex items-center text-[12px] sm:text-xs font-medium text-primary">
                  Start Session →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mental & Recovery */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary">Mental & Recovery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COACHES.filter((c) =>
              ["coach-calm", "coach-mindset", "coach-vision", "coach-recover", "coach-focus"].includes(c.slug),
            ).map((c) => (
              <Link
                key={c.slug}
                href={`/coaches/${c.slug}`}
                className="group rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl">{c.emoji}</div>
                <h3 className="mt-2 text-sm sm:text-base font-semibold leading-tight">{c.name}</h3>
                <p className="mt-1 text-[12px] sm:text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-3 inline-flex items-center text-[12px] sm:text-xs font-medium text-primary">
                  Start Session →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Lifestyle & Development */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary">Lifestyle & Development</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COACHES.filter((c) => ["coach-fuel", "coach-baker", "coach-a-plus", "coach-flow"].includes(c.slug)).map(
              (c) => (
                <Link
                  key={c.slug}
                  href={`/coaches/${c.slug}`}
                  className="group rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl sm:text-4xl">{c.emoji}</div>
                  <h3 className="mt-2 text-sm sm:text-base font-semibold leading-tight">{c.name}</h3>
                  <p className="mt-1 text-[12px] sm:text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                  <div className="mt-3 inline-flex items-center text-[12px] sm:text-xs font-medium text-primary">
                    Start Session →
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Specialized Coaching */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary">Specialized Coaching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COACHES.filter((c) =>
              [
                "coach-mimi",
                "the-reset",
                "the-lock-in",
                "coach-watkins",
                "coach-scholarflow",
                "coach-brandhuddle",
              ].includes(c.slug),
            ).map((c) => (
              <Link
                key={c.slug}
                href={`/coaches/${c.slug}`}
                className="group rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl">{c.emoji}</div>
                <h3 className="mt-2 text-sm sm:text-base font-semibold leading-tight">{c.name}</h3>
                <p className="mt-1 text-[12px] sm:text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-3 inline-flex items-center text-[12px] sm:text-xs font-medium text-primary">
                  Start Session →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-8 sm:mt-10">
        <p className="text-xs text-muted-foreground">
          Voice sessions <span className="font-semibold">coming soon</span>.
        </p>
      </footer>
    </main>
  )
}
