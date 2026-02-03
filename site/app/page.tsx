import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Open-source signal, distilled
            </p>
            <h1 className="font-hero text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              RepoPulse keeps every commit, comment, and decision visible without the noise.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Track what changed, who did it, and why it matters across your favorite repositories. Built for
              contributors who need awareness without babysitting GitHub tabs.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/activity">View live activity</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
          <Card className="border-border/70 bg-card/60">
            <CardHeader>
              <CardTitle>What you get</CardTitle>
              <CardDescription>A practical activity ledger for open-source teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Always on, every 5 minutes.</p>
                <p>RepoPulse keeps a heartbeat of events from the repos you care about.</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-foreground">Structured summaries, not raw payloads.</p>
                <p>Only the fields you need are stored, ready for dashboards and future analysis.</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-foreground">Built for focus.</p>
                <p>See issues, PRs, reviews, and releases without digging through endless feeds.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="mt-20 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <p className="text-muted-foreground">
              A lightweight worker polls GitHub events, normalizes them, and keeps the latest activity ready for
              dashboards.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Track repo list",
                description:
                  "Configure the repos you contribute to. The worker checks each repo on a reliable cadence.",
              },
              {
                title: "Normalize events",
                description:
                  "Pull requests, issue comments, releases, and pushes are mapped into clean, typed records.",
              },
              {
                title: "Serve instantly",
                description:
                  "The API returns the latest events for the UI, optimized for quick scanning.",
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

        <section id="why-it-exists" className="mt-20 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Why it exists</h2>
            <p className="text-muted-foreground">
              Open-source work moves fast. Important discussions get buried. RepoPulse surfaces what matters so
              contributors can stay aligned.
            </p>
          </div>
          <Card className="border-border/60 bg-card/60">
            <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
              <p>
                Whether you are reviewing pull requests, keeping an eye on issues, or just trying to understand
                where a project is heading, RepoPulse keeps a clear record of recent activity. It was created to
                remove the friction of checking multiple repos manually.
              </p>
              <p>
                The goal is to help contributors make smarter decisions by knowing the latest context, without
                needing to be online 24/7.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="problems" className="mt-20 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Problems it solves</h2>
            <p className="text-muted-foreground">
              A quiet, focused view into the pulse of a repository.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Missed conversations",
                description:
                  "Keep up with fast-moving issue threads and review notes without combing through GitHub tabs.",
              },
              {
                title: "Scattered updates",
                description:
                  "Track multiple repositories in one place and know exactly what changed since your last visit.",
              },
              {
                title: "Unclear priorities",
                description:
                  "See which PRs were opened, labeled, or merged to spot the highest-impact work quickly.",
              },
              {
                title: "Manual reporting",
                description:
                  "A structured event ledger makes it easy to build summaries or future AI-driven insights.",
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
    </div>
  );
}
