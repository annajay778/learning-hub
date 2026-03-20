export interface Module {
  slug: string;
  title: string;
  description: string;
  icon: string;
  overview: string;
}

export const MODULES: Module[] = [
  {
    slug: "getting-set-up",
    title: "Getting Set Up",
    description:
      "Git, VS Code, environment, starter pack — the 2-hour learning curve.",
    icon: "terminal",
    overview: "",
  },
  {
    slug: "working-with-ai-engineer",
    title: "Working with Your AI Engineer",
    description:
      "How the PM/engineer dynamic changes when your partner builds at 10x speed.",
    icon: "users",
    overview: "",
  },
  {
    slug: "moving-fast",
    title: "Moving Fast",
    description:
      "What to skip, what not to skip, and how to stay aligned when everything ships in hours.",
    icon: "zap",
    overview: "",
  },
  {
    slug: "discovery-with-ai",
    title: "Discovery with AI",
    description:
      "From 55-source synthesis to prototypes as discovery artifacts.",
    icon: "search",
    overview: "",
  },
  {
    slug: "customer-engagement",
    title: "Customer Engagement",
    description:
      "Beta selection, live prototyping, driver's ed demos, feature flags.",
    icon: "handshake",
    overview: "",
  },
  {
    slug: "mistakes",
    title: "Mistakes & Course Corrections",
    description:
      "What went wrong, what we'd do differently, and why it matters.",
    icon: "alert-triangle",
    overview: "",
  },
  {
    slug: "prototypes",
    title: "Prototypes & Reference",
    description:
      "Architecture docs, prototype specs, and technical reference material.",
    icon: "layers",
    overview: "",
  },
];

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}
