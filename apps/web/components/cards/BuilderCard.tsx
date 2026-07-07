"use client";
import { ExternalLink, Github, Linkedin } from "lucide-react";

type Builder = {
  name: string;
  role: string;
  level: string;
  proof: string;
  github: string;
  linkedin: string;
  project: string;
  tech: string[];
};

const BuilderCard = ({ builder }: { builder: Builder }) => (
  <article className="group rounded-lg border border-slate-200 bg-white p-7 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.85)] transition-all hover:-translate-y-1 hover:border-slate-950">
    <div className="mb-6 flex items-start justify-between gap-5">
      <div>
        <span className="rounded bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-red-600">
          {builder.level}
        </span>
        <h3 className="mt-5 text-2xl font-black text-slate-950">{builder.name}</h3>
        <p className="mt-1 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
          {builder.role}
        </p>
      </div>
      <ExternalLink className="h-5 w-5 text-slate-300 transition-colors group-hover:text-red-600" />
    </div>
    <p className="text-base font-medium leading-7 text-slate-600">{builder.proof}</p>
    <div className="mt-6 rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Featured project</p>
      <p className="mt-2 text-lg font-black text-slate-950">{builder.project}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {builder.tech.map((item) => (
          <span key={item} className="rounded bg-white px-2.5 py-1 text-xs font-black text-slate-500">
            {item}
          </span>
        ))}
      </div>
    </div>
    <div className="mt-6 flex gap-3">
      <a
        href={builder.github}
        target="_blank"
        rel="noreferrer"
        aria-label={`${builder.name} GitHub`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-950 hover:text-slate-950"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        href={builder.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label={`${builder.name} LinkedIn`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-500 hover:text-blue-500"
      >
        <Linkedin className="h-5 w-5" />
      </a>
    </div>
  </article>
);

export default BuilderCard;

