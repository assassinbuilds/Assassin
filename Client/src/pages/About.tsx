import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Github,
  Linkedin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type Member = {
  name: string;
  role: string;
  seed: string;
  accent: string;
  image?: string;
  links?: {
    portfolio?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
};

const team: Member[] = [
  {
    name: "Manthan Rajpurohit",
    role: "Co-Founder",
    seed: "manthan",
    accent: "bg-red-600",
    image: "/manthan.png",
  },
  {
    name: "Aryan Sondharva",
    role: "Founder",
    seed: "aryan",
    accent: "bg-red-600",
    image: "/founder.png",
    links: {
      portfolio: "https://aryan-sondharva.vercel.app/",
      discord: "https://discord.gg/S6V3KNUu",
      github: "https://github.com/aryansondharva",
      twitter: "https://x.com/aryansondharva",
      linkedin: "https://www.linkedin.com/in/aryan-sondharva",
    },
  },
];

const advisors: Member[] = [
 // { name: "Akash N.", role: "Product Advisor", seed: "akash", accent: "bg-blue-600", image: "/advisor.png" },
];

const stats = [
  // { label: "Operatives", value: "168+" },
  // { label: "Active Missions", value: "23" },
  // { label: "Countries", value: "50+" },
  // { label: "Build Hours", value: "8k+" },
];

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar dark={false} />

      <main>
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
            <p className="mx-auto mt-8 max-w-3xl text-base font-semibold leading-8 text-slate-600 md:text-lg">
              We believe every student has the potential to build something meaningful. Tech Assassin exists to give builders the right environment, team, mentorship, and opportunities to bring their ideas to life. From coding missions and open-source contributions to hackathons, workshops, and project showcases — we help students move from learning to building.
            </p>
          </div>
        </section>

        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <SectionHeader eyebrow=""  title="Advisors" />
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
              {advisors.map((member) => (
                <MemberCard key={member.name} member={member} compact />
              ))}
            </div>
          </div>
        </section> */}

        <section className="relative overflow-hidden bg-white py-24 text-slate-950">
          <div className="container relative mx-auto px-6 text-center">
            <h2 className="text-4xl font-black md:text-5xl">In memory of every unfinished idea</h2>

            <div className="mt-12 flex justify-center">
              <MemberCard
                member={{
                  name: "Aryan Sondharva",
                  role: "Founder",
                  seed: "aryan-founder",
                  accent: "bg-red-600",
                  image: "/founder.png",
                  links: {
                    portfolio: "https://aryan-sondharva.vercel.app/",
                    discord: "https://discord.gg/S6V3KNUu",
                    github: "https://github.com/aryansondharva",
                    twitter: "https://x.com/aryansondharva",
                    linkedin: "https://www.linkedin.com/in/aryan-sondharva",
                  },
                }}
                featured
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-24">
          <div className="container relative mx-auto px-6 text-center">
            <Users className="mx-auto mb-6 h-10 w-10 text-red-600" />
            <h2 className="text-4xl font-black md:text-6xl">
              Join us in our <span className="text-red-600">next operation</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
              Developers, designers, mentors, and organizers all have a place here. Bring your skill, pick a mission, and build with people who care about the craft.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-red-600 px-6 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-red-700"
              >
                Join Squad <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/mentorship"
                className="inline-flex items-center gap-2 border border-slate-200 bg-white px-6 py-3 text-sm font-black uppercase text-slate-900 transition-colors hover:bg-slate-50"
              >
                Meet Mentors
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mx-auto mb-12 max-w-3xl text-center">
    <span className="text-[10px] font-black uppercase text-red-600">{eyebrow}</span>
    <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{title}</h2>
  </div>
);

const MemberCard = ({
  member,
  compact = false,
  featured = false,
}: {
  member: Member;
  compact?: boolean;
  featured?: boolean;
}) => {
  const socialLinks = [
    { label: "X", href: member.links?.twitter, icon: XIcon },
    { label: "Discord", href: member.links?.discord, icon: DiscordIcon },
    { label: "GitHub", href: member.links?.github, icon: Github },
    { label: "LinkedIn", href: member.links?.linkedin, icon: Linkedin },
  ];

  return (
    <article
      className={`group relative mx-auto flex w-full max-w-[16rem] flex-col items-center rounded-lg border bg-white px-7 pb-7 pt-7 text-center transition-all hover:-translate-y-1 ${
        featured
          ? "border-white/20 shadow-2xl shadow-black/30"
          : "border-slate-200 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)] hover:border-red-200 hover:shadow-xl"
      }`}
    >
      <a
        href={member.links?.portfolio}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name} portfolio`}
        className={`relative ${member.links?.portfolio ? "" : "pointer-events-none"}`}
      >
        <div className="h-36 w-36 overflow-hidden rounded-full bg-slate-100 ring-8 ring-slate-50">
          <img
            src={member.image ?? avatarUrl(member.seed)}
            alt={`${member.name} avatar`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className={`absolute -bottom-3 left-1/2 flex min-w-[8.5rem] -translate-x-1/2 justify-center rounded px-3 py-1.5 text-sm font-black text-white ${member.accent}`}>
          {member.name}
        </div>
      </a>
      <p className="mt-7 text-xs font-black uppercase text-slate-950">{member.role}</p>
      <div className={`mt-8 flex items-center justify-center gap-5 ${compact ? "opacity-90" : ""}`}>
        {socialLinks.map(({ label, href, icon: Icon }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} ${label}`}
              className="text-slate-400 transition-colors hover:text-red-600"
            >
              <Icon className="h-6 w-6" />
            </a>
          ) : (
            <button
              key={label}
              type="button"
              aria-label={`${member.name} ${label}`}
              disabled
              className="text-slate-300"
            >
              <Icon className="h-6 w-6" />
            </button>
          )
        )}
      </div>
    </article>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.08.08 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.06.06 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.08.08 0 0 0 .084-.028 14.1 14.1 0 0 0 1.226-1.994.08.08 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.08.08 0 0 1-.008-.128c.126-.094.251-.192.372-.292a.07.07 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .078.01c.12.1.246.198.373.292a.08.08 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.08.08 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.08.08 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
  </svg>
);

export default About;
