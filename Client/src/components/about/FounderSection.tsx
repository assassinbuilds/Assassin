import MemberCard from "./MemberCard";
import { founderMember } from "./aboutData";

const FounderSection = () => (
  <section className="relative overflow-hidden bg-white py-24 text-slate-950">
    <div className="container relative mx-auto px-6 text-center">
      <h2 className="text-4xl font-black md:text-5xl">In memory of every unfinished idea</h2>
      <div className="mt-12 flex justify-center">
        <MemberCard member={founderMember} featured />
      </div>
    </div>
  </section>
);

export default FounderSection;
