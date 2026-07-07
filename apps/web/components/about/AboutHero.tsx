"use client";
const AboutHero = () => (
  <section className="relative overflow-hidden pt-36 pb-20">
    <div className="absolute inset-x-0 top-0 h-40 bg-white" />
    <div className="container relative mx-auto px-6 text-center">
      <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
        We build the squad behind the{" "}
        <span className="relative inline-block text-red-600">
          missions
          <span className="absolute -bottom-1 left-1 right-1 h-2 bg-red-200/80" />
        </span>
      </h1>
      <p className="mx-auto mt-8 max-w-6xl text-center text-base font-semibold leading-8 text-slate-600 md:text-lg">
        <span className="block">We believe every student has the potential to build something meaningful. Tech Assassin exists to give builders</span>
        <span className="block">the right environment, team, mentorship, and opportunities to bring their ideas to life. From coding missions</span>
        <span className="block">and open-source contributions to hackathons, workshops, and project showcases &mdash; <strong className="font-black text-slate-950">We turn learners into builders.</strong></span>
      </p>
    </div>
  </section>
);

export default AboutHero;

