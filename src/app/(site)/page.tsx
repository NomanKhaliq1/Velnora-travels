import type { Metadata } from "next";
import { getArticles, getDestinations, getFaqs, getPage, getSettings, getTaxonomy } from "@/lib/content";
import { HomeHero } from "@/components/home/HomeHero";
import {
  Collections,
  Complications,
  Experience,
  FeaturedDestination,
  HomeContact,
  HomeFaq,
  Insights,
  JourneyStarts,
  PopularDestinations,
  Process,
  Stories,
  WhyChoose,
} from "@/components/home/HomeSections";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  return {
    ...(page.seo.title ? { title: page.seo.title } : {}),
    description: page.seo.description,
  };
}

export default async function HomePage() {
  const [page, settings, taxonomy, destinations, articles, faqs] = await Promise.all([
    getPage("home"),
    getSettings(),
    getTaxonomy(),
    getDestinations(),
    getArticles(),
    getFaqs(),
  ]);

  return (
    <>
      <HomeHero hero={page.hero} destinationNames={destinations.map((d) => d.title)} videoUrl={settings.videoUrl} />
      <PopularDestinations section={page.popularDestinations} destinations={destinations} regions={taxonomy.regions} />
      <Complications section={page.complications} />
      <Experience section={page.experience} />
      <Collections section={page.collections} />
      <FeaturedDestination section={page.featuredDestination} />
      <WhyChoose section={page.whyChoose} />
      <Process section={page.process} />
      <Stories section={page.stories} />
      <Insights section={page.insights} articles={articles} categories={taxonomy.articleCategories} />
      <HomeFaq section={page.faq} faqs={faqs} />
      <JourneyStarts section={page.journey} />
      <HomeContact section={page.contact} settings={settings} />
    </>
  );
}
