"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

const PageHero = ({ eyebrow, title, description, primaryCta, secondaryCta }: PageHeroProps) => (
  <section className="relative overflow-hidden bg-white pt-32 pb-16 md:pt-36 md:pb-20">
    <div className="container relative mx-auto px-6 text-center">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-red-600">
        {eyebrow}
      </p>
      <h1 className="mx-auto max-w-5xl text-[2.6rem] font-black leading-[0.98] text-slate-950 sm:text-5xl md:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-600 md:text-lg">
        {description}
      </p>

      {(primaryCta || secondaryCta) && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex h-14 items-center justify-center rounded-lg border border-slate-200 bg-white px-7 text-sm font-black uppercase tracking-widest text-slate-950 transition-colors hover:bg-slate-50"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  </section>
);

export default PageHero;


