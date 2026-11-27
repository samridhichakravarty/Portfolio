// Real portfolio content. Nothing here is invented: it comes from Samridhi's own projects and profile.

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  highlights: string[];
  stack: string[];
  repo: string;
  hue: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "enterprise-web-platform",
    number: "01",
    title: "Enterprise Web Platform",
    category: "Full-stack platform",
    summary: "Careers management, EOR and HRO calculators and AI-assisted blog generation in one platform.",
    description:
      "One platform for careers management, EOR and HRO calculators, and AI-assisted blog generation. A JWT-protected admin dashboard brings CRM, content management, and automated email workflows together.",
    highlights: [
      "Careers area with open roles, applications and an interview pipeline",
      "EOR and HRO cost calculators that break down estimated costs",
      "AI-assisted blog drafting with review before publishing",
      "JWT-protected admin dashboard with CRM, content management and email workflows",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel", "Groq", "JWT", "Resend"],
    repo: "https://github.com/samridhichakravarty/Enterprise",
    hue: "from-pink to-fuchsia",
  },
  {
    slug: "real-time-chat-application",
    number: "02",
    title: "Real-Time Chat Application",
    category: "Real-time messaging",
    summary: "Direct and group chat with live presence, typing and delivery indicators and file sharing.",
    description:
      "Direct and group conversations with live presence, typing and delivery indicators, and file sharing. JWT authentication, role-based authorization, and persistent chat history support both conversation types.",
    highlights: [
      "Direct and group conversations",
      "Live presence, typing and delivery indicators",
      "File sharing with Cloudinary",
      "JWT authentication, role-based authorization and saved chat history",
    ],
    stack: ["JavaScript", "Node.js", "Socket.IO", "MongoDB", "JWT", "Cloudinary"],
    repo: "https://github.com/samridhichakravarty/Real-Time",
    hue: "from-fuchsia to-pink-soft",
  },
];

export type Role = {
  org: string;
  title: string;
  dates: string;
  place: string;
  text: string;
  kind: "work" | "study";
};

export const JOURNEY: Role[] = [
  {
    org: "Poornima University",
    title: "B.Tech, Computer Science Engineering (AI & Data Science)",
    dates: "2023 – 2027",
    place: "Jaipur",
    text: "Studying computer science with a focus on AI and data science while building real web products on the side.",
    kind: "study",
  },
  {
    org: "ScaleneWorks",
    title: "Web Development Intern",
    dates: "May 2025 – July 2025",
    place: "Eight-week internship",
    text: "Built responsive interfaces and JavaScript interactions. Integrated MySQL data storage and helped develop and debug several web applications.",
    kind: "work",
  },
  {
    org: "Atlass Partners",
    title: "Forward Deployment Engineer",
    dates: "May 2026 – Present",
    place: "Jaipur",
    text: "Work with clients to understand their requirements and with cross-functional teams to turn them into product features. Maintain and improve company websites across UI, content and functionality.",
    kind: "work",
  },
  {
    org: "Atlass Partners",
    title: "AI Engineer",
    dates: "Present",
    place: "Jaipur",
    text: "Building AI-powered features and integrations into web products.",
    kind: "work",
  },
];

export const SKILL_GROUPS = [
  { name: "Languages", items: ["Python", "JavaScript", "HTML5", "CSS3"] },
  { name: "Frontend", items: ["React.js", "Next.js", "Responsive Web Design", "DOM Manipulation"] },
  { name: "Backend & data", items: ["Node.js", "REST APIs", "Backend Integration", "MongoDB", "MySQL", "Database Fundamentals"] },
  { name: "AI & tools", items: ["AI Fundamentals", "Data Science Fundamentals", "AI API Integration", "Git", "GitHub", "Vercel", "Cloudinary"] },
] as const;

export const ABOUT = {
  lead: "I'm a Computer Science Engineering student specializing in AI and Data Science at Poornima University in Jaipur, and I work as a Forward Deployment Engineer at Atlass Partners.",
  body: "I like turning messy problems into web products people can use. My work spans full-stack development, AI integrations, and building features around what clients and users need.",
};
