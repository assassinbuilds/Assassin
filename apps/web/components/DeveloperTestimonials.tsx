"use client";
import { Code2, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Full-stack Developer",
    quote:
      "Tech Assassin gives builders the rare mix of pressure, guidance, and community. It feels like a place where shipping real work is the default.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aarav",
    accent: "text-blue-600",
  },
  {
    name: "Nisha Rao",
    role: "Open-source Contributor",
    quote:
      "The missions are practical and the feedback loop is fast. I joined for events, but stayed because the community keeps me improving.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nisha",
    accent: "text-emerald-600",
  },
  {
    name: "Karan Shah",
    role: "AI Builder",
    quote:
      "It is the kind of squad that makes ambitious projects feel less lonely. You get peers, mentors, and a reason to finish what you start.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karan",
    accent: "text-primary",
  },
];

const DeveloperTestimonials = () => {
  return (
    <section id="developers-say" className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">

          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            What Developers Say
          </h2>

          <p className="text-hero-muted text-lg leading-relaxed max-w-2xl">
            Real momentum comes from the people building beside you. These are the voices this community is designed for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)] transition-colors hover:border-red-200"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <Quote className={`w-8 h-8 ${testimonial.accent}`} />
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  className="h-12 w-12 rounded-full border border-slate-200 bg-slate-50"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-heading font-semibold text-hero-foreground">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-hero-muted">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperTestimonials;

