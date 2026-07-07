"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinApplicationForm from "@/components/forms/JoinApplicationForm";
import CTASection from "@/components/sections/CTASection";
import FAQAccordion from "@/components/sections/FAQAccordion";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import { joinFaqs } from "@/data/faqs";
import { memberLevels } from "@/data/brand";

const whoCanJoin = [
  "Students who want to move from tutorials to real projects.",
  "Beginners who can commit 30 focused minutes daily.",
  "Builders willing to submit public proof and accept feedback.",
  "Students looking for squads, mentors, and accountability.",
];

const whoShouldNotJoin = [
  "People looking for passive content only.",
  "Applicants who cannot submit proof consistently.",
  "Builders who do not want feedback or teamwork.",
];

const selectionSteps = [
  "Submit the Mission 01 application.",
  "The core team reviews fit, commitment, and links.",
  "Accepted builders receive mission instructions and squad access.",
  "Builders complete daily tasks and submit proof.",
];

const Join = () => (
  <div className="min-h-screen bg-white text-slate-950">
    <Navbar dark={false} />
    <main>
      <PageHero
        eyebrow="Join Mission 01"
        title={
          <>
            Apply to become a{" "}
            <span className="relative inline-block text-red-600">
              founding builder
              <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
            </span>
          </>
        }
        description="Mission 01 is for students who want structure, accountability, squads, and public proof while they build their first serious portfolio trail."
      />

      <section className="bg-white py-16">
        <div className="container mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
          <InfoList title="Who can join" items={whoCanJoin} accent="bg-emerald-400" />
          <InfoList title="Who should wait" items={whoShouldNotJoin} accent="bg-red-600" />
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Member Levels"
            title="A clear path from recruit to core leader."
            description="Tech Assassin levels give students a visible identity as they submit proof, ship projects, help squads, and lead missions."
          />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {memberLevels.map((level, index) => (
              <article key={level.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_22px_70px_-55px_rgba(15,23,42,0.8)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-black text-slate-950">{level.name}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{level.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Limited Seats"
              title="Apply for the first mission batch."
              description="This application captures the basics needed to understand your current level, links, goals, and daily commitment."
            />
            <div className="space-y-4">
              {selectionSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-6 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <JoinApplicationForm />
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="FAQ" title="Application questions" />
          <FAQAccordion items={joinFaqs} />
        </div>
      </section>

      <CTASection
        eyebrow="Start Building"
        title="Your first proof trail can start with Mission 01."
        description="Apply, join the batch, complete daily tasks, and make your work visible."
        ctaLabel="Apply now"
        ctaHref="/join"
      />
    </main>
    <Footer />
  </div>
);

const InfoList = ({ title, items, accent }: { title: string; items: string[]; accent: string }) => (
  <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-7 shadow-[0_28px_80px_-55px_rgba(15,23,42,0.85)]">
    <span className={`absolute inset-x-0 top-0 h-2 ${accent}`} aria-hidden="true" />
    <h2 className="text-2xl font-black text-slate-950">{title}</h2>
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base font-semibold leading-7 text-slate-600">
          <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${accent}`} />
          {item}
        </li>
      ))}
    </ul>
  </article>
);

export default Join;

