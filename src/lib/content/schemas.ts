import { z } from "zod";

const text = z.string().trim();
const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format");
const imagePath = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/"), "Image paths must start with / (for example /images/photo.png)");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs can only use lowercase letters, numbers and single dashes");

const iconItem = z.object({ icon: text, title: text, text: text });
const faqItem = z.object({ question: required("Question"), answer: required("Answer") });
const link = z.object({ label: text, href: text });

export const settingsSchema = z.object({
  siteName: required("Site name"),
  brand: text,
  tagline: text,
  defaultDescription: text,
  phone: text,
  phoneAlt: text,
  whatsapp: text,
  email: z.email("Enter a valid email address"),
  addressLine1: text,
  addressLine2: text,
  hours: z.array(text),
  videoUrl: text.refine((v) => v === "" || v.startsWith("https://"), "Use a full https:// link or leave it empty"),
  socials: z.object({ facebook: text, instagram: text, youtube: text, pinterest: text }),
  newsletter: z.object({ title: text, text: text }),
  footer: z.object({ about: text, script: text, credit: text, badges: z.array(iconItem) }),
  searchPopular: z.array(link),
});

const term = z.object({ slug: slugSchema, label: required("Label") });

export const taxonomySchema = z.object({
  regions: z.array(term.extend({ icon: text, description: text })),
  travelStyles: z.array(term),
  packageTypes: z.array(term),
  articleCategories: z.array(term.extend({ icon: text })),
});

export const destinationSchema = z.object({
  slug: slugSchema,
  name: required("Name"),
  country: text,
  title: required("Title"),
  region: required("Region"),
  styles: z.array(text),
  image: imagePath,
  heroImage: imagePath,
  description: text,
  bestTime: text,
  idealDuration: text,
  currency: text,
  language: text,
  overview: text,
  highlights: z.array(text),
  thingsToDo: z.array(z.object({ title: required("Title"), description: text })),
  signatureExperiences: z.array(z.object({ icon: text, title: text, text: text, image: imagePath })),
  faq: z.array(faqItem),
});

export const packageSchema = z.object({
  slug: slugSchema,
  title: required("Title"),
  destinationSlug: text,
  destination: text,
  type: required("Package type"),
  styles: z.array(text),
  duration: text,
  priceText: text,
  image: imagePath,
  summary: text,
  overview: text,
  bestTime: text,
  idealFor: text,
  highlights: z.array(iconItem),
  itinerary: z.array(z.object({ day: z.coerce.number().int().min(1), title: required("Day title"), description: text })),
  experiences: z.array(z.object({ icon: text, title: text, text: text, image: imagePath })),
  included: z.array(text),
  notIncluded: z.array(text),
  perfectFor: z.array(text),
  faq: z.array(faqItem),
});

export const articleSchema = z.object({
  slug: slugSchema,
  title: required("Title"),
  category: required("Category"),
  date: isoDate,
  readTime: text,
  image: imagePath,
  excerpt: text,
  featured: z.boolean(),
  facts: z.object({ season: text, ideal: text, style: text, region: text }),
  pullQuote: text,
  cta: z.object({ title: text, image: imagePath }),
  content: z.array(z.object({ type: z.enum(["heading", "paragraph"]), text: required("Block text") })),
});

export const legalSchema = z.object({
  slug: slugSchema,
  title: required("Title"),
  intro: text,
  tocLabel: text,
  helpText: text,
  notice: text,
  seoDescription: text,
  lastUpdated: isoDate,
  sections: z.array(z.object({ title: required("Section title"), icon: text, paragraphs: z.array(text) })),
});

export const faqsSchema = z.array(faqItem);
