import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, ContactCTA } from "@/components/site";
import { Img, PageHeader } from "@/components/ui-bits";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Pratik Gold" },
      { name: "description", content: "Learn about Pratik Gold, a gold jewellery business in Mumbai presenting gold rings and earrings." },
      { property: "og:title", content: "About Us — Pratik Gold" },
      { property: "og:description", content: "Gold rings and gold earrings from Mumbai, Maharashtra." },
    ],
  }),
  component: About,
});

function About() {
  const { data } = useStore();
  const a = data.about;
  return (
    <SiteLayout>
      <PageHeader eyebrow="Our Story" title={a.heading} text={a.description} />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <Img src={a.image} alt="Gold jewellery styled by Pratik Gold" loading="lazy" className="aspect-[4/5] w-full" />
        <div>
          <p className="eyebrow">Business Overview</p>
          <h2 className="mt-4 text-4xl">Gold jewellery from {data.contact.cityState}</h2>
          <div className="gold-rule mt-6" />
          <p className="mt-6 text-lg leading-relaxed">{a.overview}</p>
        </div>
      </section>
      <section className="border-y border-border bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-3">
          {a.highlights.map((h) => (
            <div key={h.title} className="border-t-2 border-gold pt-6">
              <h3 className="text-2xl">{h.title}</h3>
              <p className="mt-3 leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-24 md:grid-cols-2">
        {data.categories.map((c) => (
          <figure key={c.id}>
            <Img src={c.image} alt={c.name} loading="lazy" className="aspect-[4/3] w-full" />
            <figcaption className="mt-4"><span className="font-display text-2xl text-ink">{c.name}</span><span className="mt-1 block text-sm">{c.description}</span></figcaption>
          </figure>
        ))}
      </section>
      <ContactCTA />
    </SiteLayout>
  );
}
