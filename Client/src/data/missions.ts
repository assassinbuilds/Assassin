export type MissionDay = {
  day: number;
  title: string;
  goal: string;
  task: string;
  proof: string;
};

export type Mission = {
  title: string;
  slug: string;
  status: string;
  duration: string;
  seats: string;
  description: string;
  outcome: string;
  days: MissionDay[];
};

export const mission01: Mission = {
  title: "Mission 01: Founding Builder Batch",
  slug: "mission-01-founding-builder-batch",
  status: "Applications open",
  duration: "7 days",
  seats: "Limited seats",
  description:
    "A focused starter mission that helps students set up public proof, improve their profiles, ship a first project, and join a builder squad.",
  outcome:
    "By the end, every accepted builder should have a stronger GitHub, LinkedIn, portfolio base, deployed project, and a showcase-ready proof trail.",
  days: [
    {
      day: 1,
      title: "GitHub Setup",
      goal: "Create a clean builder identity.",
      task: "Set up or refresh GitHub, pin useful repositories, and add profile basics.",
      proof: "GitHub profile link with updated bio, links, and pinned work.",
    },
    {
      day: 2,
      title: "README Profile",
      goal: "Make your profile explain your builder story.",
      task: "Create a GitHub profile README that shows skills, current learning, and links.",
      proof: "Public profile README URL.",
    },
    {
      day: 3,
      title: "LinkedIn Upgrade",
      goal: "Turn LinkedIn into a student builder profile.",
      task: "Update headline, about section, skills, and featured links.",
      proof: "LinkedIn profile URL plus a short before/after note.",
    },
    {
      day: 4,
      title: "Portfolio Base",
      goal: "Create a simple place for your work.",
      task: "Build or refresh a portfolio homepage with bio, links, and project placeholders.",
      proof: "Portfolio repository or live preview link.",
    },
    {
      day: 5,
      title: "First Project",
      goal: "Ship one useful mini project.",
      task: "Build a small app, tool, resource, or experiment that solves a clear problem.",
      proof: "GitHub repository link with README and screenshots.",
    },
    {
      day: 6,
      title: "Deploy Live",
      goal: "Make the project accessible.",
      task: "Deploy the project and fix the README so anyone can run or view it.",
      proof: "Live URL plus repository URL.",
    },
    {
      day: 7,
      title: "Showcase Day",
      goal: "Share your proof and get reviewed.",
      task: "Post the project, submit proof, collect feedback, and prepare a showcase summary.",
      proof: "Final showcase post, live URL, repository URL, and lessons learned.",
    },
  ],
};

export const missionRules = [
  "Give at least 30 focused minutes daily.",
  "Submit public proof for every task.",
  "Ask for help early when blocked.",
  "Review at least one other builder during the mission.",
  "Keep work original, respectful, and safe to showcase.",
];

export const proofSystem = [
  "GitHub links",
  "Live project URLs",
  "Screenshots or short demos",
  "Daily notes",
  "Before/after profile updates",
];

export const upcomingMissions = [
  {
    title: "Open Source Lab",
    tag: "Contribution sprint",
    description: "Learn issues, pull requests, maintainers, and review etiquette through guided contributions.",
  },
  {
    title: "Portfolio Sprint",
    tag: "Career proof",
    description: "Turn projects, skills, and profiles into a clean portfolio that can be shared with mentors.",
  },
  {
    title: "AI Builder Week",
    tag: "Prototype sprint",
    description: "Build useful AI-powered tools while learning product thinking, safety, and deployment basics.",
  },
];
