import { SITE, SERVICES, type Faq } from "./site";

type Json = Record<string, unknown>;

const personId = `${SITE.url}/#person`;

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": personId },
  };
}

export function personLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}${SITE.portrait}`,
    jobTitle: "Freelance Full-Stack Developer",
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Poornima University" },
    sameAs: [SITE.github, SITE.linkedin],
    knowsAbout: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB", "MySQL", "AI integration", "Web development"],
  };
}

export function serviceLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#service`,
    name: `${SITE.name}, Freelance Web Development`,
    url: SITE.url,
    image: `${SITE.url}${SITE.portrait}`,
    provider: { "@id": personId },
    areaServed: ["India", "Remote (worldwide)"],
    serviceType: ["Web development", "AI integration", "Landing pages and dashboards"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Freelance services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.short,
          url: `${SITE.url}/services/${service.slug}`,
        },
      })),
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqLd(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
