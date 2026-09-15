import type { z } from "zod";
import type {
  articleSchema,
  destinationSchema,
  faqsSchema,
  legalSchema,
  packageSchema,
  settingsSchema,
  taxonomySchema,
} from "./schemas";

export type Settings = z.infer<typeof settingsSchema>;
export type Taxonomy = z.infer<typeof taxonomySchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type TravelPackage = z.infer<typeof packageSchema>;
export type Article = z.infer<typeof articleSchema>;
export type LegalPage = z.infer<typeof legalSchema>;
export type Faq = z.infer<typeof faqsSchema>[number];

// Page copy is free-form, so its type comes straight from the seeded JSON.
export type PageContent = {
  home: typeof import("../../../content/pages/home.json");
  about: typeof import("../../../content/pages/about.json");
  contact: typeof import("../../../content/pages/contact.json");
  destinations: typeof import("../../../content/pages/destinations.json");
  packages: typeof import("../../../content/pages/packages.json");
  "travel-guide": typeof import("../../../content/pages/travel-guide.json");
  faqs: typeof import("../../../content/pages/faqs.json");
  "destination-detail": typeof import("../../../content/pages/destination-detail.json");
  "package-detail": typeof import("../../../content/pages/package-detail.json");
  article: typeof import("../../../content/pages/article.json");
};

export type PageKey = keyof PageContent;

export const PAGE_KEYS: { key: PageKey; label: string; path: string }[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "destinations", label: "Destinations listing", path: "/destinations" },
  { key: "packages", label: "Packages listing", path: "/packages" },
  { key: "travel-guide", label: "Travel guide listing", path: "/travel-guide" },
  { key: "faqs", label: "FAQs page", path: "/faqs" },
  { key: "destination-detail", label: "Destination page template", path: "/destinations" },
  { key: "package-detail", label: "Package page template", path: "/packages" },
  { key: "article", label: "Article page template", path: "/travel-guide" },
];
