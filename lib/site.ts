// Single source of truth for site-wide facts. Change them here and the pages, SEO files and email drafts follow.

export const SITE = {
  name: "Samridhi Chakravarty",
  short: "Samridhi",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-samridhichakravarty.vercel.app").replace(/\/$/, ""),
  title: "Samridhi Chakravarty | Full-Stack Developer, Jaipur",
  description:
    "Full-stack developer in Jaipur, India, open to full-time roles and freelance projects. I build web apps, AI features, APIs and dashboards.",
  email: "chakravartysamridhi@gmail.com",
  github: "https://github.com/samridhichakravarty",
  linkedin: "https://www.linkedin.com/in/samridhi-chakravarty-45a5172a7/",
  resume: "/media/Samridhi-Chakravarty-Resume.pdf",
  portrait: "/media/chapters/samridhi-portrait.webp",
  city: "Jaipur",
  region: "Rajasthan",
  country: "IN",
  timeZone: "Asia/Kolkata",
  status: "Open to full-time roles and freelance projects",
  keywords: [
    "full-stack developer Jaipur",
    "hire full-stack developer India",
    "freelance full-stack developer",
    "AI integration developer",
    "React Next.js Node.js developer",
    "Samridhi Chakravarty",
  ],
} as const;

// Removes doubled blank lines left behind by optional fields.
export function tidy(lines: string[]) {
  return lines.filter((line, index) => !(line === '' && (index === 0 || lines[index - 1] === '')));
}

// Email drafts are plain and direct. CRLF line breaks are what mail apps expect in mailto links.
export function mailto(subject: string, lines: string[]) {
  const body = lines.join("\r\n");
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  seoTitle: string;
  short: string;
  intro: string;
  deliverables: string[];
  faqs: Faq[];
};

export const PROCESS = [
  { step: "Brief", text: "You tell me what you want to build and who it is for." },
  { step: "Scope", text: "I send back a written scope, timeline and estimate." },
  { step: "Build", text: "I build in small steps and share working previews so feedback comes early." },
  { step: "Launch", text: "We go live together, with a walkthrough so you can run it yourself." },
] as const;

export const SERVICES: Service[] = [
  {
    slug: "web-apps",
    title: "Full-stack web apps & internal tools",
    seoTitle: "Freelance Full-Stack Web App Developer for Hire (India)",
    short: "End-to-end web apps: interface, server, database and deployment.",
    intro:
      "I take a web app from idea to launch: the interface, the server, the database and the deployment. I choose the stack that fits the job, usually React or Next.js with Node.js and a SQL or MongoDB database.",
    deliverables: [
      "Responsive React or Next.js front end",
      "Node.js back end with MongoDB, MySQL or Supabase",
      "Login and role-based access when the app needs it",
      "Deployment, plus a walkthrough so your team can run it",
      "Clean, documented code you own",
    ],
    faqs: [
      { q: "What kind of apps do you build?", a: "Customer portals, internal tools, admin panels, MVPs and full-stack products, from a first version to something your team uses daily." },
      { q: "Do you only use one stack?", a: "No. I pick the stack that fits the job. My main tools are JavaScript, TypeScript, Python, React, Next.js and Node.js with SQL or NoSQL databases." },
      { q: "How do we start?", a: "Use the Build Quest to describe the project in two minutes. I reply with questions, a scope and an estimate." },
    ],
  },
  {
    slug: "ai-features",
    title: "AI features & automation",
    seoTitle: "AI Chatbot & AI Integration Developer (Freelance, India)",
    short: "Chatbots, assistants, content tools and workflow automation using hosted AI model APIs.",
    intro:
      "I add AI to products and workflows: assistants, content drafting, smart search and automation. I connect hosted model APIs with sensible limits and a human in the loop, so the AI helps instead of surprising you.",
    deliverables: [
      "Chat or assistant interface connected to an AI model API",
      "AI-assisted content workflows with review before publishing",
      "Prompt design, input limits and fallbacks",
      "Server-side API routes so keys stay private",
      "A plain explanation of how it works and what it costs to run",
    ],
    faqs: [
      { q: "Which AI tools do you use?", a: "I integrate hosted model APIs, for example Groq, into web apps. We pick the provider that fits your budget and needs." },
      { q: "Can AI be added to an existing product?", a: "Usually yes. I add it as a focused feature, such as an assistant or a drafting tool, without rebuilding everything." },
      { q: "Is my data safe?", a: "Keys stay on the server and I send only what a feature needs. We agree on what data may leave your system before I build." },
    ],
  },
  {
    slug: "apis-backends",
    title: "APIs, backends & real-time systems",
    seoTitle: "Freelance Backend & API Developer: Node.js, Real-Time, Auth",
    short: "REST APIs, authentication, databases and real-time features like chat and live updates.",
    intro:
      "I build the parts users never see but always feel: APIs, authentication, databases and real-time features such as live chat, presence and notifications.",
    deliverables: [
      "REST APIs with JWT authentication and role-based access",
      "Database design in MongoDB or MySQL",
      "Real-time features with Socket.IO",
      "File uploads and third-party integrations",
      "Email and notification workflows",
    ],
    faqs: [
      { q: "Have you built real-time features?", a: "Yes. My Real-Time Chat Application has direct and group chat, live presence, typing and delivery indicators, and file sharing." },
      { q: "Can you work on an existing back end?", a: "Yes. I can add endpoints, fix issues and improve an existing codebase after reading it." },
      { q: "Which databases do you use?", a: "MongoDB, MySQL and Supabase. I pick what fits your data." },
    ],
  },
  {
    slug: "sites-dashboards",
    title: "Websites, landing pages & dashboards",
    seoTitle: "Freelance Website, Landing Page & Dashboard Developer",
    short: "Fast public sites and secure admin dashboards for leads, content and emails.",
    intro:
      "Public websites and landing pages that load fast and get found, plus admin dashboards that give your team control over leads, content and automated emails.",
    deliverables: [
      "Landing pages and company sites built for speed and search",
      "JWT-protected admin dashboard",
      "CRM-style lists, forms and content management",
      "Automated email workflows",
      "SEO basics: metadata, sitemap and structured data",
    ],
    faqs: [
      { q: "Can my team edit content without a developer?", a: "Yes. We can add simple content management so everyday changes do not need me." },
      { q: "Will the site rank in search?", a: "I build the technical SEO foundations. Rankings also depend on your content and time." },
      { q: "Have you built a dashboard before?", a: "Yes. My Enterprise Web Platform includes a JWT-protected admin dashboard with CRM, content management and email workflows." },
    ],
  },
];

// Draft answers for the Ship It! end card. Replace with your own wording any time.
export const RISK_FIXES: Record<string, string> = {
  "Scope creep": "I agree the scope in writing first. Changes are discussed and agreed before I build them.",
  "Unclear brief": "I ask the questions up front, so we both know what done looks like.",
  "Late feedback": "I share working previews often, so feedback arrives early and cheaply.",
  Bug: "I test before every release and fix problems before they reach users.",
};
