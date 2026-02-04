import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import { ReactNode } from "react";

export default function Features() {
  return (
    <section id="how-it-works" className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">How it works</h2>
          <p className="mt-4">RepoPulse monitors the repos you follow, normalizes activity, and keeps the pulse ready for review.</p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="group border-0 shadow-none bg-black">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Track the right repos</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Choose the open-source projects you care about and let RepoPulse keep a steady watch.</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-black">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Normalize every signal</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">Events are mapped into clean records so you can filter by PRs, issues, reviews, and releases.</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-black">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Summaries on demand</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">Pulse AI highlights trending issues, review queues, and the work that needs attention.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50" />

    <div className="bg-black absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
);
