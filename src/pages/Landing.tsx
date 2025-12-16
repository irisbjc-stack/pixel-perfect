import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>MediBot - Smart Robots for Healthcare Delivery</title>
        <meta name="description" content="Autonomous medical logistics robots with SLAM navigation and adaptive intelligence. Streamline medication delivery, sample transport, and equipment logistics." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
