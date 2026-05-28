import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import FounderSection from "@/components/about/FounderSection";
import JoinOperationSection from "@/components/about/JoinOperationSection";
import MembersSection from "@/components/about/MembersSection";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar dark={false} />

      <main>
        <AboutHero />
        <MembersSection />
        <FounderSection />
        <JoinOperationSection />
      </main>

      <Footer />
    </div>
  );
};

export default About;
