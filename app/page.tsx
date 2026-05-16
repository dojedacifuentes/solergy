import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Benefits } from "@/components/sections/benefits";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CasesPreview } from "@/components/sections/cases-preview";
import { TrustModule } from "@/components/sections/trust-module";
import { Zones } from "@/components/sections/zones";
import { ContactCTA } from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <CasesPreview />
        <TrustModule />
        <Zones />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
