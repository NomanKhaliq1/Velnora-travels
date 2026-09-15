import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="min-h-[70vh] bg-velnora-ivory-warm flex items-center justify-center text-center px-6 pt-36 pb-24">
      <div className="max-w-[640px]">
        <p className="text-xs font-bold tracking-[4px] uppercase text-velnora-gold-luxury mb-4">Page unavailable</p>
        <h1 className="font-serif text-5xl text-velnora-navy-deep mb-4">Journey Not Found</h1>
        <p className="text-velnora-muted mb-8">The page you are looking for may have moved or is no longer available.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-velnora-navy-deep text-white rounded-full px-7 py-3 text-xs font-bold tracking-[2px] uppercase hover:bg-velnora-gold-luxury transition">
            Back to Home
          </Link>
          <Link
            href="/destinations"
            className="border border-velnora-navy-deep/30 text-velnora-navy-deep rounded-full px-7 py-3 text-xs font-bold tracking-[2px] uppercase hover:border-velnora-gold-luxury hover:text-velnora-gold-luxury transition"
          >
            Explore Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
