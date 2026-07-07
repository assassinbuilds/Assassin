"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/sections/CTASection";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import { coreValues, memberLevels } from "@/data/brand";
import { eventHighlights } from "@/data/events";

const squads = [
  {
    title: "Builder Squads",
    description: "Small groups that keep members accountable during missions and project sprints.",
  },
  {
    title: "Review Circles",
    description: "Peer feedback loops for READMEs, profiles, portfolios, and project demos.",
  },
  {
    title: "Mission Leads",
    description: "Operators who help members understand tasks, submit proof, and keep momentum.",
  },
];

const rules = [
  "Respect every builder and keep feedback specific.",
  "Submit your own work and credit what you use.",
  "Ask clear questions and share what you tried.",
  "Keep community spaces safe for students, mentors, and partners.",
];

const Community = () => (
  <div className="min-h-screen bg-white text-slate-950">
    <Navbar dark={false} />
    <main>
      <PageHero
        eyebrow="Community"
        title={
          <>
            Squads for students who are ready to{" "}
            <span className="relative inline-block text-red-600">
              build
              <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
            </span>
          </>
        }
        description="Tech Assassin is not just a group chat. It is a mission-based community where squads, reviews, events, and proof help students keep moving."
        primaryCta={{ label: "Join the mission", href: "/join" }}
        secondaryCta={{ label: "View Missions", href: "/missions" }}
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Culture"
            title="Direction, accountability, teammates, and proof."
            description="The community exists to help students replace confusion with missions, peers, and a repeatable shipping rhythm."
          />
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
            {coreValues.map((value) => (
              <div key={value} className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-[0_22px_65px_-55px_rgba(15,23,42,0.8)]">
                <p className="text-sm font-black uppercase leading-6 tracking-[0.12em] text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="How it Works" title="Community structure that supports shipping." />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {squads.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_26px_75px_-55px_rgba(15,23,42,0.85)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <SectionHeader align="left" eyebrow="Member Levels" title="A path for growing leaders." />
            <div className="space-y-4">
              {memberLevels.map((level) => (
                <div key={level.name} className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black text-slate-950">{level.name}</h3>
                  <p className="mt-2 text-sm font-medium leading-7 text-slate-600">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader align="left" eyebrow="Community Rules" title="Simple rules for serious builders." />
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                  <p className="text-base font-semibold leading-7 text-slate-600">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Events" title="Challenges, workshops, and showcases keep the community alive." />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {eventHighlights.map((event) => (
              <article key={event.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_26px_75px_-55px_rgba(15,23,42,0.85)]">
                <span className="rounded bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  {event.status}
                </span>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-red-600">{event.type}</p>
                <h3 className="mt-3 text-2xl font-black text-slate-950">{event.title}</h3>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">{event.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Join the squad"
        title="A mission is easier when builders move together."
        description="Apply for Mission 01 and start building with a clear path, daily proof, and a student squad."
        ctaLabel="Apply for Mission 01"
        ctaHref="/join"
      />
    </main>
    <Footer />
  </div>
);

export default Community;

