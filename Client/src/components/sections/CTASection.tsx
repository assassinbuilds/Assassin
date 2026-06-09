import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type CTASectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const CTASection = ({ eyebrow, title, description, ctaLabel, ctaHref }: CTASectionProps) => (
  <section className="bg-yellow-300 py-20 md:py-24">
    <div className="container mx-auto px-6 text-center">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-800">
        {eyebrow}
      </p>
      <h2 className="mx-auto max-w-4xl text-[2.25rem] font-black leading-tight text-slate-950 sm:text-[2.8rem] md:text-[3.25rem]">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
        {description}
      </p>
      <Link
        to={ctaHref}
        className="mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

export default CTASection;
