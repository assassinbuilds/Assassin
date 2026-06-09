import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MissionCard from "@/components/cards/MissionCard";
import CTASection from "@/components/sections/CTASection";
import FAQAccordion from "@/components/sections/FAQAccordion";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import StatsBar from "@/components/sections/StatsBar";
import { missionFaqs } from "@/data/faqs";
import { mission01, missionRules, proofSystem, upcomingMissions } from "@/data/missions";

const missionStats = [
  { value: "7", label: "mission days" },
  { value: "30m", label: "daily focus" },
  { value: "5+", label: "proof types" },
  { value: "01", label: "founding batch" },
];

const Missions = () => (
  <div className="min-h-screen bg-white text-slate-950">
    <Navbar dark={false} />
    <main>
      <PageHero
        eyebrow="Mission Control"
        title={
          <>
            Structured missions for students who want to{" "}
            <span className="relative inline-block text-red-600">
              build
              <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
            </span>
          </>
        }
        description="Tech Assassin missions turn learning into a clear journey: daily tasks, public proof, peer reviews, and a showcase-ready project trail."
        primaryCta={{ label: "Apply for Mission 01", href: "/join" }}
        secondaryCta={{ label: "Wall of Builders", href: "/builders" }}
      />

      <section className="bg-white pb-16">
        <div className="container mx-auto px-6">
          <StatsBar stats={missionStats} />
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Current Mission"
            title="Mission 01 starts with profile proof, then moves into shipping."
            description="The first batch is intentionally simple: set up identity, improve proof channels, build a small project, deploy it, and submit the final showcase."
          />
          <div className="mx-auto max-w-5xl">
            <MissionCard mission={mission01} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="7-Day Roadmap"
            title="One focused task each day."
            description="Every day has a clear goal, a build task, and proof to submit."
          />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mission01.days.map((day) => (
              <article key={day.day} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.85)]">
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    {String(day.day).padStart(2, "0")}
                  </span>
                  <span className="h-3 w-20 rounded-full bg-red-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">{day.title}</h3>
                <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-red-600">{day.goal}</p>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">{day.task}</p>
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Proof</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{day.proof}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <SectionHeader align="left" eyebrow="Mission Rules" title="Simple rules keep the batch moving." />
            <div className="space-y-4">
              {missionRules.map((rule) => (
                <div key={rule} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-red-600" />
                  <p className="text-base font-semibold leading-7 text-slate-600">{rule}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader align="left" eyebrow="Proof System" title="Every task ends with visible proof." />
            <div className="grid gap-4 sm:grid-cols-2">
              {proofSystem.map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-55px_rgba(15,23,42,0.8)]">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Upcoming Missions"
            title="The platform can grow one mission at a time."
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {upcomingMissions.map((mission) => (
              <article key={mission.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_26px_75px_-55px_rgba(15,23,42,0.85)]">
                <span className="rounded bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  {mission.tag}
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{mission.title}</h3>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">{mission.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="FAQ" title="Mission questions" />
          <FAQAccordion items={missionFaqs} />
        </div>
      </section>

      <CTASection
        eyebrow="Mission 01"
        title="Apply, complete daily proof, and earn a place on the Wall of Builders."
        description="The first batch turns beginner energy into a visible builder profile and a shipped project."
        ctaLabel="Apply for Mission 01"
        ctaHref="/join"
      />
    </main>
    <Footer />
  </div>
);

export default Missions;
