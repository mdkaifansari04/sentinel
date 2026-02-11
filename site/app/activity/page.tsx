import { SiteHeader } from "@/components/site-header";
import { ActivityClient } from "@/components/activity-client";

export default function ActivityPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Live activity
          </p>
          <h1 className="text-3xl font-semibold">Latest repository events</h1>
          <p className="text-muted-foreground">
            Built for contributors and maintainers who need signal-fast awareness.
          </p>
        </header>

        <ActivityClient />
      </main>
    </div>
  );
}
