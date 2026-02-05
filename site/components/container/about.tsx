import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">Why it exists.</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image src="/payments.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
              <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Open-source work moves fast. Important discussions get buried. <span className="text-accent-foreground font-bold">Sentinel surfaces what matters so contributors can stay aligned.</span>
            </p>
            <p className="text-muted-foreground">It supports the full contributor loop — issues, PRs, reviews, and releases — without losing the context that makes decisions easier.</p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>Whether you are reviewing pull requests, tracking issues, or trying to understand where a project is heading, Sentinel keeps a clear record of recent activity. It removes the friction of checking multiple repos and helps contributors make smarter decisions with the latest context, without being online 24/7.</p>
                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Open-source contributor</cite>
                  <img className="h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Community Logo" height="20" width="auto" />
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
