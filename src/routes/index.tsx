import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, ProductCard, ProductDetail, ContactCTA } from "@/components/site";
import { Img, Icon } from "@/components/ui-bits";
import { useStore, sortedProducts, type Product } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pratik Gold — Gold Rings & Earrings in Mumbai" },
      { name: "description", content: "Discover elegant gold rings and gold earrings from Pratik Gold, Mumbai, Maharashtra." },
      { property: "og:title", content: "Pratik Gold — Gold Rings & Earrings in Mumbai" },
      { property: "og:description", content: "Elegant gold rings and earrings for celebrations and everyday elegance." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useStore();
  const h = data.home;
  const [view, setView] = useState<Product | null>(null);
  const featured = sortedProducts(data).filter((p) => p.featured).slice(0, data.settings.productCount);
  const gallery = [...data.gallery].sort((a, b) => a.order - b.order).slice(0, 5);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-ink">
        <Img src={h.heroImage} alt="Gold rings and earrings displayed on black velvet" fetchPriority="high" className="absolute inset-0 h-full w-full object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-24">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">{h.heroEyebrow}</p>
            <h1 className="mt-5 text-5xl leading-[1.05] text-ivory md:text-7xl">{h.heroHeading}</h1>
            <p className="mt-6 max-w-md leading-relaxed text-champagne">{h.heroDescription}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products" className="btn-gold">{h.heroPrimary}</Link>
              <Link to="/contact" className="btn-ghost-light">{h.heroSecondary}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="text-center">
          <p className="eyebrow">Collections</p>
          <h2 className="mt-4 text-4xl">Featured Collections</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {data.categories.map((c, i) => (
            <Link key={c.id} to="/products" search={{ category: c.id }} className="group relative block overflow-hidden">
              <Img src={c.image} alt={c.name} loading="lazy" className={`w-full transition-transform duration-700 group-hover:scale-105 ${i % 2 ? "aspect-[4/5]" : "aspect-[4/5] md:mt-12"}`} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-8">
                <h3 className="text-3xl text-ivory">{c.name}</h3>
                <p className="mt-2 max-w-sm text-sm text-champagne">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold">View Collection <Icon name="arrow" className="h-4 w-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Selected pieces</p>
              <h2 className="mt-4 text-4xl">Featured Products</h2>
            </div>
            <Link to="/products" className="btn-outline">View All Products</Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.id} p={p} onView={setView} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <Img src={h.aboutImage} alt="Gold ring and earrings worn with ivory silk" loading="lazy" className="aspect-[4/5] w-full" />
        <div>
          <p className="eyebrow">About Pratik Gold</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{h.aboutHeading}</h2>
          <div className="gold-rule mt-6" />
          <p className="mt-6 text-lg leading-relaxed">{h.aboutDescription}</p>
          <Link to="/about" className="btn-outline mt-8">Learn More About Us</Link>
        </div>
      </section>

      <section className="bg-champagne/40">
        <div className="mx-auto grid max-w-7xl gap-px bg-border px-0 md:grid-cols-3">
          {[
            ["Timeless Designs", "Ring and earring styles chosen for lasting appeal across generations of taste."],
            ["Elegant Occasion Wear", "Party wear pieces suited to weddings, festivals and celebrations."],
            ["Classic Gold Jewellery", "Gold rings and earrings in familiar, wearable silhouettes."],
          ].map(([t, d]) => (
            <div key={t} className="bg-ivory p-10 text-center">
              <Icon name="diamond" className="mx-auto h-7 w-7 text-gold" />
              <h3 className="mt-5 text-2xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Gallery</p><h2 className="mt-4 text-4xl">In Detail</h2></div>
          <Link to="/photos" className="btn-outline">View All Photos</Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
          {gallery.map((g, i) => (
            <Img key={g.id} src={g.image} alt={g.caption} loading="lazy" className={`h-full w-full ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`} />
          ))}
        </div>
      </section>

      <ContactCTA />
      <ProductDetail p={view} onClose={() => setView(null)} onView={setView} />
    </SiteLayout>
  );
}
