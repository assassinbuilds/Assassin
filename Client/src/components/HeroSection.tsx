import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-white"
    >
      <DecorativeMarks />

      <div className="container relative z-10 mx-auto px-6 pt-28 pb-20 text-center md:pt-32">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-normal leading-[1.08] text-slate-800 md:text-7xl">
            Turning{" "}
            <span className="font-black text-slate-950">learners</span> into
            builders with{" "}
            <span className="relative inline-block font-black text-slate-950">
              real missions
              <span className="absolute -bottom-1 left-0 right-0 h-2 bg-red-500" />
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Tech Assassin gives students the team, mentorship, feedback, and
            project runway they need to move from learning to building.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-xl">
          <p className="mb-5 text-sm font-black uppercase text-slate-800">
            Join us
          </p>
          <form action="/signup" className="flex items-center justify-center gap-4">
            <label className="sr-only" htmlFor="hero-email">
              Email address
            </label>
            <input
              id="hero-email"
              name="email"
              type="email"
              placeholder="Your email"
              className="h-16 min-w-0 flex-1 rounded-lg border border-slate-100 bg-white px-7 text-lg font-medium text-slate-900 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.65)] outline-none transition-colors placeholder:text-slate-400 focus:border-red-300"
            />
            <button
              type="submit"
              aria-label="Join Tech Assassin"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
            >
              <ArrowRight className="h-7 w-7" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const DecorativeMarks = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
    <FloatingMask
      className="left-[19%] top-[38%] hidden md:block"
      body="bg-emerald-400"
      accent="border-emerald-500"
      rotate="-rotate-12"
    />
    <FloatingMask
      className="left-[31%] top-[19%] hidden lg:block"
      body="bg-yellow-100"
      accent="border-yellow-200"
      rotate="-rotate-6"
    />
    <FloatingMask
      className="right-[41%] top-[18%] hidden md:block"
      body="bg-orange-300"
      accent="border-orange-300"
      rotate="rotate-6"
    />
    <FloatingMask
      className="right-[18%] top-[30%] hidden lg:block"
      body="bg-yellow-300"
      accent="border-emerald-400"
      rotate="-rotate-6"
    />
    <div className="absolute left-[31%] bottom-[30%] hidden h-16 w-16 rotate-[66deg] rounded-tl-[3rem] rounded-tr-md bg-blue-500/70 md:block" />
    <div className="absolute right-[29%] top-[36%] hidden h-11 w-16 rounded-t-full bg-blue-500/70 lg:block" />
    <div className="absolute right-[27%] top-[49%] hidden h-28 w-28 rotate-12 bg-yellow-100 [clip-path:polygon(50%_0%,59%_24%,85%_15%,75%_41%,100%_50%,75%_59%,85%_85%,59%_76%,50%_100%,41%_76%,15%_85%,25%_59%,0%_50%,25%_41%,15%_15%,41%_24%)] md:block" />
    <div className="absolute bottom-[-2rem] left-[8%] hidden h-20 w-20 rotate-12 rounded-tl-[4rem] rounded-tr-sm bg-blue-500/70 lg:block" />
  </div>
);

const FloatingMask = ({
  className,
  body,
  accent,
  rotate,
}: {
  className: string;
  body: string;
  accent: string;
  rotate: string;
}) => (
  <div className={`absolute ${className} ${rotate}`}>
    <div className={`relative h-16 w-28 overflow-hidden rounded-b-full rounded-t-md ${body}`}>
      <span className="absolute left-9 top-4 h-8 w-12 rounded-b-full border-b-[4px] border-slate-800" />
      <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-slate-800" />
      <span className="absolute right-2 top-4 h-1.5 w-1.5 rounded-full bg-slate-800" />
    </div>
    <span className={`absolute -left-3 bottom-3 h-9 w-9 rounded-full border-l-4 ${accent}`} />
    <span className="absolute left-10 -top-4 h-9 w-5 rounded-b-full border-b-4 border-l-4 border-slate-800" />
  </div>
);

export default HeroSection;
