// app/page.js
"use client";
import Navbar             from "@/components/Navbar";
import HeroSection        from "@/components/sections/HeroSection";
import AboutSection       from "@/components/sections/AboutSection";
import PortfolioGallery   from "@/components/sections/PortfolioGallery";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import WhatsAppButton     from "@/components/ui/WhatsAppButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioGallery />
      <BeforeAfterSection />
      <WhatsAppButton />
    </main>
  );
}
