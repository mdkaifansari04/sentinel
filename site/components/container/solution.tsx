import { FileText, Flag, Layers, MessageCircle } from "lucide-react";

export default function SolutionSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">Problems it solves</h2>
          <p>A quiet, focused view into the pulse of a repository.</p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-1 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              <h3 className="text-sm font-medium">Missed conversations</h3>
            </div>
            <p className="text-sm">Keep up with fast-moving issue threads and review notes without combing through GitHub tabs.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="size-4" />
              <h3 className="text-sm font-medium">Scattered updates</h3>
            </div>
            <p className="text-sm">Track multiple repositories in one place and know exactly what changed since your last visit.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flag className="size-4" />
              <h3 className="text-sm font-medium">Unclear priorities</h3>
            </div>
            <p className="text-sm">See which PRs were opened, labeled, or merged to spot the highest-impact work quickly.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4" />
              <h3 className="text-sm font-medium">Manual reporting</h3>
            </div>
            <p className="text-sm">A structured event ledger makes it easy to build summaries or future AI-driven insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
