import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, getPage, getTaxonomy, labelFor } from "@/lib/content";
import { formatDate, pad2 } from "@/lib/format";
import { siteUrl } from "@/lib/site-url";
import { ArticleCard } from "@/components/listing/ArticlesBrowser";
import { NewsletterBanner } from "@/components/site/NewsletterBanner";
import { ScrollSpyToc } from "@/components/site/ScrollSpyToc";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: { type: "article", publishedTime: article.date, images: [article.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, articles, taxonomy, template] = await Promise.all([getArticle(slug), getArticles(), getTaxonomy(), getPage("article")]);
  if (!article) notFound();

  const categoryLabel = labelFor(taxonomy.articleCategories, article.category);
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const url = siteUrl(`/article/${article.slug}`);
  const shareLinks = [
    { icon: "fa-brands fa-facebook-f", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { icon: "fa-brands fa-x-twitter", label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}` },
    {
      icon: "fa-brands fa-pinterest-p",
      label: "Share on Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(siteUrl(article.image))}&description=${encodeURIComponent(article.title)}`,
    },
    { icon: "fa-regular fa-envelope", label: "Share by email", href: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(url)}` },
  ];

  // Number headings and paragraphs separately: headings for the TOC, paragraphs for the drop cap and pull quote.
  const blocks = article.content.map((block, i) => ({
    ...block,
    number: article.content.slice(0, i + 1).filter((b) => b.type === block.type).length,
  }));
  const headings = article.content.filter((b) => b.type === "heading").map((b, i) => ({ id: `section-${i + 1}`, label: b.text }));
  const facts = [
    ["fa-regular fa-sun", "Best Season", article.facts.season],
    ["fa-regular fa-heart", "Ideal For", article.facts.ideal],
    ["fa-regular fa-compass", "Trip Style", article.facts.style],
    ["fa-solid fa-globe", "Region", article.facts.region],
  ].filter(([, , value]) => value);

  return (
    <>
      <div className="bg-[#FAF9F6] pt-32 pb-16 text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="article-breadcrumb flex items-center gap-2 text-[10px] text-slate-500 font-semibold mb-8 uppercase tracking-[1.5px]">
            <Link href="/" className="hover:text-velnora-gold-luxury transition">
              Home
            </Link>
            <i className="fa-solid fa-chevron-right text-[7px] text-slate-400" />
            <Link href="/travel-guide" className="hover:text-velnora-gold-luxury transition">
              Travel Guide
            </Link>
            <i className="fa-solid fa-chevron-right text-[7px] text-slate-400" />
            <Link href={`/travel-guide/category/${article.category}`} className="hover:text-velnora-gold-luxury transition">
              {categoryLabel}
            </Link>
            <i className="fa-solid fa-chevron-right text-[7px] text-slate-400" />
            <span className="text-slate-600 truncate max-w-[250px]">{article.title}</span>
          </nav>

          <header className="text-center max-w-[900px] mx-auto mb-10">
            <span className="text-xs uppercase tracking-[2.5px] text-velnora-gold-luxury font-bold">{categoryLabel}</span>
            <h1 className="font-serif text-3xl sm:text-5xl text-velnora-navy-deep font-normal mt-3 mb-4 leading-tight">{article.title}</h1>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6 font-light">{article.excerpt}</p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-450 font-light">
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-calendar text-[13px] text-velnora-gold-luxury/70" />
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </span>
              <span className="w-[1px] h-3.5 bg-slate-200 hidden sm:inline" />
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-clock text-[13px] text-velnora-gold-luxury/70" /> {article.readTime}
              </span>
              <span className="w-[1px] h-3.5 bg-slate-200 hidden sm:inline" />
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-user text-[13px] text-velnora-gold-luxury/70" /> {template.author}
              </span>
            </div>
          </header>

          <div className="relative rounded-3xl overflow-hidden shadow-md mb-16 h-[260px] sm:h-[420px] lg:h-[550px]">
            <Image src={article.image} alt={article.title} fill preload sizes="(min-width: 1400px) 1320px, 100vw" className="object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
            <div className="max-w-none">
              {blocks.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <div key={index} id={`section-${block.number}`} className="flex items-start gap-4 mt-12 mb-5 scroll-mt-24">
                      <span className="bg-[#F5EAD4]/50 border border-velnora-gold-luxury/10 text-velnora-gold-luxury font-serif text-sm px-2.5 py-1.5 rounded-lg shrink-0 mt-0.5">
                        {pad2(block.number)}
                      </span>
                      <h2 className="font-serif text-2xl lg:text-3xl text-velnora-navy-deep font-normal leading-tight">{block.text}</h2>
                    </div>
                  );
                }
                const isFirst = block.number === 1;
                return (
                  <div key={index}>
                    <p className="text-slate-600 leading-relaxed text-[15px] mb-5 font-light">
                      {isFirst ? (
                        <>
                          <span className="float-left text-6xl font-serif text-velnora-gold-luxury mr-3 mt-1.5 leading-none">{block.text.charAt(0)}</span>
                          {block.text.slice(1)}
                        </>
                      ) : (
                        block.text
                      )}
                    </p>
                    {block.number === 2 && article.pullQuote && (
                      <blockquote className="my-10 text-center relative max-w-lg mx-auto py-6 border-t border-b border-slate-200/50">
                        <span className="text-4xl text-velnora-gold-luxury font-serif absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FAF9F6] px-3">“</span>
                        <p className="font-serif italic text-lg text-velnora-navy-deep leading-relaxed px-4">{article.pullQuote}</p>
                      </blockquote>
                    )}
                  </div>
                );
              })}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24">
              {headings.length > 0 && (
                <ScrollSpyToc
                  title="IN THIS ARTICLE"
                  items={[...headings, { id: "quick-facts", label: "Quick Facts" }, ...(related.length ? [{ id: "related-articles", label: "You May Also Like" }] : [])]}
                />
              )}

              {facts.length > 0 && (
                <div id="quick-facts" className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm scroll-mt-24">
                  <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-velnora-navy-deep mb-5 border-b border-slate-100 pb-3">QUICK FACTS</h3>
                  <div className="space-y-5 text-xs">
                    {facts.map(([icon, label, value]) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                          <i className={`${icon} text-sm`} />
                        </div>
                        <div>
                          <span className="text-slate-450 block mb-0.5">{label}</span>
                          <span className="font-semibold text-velnora-navy-deep">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-velnora-navy-deep mb-5 border-b border-slate-100 pb-3 text-center lg:text-left">SHARE THIS GUIDE</h3>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  {shareLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-velnora-gold-luxury hover:text-[#051124] hover:border-velnora-gold-luxury transition duration-300"
                    >
                      <i className={`${link.icon} text-xs`} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden p-8 text-white min-h-[300px] flex flex-col justify-between shadow-md">
                <Image src={article.cta.image || article.image} alt="" fill sizes="320px" className="object-cover -z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#051124]/40 to-[#051124]/80 -z-0" />
                <div className="relative">
                  <h4 className="font-serif text-2xl font-normal mb-3 leading-tight">{article.cta.title}</h4>
                  <p className="text-xs text-slate-200/90 leading-relaxed font-light">{template.ctaText}</p>
                </div>
                <div className="relative mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 border border-white/40 hover:border-white hover:bg-white hover:text-[#051124] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-[1.5px] uppercase transition duration-300"
                  >
                    PLAN YOUR TRIP <i className="fa-solid fa-arrow-right text-[8px]" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div id="related-articles" className="mt-24 border-t border-slate-200/60 pt-16 scroll-mt-24">
              <div className="text-center mb-10">
                <span className="text-[10px] uppercase tracking-[3px] text-velnora-gold-luxury font-bold block mb-2">YOU MAY ALSO LIKE</span>
                <div className="w-12 h-[2px] bg-velnora-gold-luxury/40 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <ArticleCard key={rel.slug} article={rel} categoryLabel={labelFor(taxonomy.articleCategories, rel.category)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <NewsletterBanner title={template.newsletter.title} text={template.newsletter.text} />
    </>
  );
}
