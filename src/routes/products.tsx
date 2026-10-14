import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, ProductCard, ProductDetail, ContactCTA } from "@/components/site";
import { Img, Icon } from "@/components/ui-bits";
import { useStore, sortedProducts, type Product } from "@/lib/store";

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>) => ({ category: typeof s["category"] === "string" ? (s["category"] as string) : undefined }) as { category?: string },
  head: () => ({
    meta: [
      { title: "Products & Services — Pratik Gold" },
      { name: "description", content: "Browse Pratik Gold's gold rings and gold earrings. Search by name or code and enquire for price." },
      { property: "og:title", content: "Products & Services — Pratik Gold" },
      { property: "og:description", content: "Gold rings and gold earrings collection from Pratik Gold, Mumbai." },
    ],
  }),
  component: Products,
});

function Products() {
  const { data } = useStore();
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [q, setQ] = useState("");
  const [view, setView] = useState<Product | null>(null);
  const active = category ?? "all";
  const term = q.trim().toLowerCase();
  const list = sortedProducts(data).filter((p) =>
    (active === "all" || p.categoryId === active) &&
    (!term || p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term)));
  const setCat = (c: string) => navigate({ search: { category: c === "all" ? undefined : c } });

  return (
    <SiteLayout>
      <section className="relative bg-ink">
        <Img src={data.home.heroImage} alt="Pratik Gold jewellery collection" className="absolute inset-0 h-full w-full opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center">
          <p className="eyebrow text-gold">Our Collection</p>
          <h1 className="mt-4 text-4xl text-ivory md:text-6xl">Products & Services</h1>
          <p className="mx-auto mt-5 max-w-xl text-champagne">Gold rings and gold earrings, presented for enquiry. Contact us to learn more about any design.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pt-16 md:grid-cols-2">
        {data.categories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`flex items-center gap-5 border bg-paper p-4 text-left transition-colors ${active === c.id ? "border-gold" : "border-border hover:border-gold"}`}>
            <Img src={c.image} alt={c.name} loading="lazy" className="h-24 w-24 shrink-0" />
            <div>
              <h2 className="text-2xl">{c.name}</h2>
              <p className="mt-1 text-sm">{c.description}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-gold-deep">{data.products.filter((p) => p.categoryId === c.id).length} pieces</p>
            </div>
          </button>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {[{ id: "all", name: "All" }, ...data.categories].map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={active === c.id}
                className={`min-h-[40px] px-4 text-xs uppercase tracking-widest transition-colors ${active === c.id ? "bg-ink text-ivory" : "border border-border bg-paper hover:border-gold"}`}>
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative block md:w-80">
            <span className="sr-only">Search products</span>
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or code" className="field pl-9" />
          </label>
        </div>
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="text-2xl">No pieces match your search</h2>
            <p className="mt-2 text-sm">Try a different name, code or category.</p>
            <button onClick={() => { setQ(""); setCat("all"); }} className="btn-outline mt-6">Clear filters</button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} p={p} onView={setView} />)}
          </div>
        )}
      </section>

      <ContactCTA />
      <ProductDetail p={view} onClose={() => setView(null)} onView={setView} />
    </SiteLayout>
  );
}
