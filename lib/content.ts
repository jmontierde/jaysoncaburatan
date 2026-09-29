export const site = {
  name: "Jayson Caburatan",
  role: "Lead Full-Stack Web Developer",
  email: "caburatanjayson92@gmail.com",
  github: "https://github.com/jmontierde",
  linkedin: "https://www.linkedin.com/in/jayson-caburatan-035342268",
  portfolio: "https://jayson-caburatan-portfolio.vercel.app/",
  resume: "/jayson-caburatan-resume.pdf",
  location: "Philippines · Remote",
  portrait: "/portrait.jpg",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  "4+ Years Experience",
  "Multiple Production Applications",
  "Full-Stack + AI",
  "Remote / Global Collaboration",
] as const;

export const experiences = [
  {
    role: "Assistant Lead Web Application Developer",
    company: "Alpha Supreme Services",
    location: "Remote",
    dates: "May 2026 — Present",
    summary:
      "Architecture, standards, and delivery for payroll, HR, and business management systems.",
    points: [
      "Design scalable web application architecture and the development standards the team builds against.",
      "Lead and mentor developers through planning, code reviews, hiring, and onboarding.",
      "Build payroll, HR, and business management systems, including HRIS and point-of-sale workflows.",
      "Collaborate with stakeholders to plan features and deliver them cleanly.",
      "Improve application workflows and the experience of the people using them every day.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Tito Solutions",
    location: "Remote",
    dates: "Jan 2025 — Apr 2026",
    summary: "Production SaaS and a mobile restaurant ordering system.",
    points: [
      "Maintained and enhanced production SaaS applications with Next.js, TypeScript, Supabase, and React Native.",
      "Redesigned interfaces with Tailwind CSS and shadcn/ui to improve performance and usability.",
      "Worked in Agile teams on sprint planning, code review, and continuous deployment.",
      "Developed a mobile restaurant ordering system, including order flows and backend integration.",
    ],
  },
  {
    role: "AI Software Engineer",
    company: "Accelerated Fleet Services",
    location: "Remote",
    dates: "Sep 2025 — Feb 2026",
    summary: "Fleet management software and a voice AI copilot.",
    points: [
      "Led frontend development for a fleet platform with Next.js, React, TypeScript, and Tailwind CSS.",
      "Shipped service orders, inventory, and technician management with Node.js, Express, and PostgreSQL.",
      "Built a voice AI copilot in React Native and improved client performance with Zustand and React Query.",
    ],
  },
] as const;

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  orientation: "landscape" | "portrait";
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  description: string[];
  highlights: string[];
  tech: string[];
  image?: string;
  imageAlt?: string;
  /** Ordered frames for the work index and case study. Add, remove, or swap images here. `orientation` sets the tile shape in the index. */
  gallery: GalleryImage[];
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "sellora",
    index: "01",
    title: "Sellora",
    summary: "AI-powered eCommerce SaaS platform.",
    description: [
      "Sellora helps merchants launch and run an online store from one product. The storefront, catalog, orders, customers, and analytics sit next to AI tools for copy and support.",
      "I designed the product architecture and built the application with Next.js, Convex, and Clerk — from the merchant dashboard through the public shop.",
    ],
    highlights: [
      "Merchant dashboard for products, orders, customers, and analytics",
      "AI copywriting and a storefront chatbot",
      "Authenticated, multi-merchant SaaS on Convex and Clerk",
    ],
    tech: ["Next.js", "Convex", "Clerk", "AI"],
    image: "/work/sellora/cover.jpg",
    imageAlt: "Sellora merchant dashboard with revenue, orders, and products",
    liveUrl: "https://sellora-app.vercel.app",
    repoUrl: "https://github.com/jmontierde/sellora",
    gallery: [
      {
        src: "/work/sellora/cover.jpg",
        alt: "Sellora dashboard overview from the previous portfolio",
        caption: "Merchant overview",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/store.jpg",
        alt: "Sellora merchant storefront with product cards and cart",
        caption: "Public storefront",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/dashboard.jpg",
        alt: "Sellora merchant dashboard",
        caption: "Merchant dashboard",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/products.jpg",
        alt: "Sellora product management screen",
        caption: "Catalog",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/orders.jpg",
        alt: "Sellora orders screen",
        caption: "Orders",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/customers.jpg",
        alt: "Sellora customers screen",
        caption: "Customers",
        orientation: "landscape",
      },
      {
        src: "/work/sellora/analytics.jpg",
        alt: "Sellora analytics screen",
        caption: "Analytics",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "spendwise",
    index: "02",
    title: "SpendWise",
    summary: "AI-powered expense tracking and financial insights platform.",
    description: [
      "SpendWise is a personal finance product for tracking spending, budgets, and savings, with insights that explain where the money goes.",
      "The same product runs on the web and on mobile. Convex keeps expenses, budgets, and accounts reactive. Clerk handles sign-in. AI turns the ledger into something a person can act on.",
    ],
    highlights: [
      "Dashboard, expenses, budgets, and savings in one flow",
      "Web and mobile clients on a shared backend",
      "AI insights grounded in the user’s own transactions",
    ],
    tech: ["Next.js", "Convex", "Clerk", "AI"],
    image: "/work/spendwise/web.jpg",
    imageAlt: "SpendWise web application",
    liveUrl: "https://spend-wise-web-rho.vercel.app",
    repoUrl: "https://github.com/jmontierde/spend-wise",
    gallery: [
      {
        src: "/work/spendwise/web.jpg",
        alt: "SpendWise web application",
        caption: "Web app",
        orientation: "landscape",
      },
      {
        src: "/work/spendwise/dashboard.jpg",
        alt: "SpendWise mobile dashboard showing monthly spend and recent expenses",
        caption: "Mobile dashboard",
        orientation: "portrait",
      },
      {
        src: "/work/spendwise/insights.jpg",
        alt: "SpendWise insights screen",
        caption: "Insights",
        orientation: "portrait",
      },
      {
        src: "/work/spendwise/budget.jpg",
        alt: "SpendWise budget overview",
        caption: "Budgets",
        orientation: "portrait",
      },
      {
        src: "/work/spendwise/savings.jpg",
        alt: "SpendWise savings screen",
        caption: "Savings",
        orientation: "portrait",
      },
      {
        src: "/work/spendwise/expense.jpg",
        alt: "SpendWise add expense screen",
        caption: "Add an expense",
        orientation: "portrait",
      },
    ],
  },
  {
    slug: "worklyst",
    index: "03",
    title: "Worklyst",
    summary: "Multi-tenant SaaS platform.",
    description: [
      "Worklyst is a workspace for teams that need projects, tasks, members, and billing kept inside a single organization — with every tenant isolated.",
      "Owners and admins get a live picture of delivery: project health, task status, membership, and subscription state. Clerk supplies organization identity. Convex keeps the workspace reactive.",
    ],
    highlights: [
      "Organization-scoped projects, tasks, and members",
      "Role-based access and audit history",
      "Billing and workspace settings in the same product",
    ],
    tech: ["Next.js", "Convex"],
    image: "/work/worklyst/dashboard.jpg",
    imageAlt:
      "Worklyst organization dashboard with project progress and task health",
    liveUrl: "https://worklyst-six.vercel.app/",
    gallery: [
      {
        src: "/work/worklyst/dashboard.jpg",
        alt: "Worklyst organization dashboard",
        caption: "Organization dashboard",
        orientation: "landscape",
      },
      {
        src: "/work/worklyst/projects.jpg",
        alt: "Worklyst projects screen",
        caption: "Projects",
        orientation: "landscape",
      },
      {
        src: "/work/worklyst/tasks.jpg",
        alt: "Worklyst tasks screen",
        caption: "Tasks",
        orientation: "landscape",
      },
      {
        src: "/work/worklyst/members.jpg",
        alt: "Worklyst members settings",
        caption: "Members",
        orientation: "landscape",
      },
      {
        src: "/work/worklyst/billing.jpg",
        alt: "Worklyst billing settings",
        caption: "Billing",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "tutorai",
    index: "04",
    title: "TutorAI",
    summary: "Learning platform with an AI voice companion.",
    description: [
      "TutorAI is a learning product built around an AI voice companion that teaches, answers questions, and keeps a lesson interactive.",
      "Learners pick a companion, start a live session, and track progress. The app runs on Next.js with Supabase, PostgreSQL, and Vapi for the voice layer.",
    ],
    highlights: [
      "Voice sessions with an AI tutor",
      "Companion library and a personal learning journey",
      "Next.js, Supabase, and PostgreSQL",
    ],
    tech: ["Next.js", "Supabase", "PostgreSQL", "Vapi"],
    image: "/work/tutorai/cover.jpg",
    imageAlt: "TutorAI homepage with AI companion cards",
    liveUrl: "https://tutor-ai-saas.vercel.app/",
    repoUrl: "https://github.com/jmontierde/teaching-saas-platform",
    gallery: [
      {
        src: "/work/tutorai/cover.jpg",
        alt: "TutorAI homepage introducing the AI companion",
        caption: "Home",
        orientation: "landscape",
      },
      {
        src: "/work/tutorai/home.jpg",
        alt: "TutorAI home screen",
        caption: "Product home",
        orientation: "landscape",
      },
      {
        src: "/work/tutorai/library.jpg",
        alt: "TutorAI companion library",
        caption: "Companion library",
        orientation: "landscape",
      },
      {
        src: "/work/tutorai/session.jpg",
        alt: "TutorAI live voice session",
        caption: "Live session",
        orientation: "landscape",
      },
      {
        src: "/work/tutorai/journey.jpg",
        alt: "TutorAI learning journey",
        caption: "My journey",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "sentiai",
    index: "05",
    title: "SentiAI",
    summary: "Mental health companion for reflective conversation.",
    description: [
      "SentiAI is a companion for supportive conversation — a place to reflect, name what you’re feeling, and feel heard.",
      "The product is a Next.js app on the OpenAI API, with conversation history and model selection kept in one calm interface.",
    ],
    highlights: [
      "Ongoing supportive conversations",
      "History and model selection in the same session",
      "Next.js and the OpenAI API",
    ],
    tech: ["Next.js", "OpenAI", "Tailwind CSS"],
    image: "/work/sentiai/cover.jpg",
    imageAlt: "SentiAI shown on a laptop and phone",
    liveUrl: "https://senti-app-teal.vercel.app/",
    gallery: [
      {
        src: "/work/sentiai/cover.jpg",
        alt: "SentiAI portfolio image with laptop and phone",
        caption: "Product",
        orientation: "portrait",
      },
      {
        src: "/work/sentiai/conversation.jpg",
        alt: "SentiAI conversation screen",
        caption: "Conversation",
        orientation: "landscape",
      },
      {
        src: "/work/sentiai/history.jpg",
        alt: "SentiAI conversation history",
        caption: "History",
        orientation: "landscape",
      },
      {
        src: "/work/sentiai/models.jpg",
        alt: "SentiAI model selection",
        caption: "Model selection",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "delicia",
    index: "06",
    title: "Delicia",
    summary: "Recipe app for discovering and cooking dishes.",
    description: [
      "Delicia is a recipe product for finding dishes and following them through to the plate.",
      "It is a Next.js app focused on a clear browse-and-cook flow, deployed on Vercel.",
    ],
    highlights: [
      "Recipe discovery",
      "A simple path from dish to instructions",
      "Next.js and Tailwind CSS",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/work/delicia/cover.jpg",
    imageAlt: "Delicia homepage, Delicious Food, Healthy Food",
    liveUrl: "https://delicia-recipes.vercel.app/",
    repoUrl: "https://github.com/jmontierde/delicia-recipes",
    gallery: [
      {
        src: "/work/delicia/cover.jpg",
        alt: "Delicia homepage with a food photograph and headline",
        caption: "Home",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "vaping-sidewalk",
    index: "07",
    title: "Vaping Sidewalk",
    summary: "E-commerce site for browsing and buying vaping products.",
    description: [
      "Vaping Sidewalk is an online shop for browsing the catalog and checking out.",
      "The storefront is React, with a Node.js and Express API and MongoDB behind the catalog.",
    ],
    highlights: [
      "Product browsing and checkout",
      "React storefront with a Node.js API",
      "MongoDB for catalog data",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB"],
    image: "/work/vaping/cover.jpg",
    imageAlt: "Vaping Sidewalk storefront",
    liveUrl: "https://vapingsidewalk-client.onrender.com/",
    gallery: [
      {
        src: "/work/vaping/cover.jpg",
        alt: "Vaping Sidewalk e-commerce homepage",
        caption: "Storefront",
        orientation: "landscape",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function adjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? projects[index - 1] : null,
    next:
      index >= 0 && index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export const technologies = [
  {
    name: "React",
    detail: "The interface layer for the products I design and ship.",
  },
  {
    name: "Next.js",
    detail: "Where most of my production web apps live — routing, rendering, and deployment.",
  },
  {
    name: "TypeScript",
    detail: "The default for application code, so systems stay explicit as they grow.",
  },
  {
    name: "Node.js",
    detail: "APIs, integrations, and the server-side work behind the interface.",
  },
  {
    name: "PostgreSQL",
    detail: "Relational data for products that need clear ownership and reporting.",
  },
  {
    name: "Convex",
    detail: "Realtime application state for SaaS products that should feel immediate.",
  },
  {
    name: "Supabase",
    detail: "Postgres, auth, and storage when a product needs a familiar backend.",
  },
  {
    name: "React Native",
    detail: "Mobile products — ordering, finance, charging, and field tools.",
  },
  {
    name: "Tailwind CSS",
    detail: "A fast, consistent way to build interfaces I can still maintain.",
  },
  {
    name: "Three.js",
    detail: "Spatial interfaces when depth helps the product, used with restraint.",
  },
  {
    name: "OpenAI",
    detail: "Model APIs inside products, always behind review and product constraints.",
  },
  {
    name: "Stripe",
    detail: "Subscriptions and payments for SaaS and transactional products.",
  },
  {
    name: "Clerk",
    detail: "Authentication and organizations for multi-tenant applications.",
  },
  {
    name: "Vercel",
    detail: "The place I ship, preview, and keep frontend releases boring.",
  },
] as const;

export const principles = [
  {
    index: "01",
    title: "Build for scale",
    text: "Architecture that can grow with the product.",
  },
  {
    index: "02",
    title: "Keep it simple",
    text: "Clean solutions over unnecessary complexity.",
  },
  {
    index: "03",
    title: "Ship with quality",
    text: "Performance, accessibility, testing, and maintainability matter.",
  },
  {
    index: "04",
    title: "Use AI intelligently",
    text: "AI accelerates development, but every generated solution is reviewed, tested, and validated.",
  },
] as const;

export const workflow = [
  {
    title: "Idea",
    text: "Name the user, the job, and the constraint that actually matters.",
  },
  {
    title: "AI-assisted development",
    text: "Use models to explore options and draft faster. They do not own the design.",
  },
  {
    title: "Review",
    text: "Read the solution. Architecture, security, and edge cases stay a human decision.",
  },
  {
    title: "Testing",
    text: "Prove the behavior — including failure, performance, and access.",
  },
  {
    title: "Validation",
    text: "Check it against the product and the people who will maintain it.",
  },
  {
    title: "Production",
    text: "Ship something that can be operated, not just demonstrated.",
  },
] as const;

export const aiTools = [
  "ChatGPT",
  "Claude",
  "Claude Code",
  "Codex",
  "OpenAI APIs",
  "n8n",
] as const;

export const services = [
  {
    title: "Full-Stack Web Applications",
    text: "Product surfaces and the APIs, data, and auth behind them.",
  },
  {
    title: "SaaS Products",
    text: "Multi-tenant systems with roles, billing, and a path to grow.",
  },
  {
    title: "AI-Powered Applications",
    text: "Models inside a real workflow, reviewed before they reach a user.",
  },
  {
    title: "Internal Business Tools",
    text: "Software for payroll, HR, and the operations a company runs on.",
  },
  {
    title: "Dashboards & Admin Systems",
    text: "Clear operational views for the people managing the work.",
  },
  {
    title: "API Integrations",
    text: "Payments, messaging, maps, and the other systems a product depends on.",
  },
  {
    title: "Restaurant / Ordering Systems",
    text: "Guest ordering and the kitchen and floor tools that fulfill it.",
  },
  {
    title: "Mobile Applications",
    text: "React Native products that share a backend with the web.",
  },
  {
    title: "Automation Systems",
    text: "Workflows that connect tools, with a dashboard a person can trust.",
  },
] as const;
