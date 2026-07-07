"use client";
import { ArrowRight, FileText } from "lucide-react";

type Resource = {
  title: string;
  category: string;
  description: string;
  format: string;
  href: string;
};

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <article id={resource.href.split("#")[1]} className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_26px_75px_-55px_rgba(15,23,42,0.85)]">
    <div className="mb-6 flex items-center justify-between gap-4">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <FileText className="h-5 w-5" />
      </span>
      <span className="rounded bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {resource.format}
      </span>
    </div>
    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-red-600">
      {resource.category}
    </p>
    <h3 className="text-2xl font-black leading-tight text-slate-950">{resource.title}</h3>
    <p className="mt-4 text-base font-medium leading-7 text-slate-600">{resource.description}</p>
    <a
      href={resource.href}
      className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-950 transition-colors hover:text-red-600"
    >
      Open resource
      <ArrowRight className="h-4 w-4" />
    </a>
  </article>
);

export default ResourceCard;

