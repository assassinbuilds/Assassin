import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/cards/ResourceCard";
import CTASection from "@/components/sections/CTASection";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import { resourceCategories, resources } from "@/data/resources";

const Resources = () => (
  <div className="min-h-screen bg-white text-slate-950">
    <Navbar dark={false} />
    <main>
      <PageHero
        eyebrow="Builder Resources"
        title={
          <>
            Practical guides for students who want to{" "}
            <span className="relative inline-block text-red-600">
              ship
              <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
            </span>
          </>
        }
        description="Use these guides, templates, and checklists to improve GitHub, LinkedIn, portfolios, hackathon readiness, and mission proof."
        primaryCta={{ label: "Start Mission 01", href: "/missions" }}
      />

      <section className="bg-white pb-8">
        <div className="container mx-auto flex max-w-5xl flex-wrap justify-center gap-3 px-6">
          {resourceCategories.map((category) => (
            <span key={category} className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Resource Library"
            title="Everything should help a student take the next action."
            description="The first resource set focuses on the same journey as Mission 01: profile, proof, portfolio, project, and showcase."
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.title} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <SectionHeader
            eyebrow="Content Rule"
            title="Keep resources simple, useful, and updated."
            description="Resources should be written for action. Each one should explain the goal, the steps, the proof to submit, and an example students can follow."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {["Goal", "Steps", "Proof"].map((item, index) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-[0_22px_65px_-55px_rgba(15,23,42,0.8)]">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-black text-slate-950">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Use the guides"
        title="Turn every resource into public proof."
        description="Read, apply, submit proof, and keep improving your builder profile."
        ctaLabel="Apply for Mission 01"
        ctaHref="/join"
      />
    </main>
    <Footer />
  </div>
);

export default Resources;
