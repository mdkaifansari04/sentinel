import { BookOpen, Github } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">Sentinel</p>
          <p>Built for open-source contributors who value context over noise.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="https://github.com/mdkaifansari/https://github.com/mdkaifansari04/sentinel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://github.com/mdkaifansari/https://github.com/mdkaifansari04/sentinel" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <BookOpen className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
