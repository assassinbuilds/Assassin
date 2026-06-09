import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuilderCard from "@/components/cards/BuilderCard";
import CTASection from "@/components/sections/CTASection";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import StatsBar from "@/components/sections/StatsBar";
import { builderStats, builderTestimonials, featuredBuilders, shippedProjects } from "@/data/builders";

const Builders = () => (
  <div className="min-h-screen bg-white text-slate-950">
    <Navbar dark={false} />
    <main>
      <PageHero
        eyebrow="Wall of Builders"
        title={
          <>
            Proof from the students who{" "}
            <span className="relative inline-block text-red-600">
              ship
              <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
            </span>
          </>
        }
        description="The Wall of Builders is where completed missions, shipped projects, profile improvements, and student proof become visible."
        primaryCta={{ label: "Apply for Mission 01", href: "/join" }}
        secondaryCta={{ label: "Explore missions", href: "/missions" }}
      />

      <section className="bg-white pb-16">
        <div className="container mx-auto px-6">
          <StatsBar stats={builderStats} />
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Featured Builders"
            title="Student proof, not empty claims."
            description="Builder cards highlight mission completions, projects, links, and the visible work students can keep improving."
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredBuilders.map((builder) => (
              <BuilderCard key={builder.name} builder={builder} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Projects Shipped"
            title="Every mission should leave a public artifact."
          />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {shippedProjects.map((project) => (
              <article key={project.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_26px_75px_-55px_rgba(15,23,42,0.85)]">
                <span className="rounded bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  {project.status}
                </span>
                <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950">{project.title}</h3>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Builder Voices" title="What the proof system should feel like." />
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {builderTestimonials.map((item) => (
              <article key={item.name} className="rounded-lg border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.85)]">
                <p className="text-lg font-bold leading-8 text-slate-800">"{item.quote}"</p>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-600">
                  {item.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Get Featured"
        title="Complete the mission, submit proof, and earn your spot."
        description="The Wall of Builders should update as more students complete missions and ship public projects."
        ctaLabel="Join Mission 01"
        ctaHref="/join"
      />
    </main>
    <Footer />
  </div>
);

export default Builders;
