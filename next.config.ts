import type { NextConfig } from "next";

const simplePages = [
  "about",
  "contact",
  "destinations",
  "packages",
  "travel-guide",
  "faqs",
  "privacy-policy",
  "terms",
  "cookie-policy",
  "booking-terms",
  "cancellation-policy",
];

const byQuery = (key: string) => [{ type: "query" as const, key, value: "(?<value>[A-Za-z0-9-]+)" }];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Admin image uploads go through a Server Action.
      bodySizeLimit: "10mb",
    },
  },
  // Keep links to the old PHP/HTML site working.
  async redirects() {
    return [".php", ".html"].flatMap((ext) => [
      { source: `/index${ext}`, destination: "/", permanent: true },
      { source: `/destination-detail${ext}`, has: byQuery("slug"), destination: "/destination/:value", permanent: true },
      { source: `/package-detail${ext}`, has: byQuery("slug"), destination: "/package/:value", permanent: true },
      { source: `/article-detail${ext}`, has: byQuery("slug"), destination: "/article/:value", permanent: true },
      { source: `/destinations${ext}`, has: byQuery("region"), destination: "/destinations/:value", permanent: true },
      { source: `/packages${ext}`, has: byQuery("type"), destination: "/packages/:value", permanent: true },
      { source: `/travel-guide${ext}`, has: byQuery("category"), destination: "/travel-guide/category/:value", permanent: true },
      ...simplePages.map((page) => ({ source: `/${page}${ext}`, destination: `/${page}`, permanent: true })),
    ]);
  },
};

export default nextConfig;
