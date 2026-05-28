import { Github, Heart, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CommunitySection = () => {
  return (
    <section id="community" className="bg-section-alt py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Open Source Community</span>
          </div>

          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Join the <span className="text-primary">Global Elite</span> Squad
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            TechAssassin is powered by a community of elite operatives. Join the mission,
            share intelligence, and evolve alongside the world's most capable builders.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/aryansondharva/TechAssassin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Github className="h-5 w-5" />
              Contribute on GitHub
            </a>
            <a
              href="https://discord.gg/S6V3KNUu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition-colors hover:bg-accent"
            >
              <Users className="h-5 w-5" />
              Join Community
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="mb-4 text-2xl font-bold text-foreground">
            Ready to Make an Impact?
          </h3>
          <p className="mb-6 text-muted-foreground">
            Whether you're a developer, designer, or enthusiast, there's a place for you in our community.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/aryansondharva/TechAssassin/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageSquare className="h-5 w-5" />
              Find an Issue to Solve
            </a>
            <a
              href="https://github.com/aryansondharva/TechAssassin/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition-colors hover:bg-accent"
            >
              <Heart className="h-5 w-5" />
              Contribution Guidelines
            </a>
          </div>
          <div className="mt-4">
            <Link
              to="/mentorship"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              <Users className="h-5 w-5" />
              Explore Mentor Program
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
