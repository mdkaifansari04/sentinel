import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const productName = "RepoPulse";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-muted text-xs font-semibold tracking-[0.2em]">
            RP
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{productName}</p>
            <p className="text-xs text-muted-foreground">Open-source activity radar</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link className="hover:text-foreground" href="#how-it-works">
            How it works
          </Link>
          <Link className="hover:text-foreground" href="#why-it-exists">
            Why it exists
          </Link>
          <Link className="hover:text-foreground" href="#problems">
            Problems solved
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/activity">View activity</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
