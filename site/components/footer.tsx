import Link from "next/link";
function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">Sentinel</p>
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
  );
}

export default Footer;
