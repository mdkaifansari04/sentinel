import Link from "next/link";

import AboutSection from "@/components/container/about";
import Features from "@/components/container/feature";
import HeroSection from "@/components/container/hero";
import SolutionSection from "@/components/container/solution";
import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16">
        <HeroSection />
        <Features />
        <AboutSection />
        <SolutionSection />
      </main>
      <Footer />
    </div>
  );
}
