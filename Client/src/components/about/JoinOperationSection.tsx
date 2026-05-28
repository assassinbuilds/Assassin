import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

const JoinOperationSection = () => (
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
);

export default JoinOperationSection;
