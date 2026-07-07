"use client";
import MemberCard from "./MemberCard";
import { teamMembers } from "./aboutData";

const MembersSection = () => (
  <section className="relative pb-20">
    <div className="container mx-auto px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  </section>
);

export default MembersSection;

