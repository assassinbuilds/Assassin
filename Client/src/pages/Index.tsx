import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CommunitySection from "@/components/CommunitySection";
import DeveloperTestimonials from "@/components/DeveloperTestimonials";
import WhySection from "@/components/WhySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CommunitySection />
      <DeveloperTestimonials />
      <WhySection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
