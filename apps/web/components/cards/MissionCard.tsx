"use client";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import type { Mission } from "@/data/missions";

const MissionCard = ({ mission }: { mission: Mission }) => (
  <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.85)]">
    <span className="absolute inset-x-0 top-0 h-2 bg-red-600" aria-hidden="true" />
    <div className="mb-7 flex flex-wrap items-center gap-3">
      <span className="rounded bg-red-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-red-600">
        {mission.status}
      </span>
      <span className="rounded bg-slate-100 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
        {mission.duration}
      </span>
    </div>
    <h3 className="text-3xl font-black leading-tight text-slate-950">{mission.title}</h3>
    <p className="mt-5 text-base font-medium leading-8 text-slate-600">{mission.description}</p>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-black uppercase tracking-widest text-slate-500">
        <CalendarDays className="h-5 w-5 text-red-600" />
        {mission.duration}
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-black uppercase tracking-widest text-slate-500">
        <Users className="h-5 w-5 text-blue-500" />
        {mission.seats}
      </div>
    </div>
    <p className="mt-7 border-l-4 border-slate-950 pl-5 text-lg font-black leading-8 text-slate-950">
      {mission.outcome}
    </p>
    <Link
      href="/join"
      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600"
    >
      Apply for Mission 01
      <ArrowRight className="h-4 w-4" />
    </Link>
  </article>
);

export default MissionCard;


