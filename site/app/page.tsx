import Link from "next/link";

import AboutSection from "@/components/container/about";
import Features from "@/components/container/feature";
import HeroSection from "@/components/container/hero";
import { SiteHeader } from "@/components/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16">
        <HeroSection />
        <Features />
        <AboutSection />
        <section id="problems" className="mt-20 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Problems it solves</h2>
            <p className="text-muted-foreground">A quiet, focused view into the pulse of a repository.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Missed conversations",
                description: "Keep up with fast-moving issue threads and review notes without combing through GitHub tabs.",
              },
              {
                title: "Scattered updates",
                description: "Track multiple repositories in one place and know exactly what changed since your last visit.",
              },
              {
                title: "Unclear priorities",
                description: "See which PRs were opened, labeled, or merged to spot the highest-impact work quickly.",
              },
              {
                title: "Manual reporting",
                description: "A structured event ledger makes it easy to build summaries or future AI-driven insights.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-foreground">RepoPulse</p>
            <p>Built for open-source contributors who value context over noise.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/activity" className="hover:text-foreground">
              Activity
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground">
              How it works
            </Link>
            <Link href="#problems" className="hover:text-foreground">
              Problems solved
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
