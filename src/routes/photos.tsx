import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site";
import { Img, Modal, PageHeader } from "@/components/ui-bits";
import { useStore, type GalleryItem } from "@/lib/store";

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title: "Photos — Pratik Gold Jewellery Gallery" },
      { name: "description", content: "Gallery of gold rings, gold earrings, close-ups and occasion-wear styling from Pratik Gold." },
      { property: "og:title", content: "Photos — Pratik Gold Jewellery Gallery" },
      { property: "og:description", content: "Gold ring and earring photography from Pratik Gold." },
    ],
  }),
  component: Photos,
});

function Photos() {
  const { data } = useStore();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const items = [...data.gallery].sort((a, b) => a.order - b.order);
  const cats = ["All", ...Array.from(new Set(items.map((g) => g.category)))];
  const shown = items.filter((g) => cat === "All" || g.category === cat);
  return (
    <SiteLayout>
      <PageHeader eyebrow="Gallery" title="Photos" text="Gold rings, gold earrings, close-up details and occasion-wear styling." />
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter photos">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`min-h-[40px] px-4 text-xs uppercase tracking-widest ${cat === c ? "bg-ink text-ivory" : "border border-border bg-paper hover:border-gold"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {shown.map((g, i) => (
            <button key={g.id} onClick={() => setOpen(g)} className="group relative mb-4 block w-full break-inside-avoid overflow-hidden" aria-label={`Preview ${g.title}`}>
              <Img src={g.image} alt={g.caption} loading="lazy" className={`w-full transition-transform duration-700 group-hover:scale-105 ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left opacity-0 transition-opacity group-hover:opacity-100">
                <span className="block font-display text-xl text-ivory">{g.title}</span>
                <span className="text-xs text-champagne">{g.category}</span>
              </span>
            </button>
          ))}
        </div>
        {shown.length === 0 && <p className="py-20 text-center">No photos in this category yet.</p>}
      </section>
      <Modal open={!!open} onClose={() => setOpen(null)} label={open?.title ?? "Photo"} wide>
        {open && (<>
          <Img src={open.image} alt={open.caption} className="max-h-[75vh] w-full object-contain bg-ink" />
          <div className="p-6"><h2 className="text-2xl">{open.title}</h2><p className="mt-1 text-sm">{open.caption} · {open.category}</p></div>
        </>)}
      </Modal>
    </SiteLayout>
  );
}
