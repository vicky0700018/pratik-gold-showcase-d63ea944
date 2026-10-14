import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useStore, catName, sortedProducts, type Product } from "@/lib/store";
import { Icon, Img, Modal } from "./ui-bits";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products & Services" },
  { to: "/about", label: "About Us" },
  { to: "/photos", label: "Photos" },
  { to: "/contact", label: "Contact Us" },
] as const;

function Header() {
  const { data } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="font-display text-2xl tracking-wide text-ink">
          {data.settings.logoText}
          <span className="ml-1 text-gold">.</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:text-gold-deep data-[status=active]:text-gold-deep data-[status=active]:underline data-[status=active]:underline-offset-8">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/products" className="btn-gold hidden lg:inline-flex">Explore Collection</Link>
        <button className="flex h-11 w-11 items-center justify-center text-ink lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-ivory px-5 pb-6 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} onClick={() => setOpen(false)}
              className="block border-b border-border py-4 text-sm uppercase tracking-[0.18em] data-[status=active]:text-gold-deep">
              {n.label}
            </Link>
          ))}
          <Link to="/products" onClick={() => setOpen(false)} className="btn-gold mt-5 w-full">Explore Collection</Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { data } = useStore();
  const c = data.contact;
  return (
    <footer className="bg-ink text-champagne">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-3xl text-ivory">{data.settings.logoText}</p>
          <p className="mt-4 text-sm leading-relaxed opacity-80">Gold rings and gold earrings for celebrations, special occasions and everyday elegance. Based in {c.cityState}.</p>
        </div>
        <div>
          <p className="eyebrow text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-gold">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">Collections</p>
          <ul className="mt-4 space-y-2 text-sm">
            {data.categories.map((cat) => (
              <li key={cat.id}><Link to="/products" search={{ category: cat.id }} className="hover:text-gold">{cat.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2"><Icon name="pin" className="h-4 w-4 shrink-0 text-gold" />{c.address}</li>
            <li className="flex gap-2"><Icon name="phone" className="h-4 w-4 shrink-0 text-gold" /><a href={`tel:${c.phone}`} className="hover:text-gold">{c.phone}</a></li>
            <li className="flex gap-2"><Icon name="mail" className="h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${c.email}`} className="break-all hover:text-gold">{c.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} {c.businessName}. All rights reserved.</p>
          <p className="text-gold">{data.settings.footerCredit}</p>
          <Link to="/admin/login" className="uppercase tracking-[0.18em] hover:text-gold">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function ProductCard({ p, onView }: { p: Product; onView: (p: Product) => void }) {
  const { data } = useStore();
  return (
    <article className="group flex flex-col border border-border bg-paper transition-shadow hover:shadow-soft">
      <button onClick={() => onView(p)} className="relative block aspect-square overflow-hidden" aria-label={`View ${p.name}`}>
        <Img src={p.image} alt={p.name} loading="lazy" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
        {!p.available && <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-ivory">Currently unavailable</span>}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-[0.65rem]">{catName(data, p.categoryId)}{p.code && ` · ${p.code}`}</p>
        <h3 className="mt-2 text-xl leading-snug">{p.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-xs uppercase tracking-widest text-gold-deep">Enquire for Price</span>
          <button onClick={() => onView(p)} className="text-xs uppercase tracking-widest text-ink underline underline-offset-4 hover:text-gold-deep">View Details</button>
        </div>
      </div>
    </article>
  );
}

export function ProductDetail({ p, onClose, onView }: { p: Product | null; onClose: () => void; onView: (p: Product) => void }) {
  const { data } = useStore();
  if (!p) return null;
  const related = sortedProducts(data).filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 3);
  return (
    <Modal open label={p.name} onClose={onClose} wide>
      <div className="grid md:grid-cols-2">
        <Img src={p.image} alt={p.name} className="aspect-square w-full" />
        <div className="p-8">
          <p className="eyebrow">{catName(data, p.categoryId)}</p>
          <h2 className="mt-3 text-3xl">{p.name}</h2>
          {p.code && <p className="mt-2 text-sm">Product code: <strong className="text-ink">{p.code}</strong></p>}
          <div className="gold-rule mt-5" />
          <p className="mt-5 leading-relaxed">{p.description}</p>
          <p className="mt-5 text-sm uppercase tracking-widest text-gold-deep">Enquire for Price</p>
          <p className="mt-1 text-sm">{p.available ? "Available for enquiry" : "Currently unavailable"}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact" search={{ product: p.name }} className="btn-gold">Enquire Now</Link>
            <a href={`tel:${data.contact.phone}`} className="btn-outline">Call</a>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="border-t border-border p-8">
          <p className="eyebrow">Related pieces</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {related.map((r) => (
              <button key={r.id} onClick={() => onView(r)} className="text-left">
                <Img src={r.image} alt={r.name} loading="lazy" className="aspect-square w-full" />
                <p className="mt-2 text-sm text-ink">{r.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

export function ContactCTA() {
  const { data } = useStore();
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <p className="eyebrow text-gold">Enquiries</p>
        <h2 className="mt-4 text-3xl text-ivory md:text-5xl">{data.home.ctaHeading}</h2>
        <p className="mx-auto mt-5 max-w-xl text-champagne">{data.home.ctaDescription}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={`tel:${data.contact.phone}`} className="btn-gold"><Icon name="phone" className="h-4 w-4" />Call Now</a>
          <a href={`mailto:${data.contact.email}`} className="btn-ghost-light"><Icon name="mail" className="h-4 w-4" />Email Us</a>
        </div>
      </div>
    </section>
  );
}
