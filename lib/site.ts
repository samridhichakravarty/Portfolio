// Single source of truth for site-wide facts. Change them here, the SEO files and pages follow.

export const SITE = {
  name: "Samridhi Chakravarty",
  short: "Samridhi",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-samridhichakravarty.vercel.app").replace(/\/$/, ""),
  title: "Samridhi Chakravarty | Freelance Full-Stack Developer, Jaipur",
  description:
    "Freelance full-stack developer in Jaipur, India. I build fast Next.js websites, web apps and AI features for startups and growing businesses. Let's build something fun!",
  email: "chakravartysamridhi@gmail.com",
  github: "https://github.com/samridhichakravarty",
  linkedin: "https://www.linkedin.com/in/samridhi-chakravarty-45a5172a7/",
  resume: "/media/Samridhi-Chakravarty-Resume.pdf",
  portrait: "/media/samridhi-portrait.webp",
  city: "Jaipur",
  region: "Rajasthan",
  country: "IN",
  timeZone: "Asia/Kolkata",
  availability: "Open for freelance projects",
  keywords: [
    "freelance full-stack developer Jaipur",
    "freelance web developer India",
    "Next.js developer for hire",
    "React developer India",
    "AI chatbot integration developer",
    "website developer for startups",
    "Samridhi Chakravarty",
  ],
} as const;

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
  { step: "Plan", text: "I send back a simple scope, timeline and estimate." },
  { step: "Build", text: "I build in small steps with regular check-ins and live previews." },
  { step: "Launch", text: "We go live on Vercel, with a walkthrough so you can run it yourself." },
] as const;

export const SERVICES: Service[] = [
  {
    slug: "web-development",
    title: "Websites & web apps that ship",
    seoTitle: "Freelance Next.js & React Developer for Hire in India",
    short: "Fast, accessible, SEO-ready websites and full-stack web apps with Next.js, React and Node.js.",
    intro:
      "Need a site or a product built properly? I design and build responsive Next.js and React websites and full-stack web apps with a real back end, so they look great and keep working after launch.",
    deliverables: [
      "Responsive Next.js / React front end that is fast on phones",
      "Node.js back end with a database (MongoDB, MySQL or Supabase)",
      "Login and role-based access when your app needs it",
      "SEO basics: metadata, sitemap and structured data",
      "Deployed on Vercel, with a handover walkthrough",
    ],
    faqs: [
      { q: "What do you build?", a: "Business websites, landing pages, dashboards and full-stack web apps, mostly with Next.js, React, Node.js and a SQL or MongoDB database." },
      { q: "How do we start?", a: "Send me a short brief using the project builder or by email. I reply with questions, a scope and an estimate." },
      { q: "Do you work with clients outside India?", a: "Yes. I work remotely and share previews and updates online so time zones are never a blocker." },
    ],
  },
  {
    slug: "ai-integrations",
    title: "AI features for your product",
    seoTitle: "AI Chatbot & AI Integration Developer for Websites",
    short: "Assistants, content drafting and smart workflows added to your site or app with hosted AI model APIs.",
    intro:
      "Want an AI chatbot or smart feature in your product? I connect hosted AI model APIs to your website or app, with sensible limits and a human in the loop, so the AI helps instead of surprising you.",
    deliverables: [
      "Chat or assistant interface wired to an AI model API",
      "AI-assisted content workflows with review before publishing",
      "Prompt design, input limits and graceful fallbacks",
      "Authenticated API routes so keys stay private",
      "A clear explanation of how it works and what it costs to run",
    ],
    faqs: [
      { q: "Which AI tools do you use?", a: "I integrate hosted model APIs such as Groq into Next.js and Node.js apps. We pick the provider that fits your budget and needs." },
      { q: "Can AI be added to an existing site?", a: "Usually yes. I add it as a focused feature, such as a chat widget or a drafting tool, without rebuilding everything." },
      { q: "Is my data safe?", a: "API keys stay on the server and I only send what a feature needs. We agree on what data may leave your system before building." },
    ],
  },
  {
    slug: "landing-pages-dashboards",
    title: "Landing pages & admin dashboards",
    seoTitle: "Landing Page & Admin Dashboard Developer (Freelance)",
    short: "Conversion-focused landing pages and secure admin dashboards for managing leads, content and emails.",
    intro:
      "A landing page that makes people act, and an admin dashboard that makes your team's life easier. I build both, including login-protected dashboards for leads, content and automated emails.",
    deliverables: [
      "Landing page with clear story, motion that stays fast and strong calls to action",
      "JWT-protected admin dashboard",
      "CRM-style lists, forms and content management",
      "Automated email workflows (for example with Resend)",
      "Analytics-ready events so you can see what works",
    ],
    faqs: [
      { q: "Can you build a dashboard for my team?", a: "Yes. I have built a JWT-protected admin dashboard with CRM, content management and email workflows, and I can shape one around your process." },
      { q: "Will the site be fast?", a: "Speed is part of the job. I build with Next.js, optimise images and keep animation light so pages feel instant." },
      { q: "Can I edit the content myself?", a: "Yes. We can add simple content editing so you do not need a developer for everyday changes." },
    ],
  },
];

export const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/play", label: "Play" },
  { href: "/about", label: "About" },
] as const;
