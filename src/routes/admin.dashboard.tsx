import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useStore, uid, catName, sortedProducts, type Product, type Category, type GalleryItem, type Enquiry, type Data } from "@/lib/store";
import { Icon, Img, Modal } from "@/components/ui-bits";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Pratik Gold" },
      { name: "description", content: "Manage Pratik Gold website content." },
      { property: "og:title", content: "Admin Dashboard — Pratik Gold" },
      { property: "og:description", content: "Demo content management for the Pratik Gold website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const SECTIONS = ["Overview", "Products", "Categories", "Gallery", "Homepage Content", "About Us", "Contact Details", "Enquiries", "Website Settings"] as const;
type Section = (typeof SECTIONS)[number];

function Dashboard() {
  const { ready, authed, logout } = useStore();
  const navigate = useNavigate();
  const [sec, setSec] = useState<Section>("Overview");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/admin/login" });
  }, [ready, authed, navigate]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!ready || !authed) return <div className="flex min-h-screen items-center justify-center bg-ink text-champagne">Checking access…</div>;

  const doLogout = () => { logout(); navigate({ to: "/admin/login" }); };
  const go = (s: Section) => { setSec(s); setMenu(false); };

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className={`${menu ? "block" : "hidden"} bg-ink text-champagne lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto`}>
        <div className="hidden px-6 py-6 lg:block">
          <p className="font-display text-2xl text-ivory">Pratik Gold<span className="text-gold">.</span></p>
          <p className="eyebrow mt-1 text-gold">Admin</p>
        </div>
        <nav aria-label="Admin" className="px-3 pb-6">
          {SECTIONS.map((s) => (
            <button key={s} onClick={() => go(s)} aria-current={sec === s ? "page" : undefined}
              className={`block w-full px-3 py-2.5 text-left text-sm transition-colors ${sec === s ? "bg-gold text-ink" : "hover:text-gold"}`}>
              {s === "Overview" ? "Dashboard Overview" : s}
            </button>
          ))}
          <div className="my-3 border-t border-gold/20" />
          <Link to="/" className="block px-3 py-2.5 text-sm hover:text-gold">View Website</Link>
          <button onClick={doLogout} className="block w-full px-3 py-2.5 text-left text-sm hover:text-gold">Logout</button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-border bg-ivory px-5 py-4">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center lg:hidden" aria-label="Toggle admin menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <Icon name={menu ? "close" : "menu"} />
            </button>
            <h1 className="text-2xl">{sec === "Overview" ? "Dashboard Overview" : sec}</h1>
          </div>
          <button onClick={doLogout} className="btn-outline hidden sm:inline-flex">Logout</button>
        </header>
        <main className="p-5 md:p-8">
          {sec === "Overview" && <Overview go={go} />}
          {sec === "Products" && <Products notify={setToast} />}
          {sec === "Categories" && <Categories notify={setToast} />}
          {sec === "Gallery" && <Gallery notify={setToast} />}
          {sec === "Homepage Content" && <HomeEdit notify={setToast} />}
          {sec === "About Us" && <AboutEdit notify={setToast} />}
          {sec === "Contact Details" && <ContactEdit notify={setToast} />}
          {sec === "Enquiries" && <Enquiries notify={setToast} />}
          {sec === "Website Settings" && <Settings notify={setToast} />}
        </main>
      </div>
      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 border border-gold bg-ink px-4 py-3 text-sm text-ivory shadow-soft">{toast}</div>}
    </div>
  );
}

type N = { notify: (m: string) => void };

/* ---------- shared bits ---------- */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-border bg-ivory p-5 md:p-6 ${className}`}>{children}</section>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest">{label}</span>{children}</label>;
}
function Text({ label, value, onChange, area, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; area?: boolean; type?: string }) {
  return (
    <Field label={label}>
      {area
        ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="field" />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field" />}
    </Field>
  );
}
function ImageField({ value, onChange, label = "Image URL" }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="space-y-2">
      <Text label={label} value={value} onChange={onChange} />
      <Img src={value} alt="Image preview" className="h-32 w-full border border-border md:w-48" />
    </div>
  );
}
function Confirm({ text, onYes, onNo }: { text: string | null; onYes: () => void; onNo: () => void }) {
  return (
    <Modal open={!!text} onClose={onNo} label="Confirm delete">
      <div className="p-8">
        <h2 className="text-2xl">Please confirm</h2>
        <p className="mt-3">{text}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onYes} className="btn-gold">Delete</button>
          <button onClick={onNo} className="btn-outline">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} aria-label={label}
      className={`border px-2 py-1 text-[11px] uppercase tracking-widest ${on ? "border-gold bg-gold text-ink" : "border-border text-muted-foreground"}`}>
      {on ? "Yes" : "No"}
    </button>
  );
}

/* ---------- overview ---------- */
function Overview({ go }: { go: (s: Section) => void }) {
  const { data } = useStore();
  const cards = [
    { label: "Total Products", value: data.products.length, s: "Products" as Section },
    { label: "Total Categories", value: data.categories.length, s: "Categories" as Section },
    { label: "Gallery Images", value: data.gallery.length, s: "Gallery" as Section },
    { label: "Total Enquiries", value: data.enquiries.length, s: "Enquiries" as Section },
  ];
  const recent = [...data.enquiries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <button key={c.label} onClick={() => go(c.s)} className="border border-border bg-ivory p-6 text-left transition-shadow hover:shadow-soft">
            <p className="eyebrow">{c.label}</p>
            <p className="mt-3 font-display text-4xl text-ink">{c.value}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className="text-xl">Recent enquiries</h2>
          {recent.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No enquiries yet. Submissions from the Contact page appear here.</p> : (
            <ul className="mt-3 divide-y divide-border">
              {recent.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span><strong className="text-ink">{e.name}</strong> · {e.email}</span>
                  <span className="text-xs uppercase tracking-widest text-gold-deep">{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <h2 className="text-xl">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => go("Products")} className="btn-gold">Manage products</button>
            <button onClick={() => go("Gallery")} className="btn-outline">Manage gallery</button>
            <button onClick={() => go("Homepage Content")} className="btn-outline">Edit homepage</button>
            <Link to="/" className="btn-outline">View website</Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Changes are saved in this browser only and are not shared with other devices or users.</p>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- products ---------- */
const blankProduct = (d: Data): Product => ({ id: "", name: "", categoryId: d.categories[0]?.id ?? "", code: "", description: "", image: "", featured: false, available: true, order: d.products.length + 1 });

function Products({ notify }: N) {
  const { data, update } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [edit, setEdit] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const [err, setErr] = useState("");
  const t = q.trim().toLowerCase();
  const list = sortedProducts(data).filter((p) => (cat === "all" || p.categoryId === cat) && (!t || p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t)));
  const patch = (id: string, ch: Partial<Product>) => update((d) => ({ ...d, products: d.products.map((p) => (p.id === id ? { ...p, ...ch } : p)) }));

  const save = () => {
    if (!edit) return;
    if (!edit.name.trim() || !edit.categoryId) return setErr("Name and category are required.");
    const p = { ...edit, name: edit.name.trim(), order: Number(edit.order) || 0 };
    update((d) => ({ ...d, products: p.id ? d.products.map((x) => (x.id === p.id ? p : x)) : [...d.products, { ...p, id: uid() }] }));
    notify(p.id ? "Product updated" : "Product added");
    setEdit(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-52 flex-1">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input aria-label="Search products" placeholder="Search name or code" value={q} onChange={(e) => setQ(e.target.value)} className="field pl-9" />
        </div>
        <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)} className="field w-auto">
          <option value="all">All categories</option>
          {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => { setErr(""); setEdit(blankProduct(data)); }} className="btn-gold">Add product</button>
      </div>
      <div className="overflow-x-auto border border-border bg-ivory">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-champagne/50 text-left text-xs uppercase tracking-widest">
            <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Code</th><th className="p-3">Featured</th><th className="p-3">Available</th><th className="p-3">Order</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3"><div className="flex items-center gap-3"><Img src={p.image} alt={p.name} className="h-12 w-12 shrink-0" /><span className="text-ink">{p.name}</span></div></td>
                <td className="p-3">{catName(data, p.categoryId)}</td>
                <td className="p-3">{p.code || "—"}</td>
                <td className="p-3"><Toggle on={p.featured} label={`Featured ${p.name}`} onClick={() => patch(p.id, { featured: !p.featured })} /></td>
                <td className="p-3"><Toggle on={p.available} label={`Available ${p.name}`} onClick={() => patch(p.id, { available: !p.available })} /></td>
                <td className="p-3"><input type="number" aria-label={`Order ${p.name}`} value={p.order} onChange={(e) => patch(p.id, { order: Number(e.target.value) })} className="field w-20 py-1" /></td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setViewing(p)} className="px-2 underline-offset-4 hover:underline">View</button>
                  <button onClick={() => { setErr(""); setEdit(p); }} className="px-2 text-gold-deep underline-offset-4 hover:underline">Edit</button>
                  <button onClick={() => setDel(p)} className="px-2 text-destructive underline-offset-4 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No products match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} label="Product form" wide>
        {edit && (
          <div className="space-y-4 p-6 md:p-8">
            <h2 className="text-2xl">{edit.id ? "Edit product" : "Add product"}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Text label="Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
              <Field label="Category">
                <select value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })} className="field">
                  {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Text label="Product code" value={edit.code} onChange={(v) => setEdit({ ...edit, code: v })} />
              <Text label="Display order" type="number" value={edit.order} onChange={(v) => setEdit({ ...edit, order: Number(v) })} />
            </div>
            <Text label="Description" area value={edit.description} onChange={(v) => setEdit({ ...edit, description: v })} />
            <ImageField value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} />
            <div className="flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} />Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={edit.available} onChange={(e) => setEdit({ ...edit, available: e.target.checked })} />Available</label>
            </div>
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <div className="flex gap-3"><button onClick={save} className="btn-gold">Save</button><button onClick={() => setEdit(null)} className="btn-outline">Cancel</button></div>
          </div>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} label="Product details">
        {viewing && (
          <div>
            <Img src={viewing.image} alt={viewing.name} className="aspect-video w-full" />
            <div className="space-y-1 p-6 text-sm">
              <h2 className="text-2xl">{viewing.name}</h2>
              <p>Category: {catName(data, viewing.categoryId)}</p>
              <p>Code: {viewing.code || "—"}</p>
              <p>Featured: {viewing.featured ? "Yes" : "No"} · Available: {viewing.available ? "Yes" : "No"} · Order: {viewing.order}</p>
              <p className="pt-2">{viewing.description}</p>
            </div>
          </div>
        )}
      </Modal>

      <Confirm text={del ? `Delete "${del.name}"? This cannot be undone.` : null} onNo={() => setDel(null)}
        onYes={() => { if (del) { update((d) => ({ ...d, products: d.products.filter((p) => p.id !== del.id) })); notify("Product deleted"); } setDel(null); }} />
    </div>
  );
}

/* ---------- categories ---------- */
function Categories({ notify }: N) {
  const { data, update } = useStore();
  const [edit, setEdit] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [del, setDel] = useState<Category | null>(null);
  const [err, setErr] = useState("");
  const count = (id: string) => data.products.filter((p) => p.categoryId === id).length;

  const save = () => {
    if (!edit || !edit.name.trim()) return setErr("Category name is required.");
    update((d) => ({ ...d, categories: isNew ? [...d.categories, { ...edit, id: uid() }] : d.categories.map((c) => (c.id === edit.id ? edit : c)) }));
    notify(isNew ? "Category added" : "Category updated");
    setEdit(null);
  };
  const tryDelete = (c: Category) => {
    if (count(c.id) > 0) return notify(`Reassign or remove the ${count(c.id)} product(s) in "${c.name}" first.`);
    setDel(c);
  };

  return (
    <div className="space-y-5">
      <button onClick={() => { setErr(""); setIsNew(true); setEdit({ id: "", name: "", description: "", image: "" }); }} className="btn-gold">Add category</button>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((c) => (
          <Panel key={c.id} className="p-0 md:p-0">
            <Img src={c.image} alt={c.name} className="aspect-video w-full" />
            <div className="p-5">
              <h2 className="text-xl">{c.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-gold-deep">{count(c.id)} products</p>
              <p className="mt-2 text-sm">{c.description}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => { setErr(""); setIsNew(false); setEdit(c); }} className="btn-outline">Edit</button>
                <button onClick={() => tryDelete(c)} className="btn-outline text-destructive">Delete</button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} label="Category form">
        {edit && (
          <div className="space-y-4 p-6 md:p-8">
            <h2 className="text-2xl">{isNew ? "Add category" : "Edit category"}</h2>
            <Text label="Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
            <Text label="Description" area value={edit.description} onChange={(v) => setEdit({ ...edit, description: v })} />
            <ImageField value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <div className="flex gap-3"><button onClick={save} className="btn-gold">Save</button><button onClick={() => setEdit(null)} className="btn-outline">Cancel</button></div>
          </div>
        )}
      </Modal>
      <Confirm text={del ? `Delete category "${del.name}"?` : null} onNo={() => setDel(null)}
        onYes={() => { if (del) { update((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== del.id) })); notify("Category deleted"); } setDel(null); }} />
    </div>
  );
}

/* ---------- gallery ---------- */
function Gallery({ notify }: N) {
  const { data, update } = useStore();
  const [edit, setEdit] = useState<GalleryItem | null>(null);
  const [del, setDel] = useState<GalleryItem | null>(null);
  const [err, setErr] = useState("");
  const items = [...data.gallery].sort((a, b) => a.order - b.order);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[i]!, b = items[j]!;
    update((d) => ({ ...d, gallery: d.gallery.map((g) => (g.id === a.id ? { ...g, order: b.order } : g.id === b.id ? { ...g, order: a.order } : g)) }));
  };
  const save = () => {
    if (!edit || !edit.title.trim() || !edit.image.trim()) return setErr("Title and image URL are required.");
    update((d) => ({ ...d, gallery: edit.id ? d.gallery.map((g) => (g.id === edit.id ? edit : g)) : [...d.gallery, { ...edit, id: uid() }] }));
    notify(edit.id ? "Gallery item updated" : "Gallery item added");
    setEdit(null);
  };
  const maxOrder = items.reduce((m, g) => Math.max(m, g.order), 0);

  return (
    <div className="space-y-5">
      <button onClick={() => { setErr(""); setEdit({ id: "", image: "", title: "", caption: "", category: "Gold Rings", order: maxOrder + 1 }); }} className="btn-gold">Add gallery item</button>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((g, i) => (
          <Panel key={g.id} className="p-0 md:p-0">
            <Img src={g.image} alt={g.title} loading="lazy" className="aspect-square w-full" />
            <div className="p-4">
              <p className="eyebrow text-[0.65rem]">{g.category} · #{i + 1}</p>
              <h2 className="mt-1 text-lg">{g.title}</h2>
              <p className="text-xs">{g.caption}</p>
              <div className="mt-3 flex flex-wrap gap-1 text-xs">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${g.title} up`} className="btn-outline px-2 py-1 disabled:opacity-40">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${g.title} down`} className="btn-outline px-2 py-1 disabled:opacity-40">↓</button>
                <button onClick={() => { setErr(""); setEdit(g); }} className="btn-outline px-2 py-1">Edit</button>
                <button onClick={() => setDel(g)} className="btn-outline px-2 py-1 text-destructive">Delete</button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} label="Gallery form">
        {edit && (
          <div className="space-y-4 p-6 md:p-8">
            <h2 className="text-2xl">{edit.id ? "Edit gallery item" : "Add gallery item"}</h2>
            <Text label="Title" value={edit.title} onChange={(v) => setEdit({ ...edit, title: v })} />
            <Text label="Caption" value={edit.caption} onChange={(v) => setEdit({ ...edit, caption: v })} />
            <Field label="Category">
              <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} className="field">
                {["Gold Rings", "Gold Earrings", "Close-ups", "Occasion Wear", "Compositions"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Text label="Display order" type="number" value={edit.order} onChange={(v) => setEdit({ ...edit, order: Number(v) })} />
            <ImageField value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <div className="flex gap-3"><button onClick={save} className="btn-gold">Save</button><button onClick={() => setEdit(null)} className="btn-outline">Cancel</button></div>
          </div>
        )}
      </Modal>
      <Confirm text={del ? `Delete "${del.title}" from the gallery?` : null} onNo={() => setDel(null)}
        onYes={() => { if (del) { update((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== del.id) })); notify("Gallery item deleted"); } setDel(null); }} />
    </div>
  );
}

/* ---------- generic object editor ---------- */
function useDraft<K extends "home" | "about" | "contact" | "settings">(key: K) {
  const { data, update } = useStore();
  const [draft, setDraft] = useState<Data[K]>(data[key]);
  useEffect(() => setDraft(data[key]), [data, key]);
  const save = () => update((d) => ({ ...d, [key]: draft }));
  return [draft, setDraft, save] as const;
}
function SaveBar({ onSave }: { onSave: () => void }) {
  return <div className="pt-2"><button onClick={onSave} className="btn-gold">Save changes</button></div>;
}

function HomeEdit({ notify }: N) {
  const [h, set, save] = useDraft("home");
  const f = (k: keyof typeof h) => (v: string) => set({ ...h, [k]: v });
  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <h2 className="text-xl">Hero banner</h2>
        <Text label="Small heading" value={h.heroEyebrow} onChange={f("heroEyebrow")} />
        <Text label="Hero heading" value={h.heroHeading} onChange={f("heroHeading")} />
        <Text label="Hero description" area value={h.heroDescription} onChange={f("heroDescription")} />
        <div className="grid gap-4 md:grid-cols-2">
          <Text label="Primary button label" value={h.heroPrimary} onChange={f("heroPrimary")} />
          <Text label="Secondary button label" value={h.heroSecondary} onChange={f("heroSecondary")} />
        </div>
        <ImageField label="Hero image URL" value={h.heroImage} onChange={f("heroImage")} />
      </Panel>
      <Panel className="space-y-4">
        <h2 className="text-xl">About section</h2>
        <Text label="Heading" value={h.aboutHeading} onChange={f("aboutHeading")} />
        <Text label="Description" area value={h.aboutDescription} onChange={f("aboutDescription")} />
        <ImageField label="About image URL" value={h.aboutImage} onChange={f("aboutImage")} />
      </Panel>
      <Panel className="space-y-4">
        <h2 className="text-xl">Contact call-to-action</h2>
        <Text label="Heading" value={h.ctaHeading} onChange={f("ctaHeading")} />
        <Text label="Description" area value={h.ctaDescription} onChange={f("ctaDescription")} />
      </Panel>
      <SaveBar onSave={() => { save(); notify("Homepage saved"); }} />
    </div>
  );
}

function AboutEdit({ notify }: N) {
  const [a, set, save] = useDraft("about");
  const setHl = (i: number, k: "title" | "text", v: string) => set({ ...a, highlights: a.highlights.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <Text label="About heading" value={a.heading} onChange={(v) => set({ ...a, heading: v })} />
        <Text label="Brand description" area value={a.description} onChange={(v) => set({ ...a, description: v })} />
        <Text label="Business overview" area value={a.overview} onChange={(v) => set({ ...a, overview: v })} />
        <ImageField label="Supporting image URL" value={a.image} onChange={(v) => set({ ...a, image: v })} />
      </Panel>
      <Panel className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Jewellery highlights</h2>
          <button onClick={() => set({ ...a, highlights: [...a.highlights, { title: "", text: "" }] })} className="btn-outline">Add highlight</button>
        </div>
        {a.highlights.map((h, i) => (
          <div key={i} className="grid gap-3 border-t border-border pt-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <Text label="Title" value={h.title} onChange={(v) => setHl(i, "title", v)} />
            <Text label="Text" value={h.text} onChange={(v) => setHl(i, "text", v)} />
            <button onClick={() => set({ ...a, highlights: a.highlights.filter((_, j) => j !== i) })} className="btn-outline text-destructive">Remove</button>
          </div>
        ))}
      </Panel>
      <SaveBar onSave={() => { save(); notify("About Us saved"); }} />
    </div>
  );
}

function ContactEdit({ notify }: N) {
  const [c, set, save] = useDraft("contact");
  const [err, setErr] = useState("");
  const f = (k: keyof typeof c) => (v: string) => set({ ...c, [k]: v });
  const submit = () => {
    if (!c.businessName.trim() || !c.phone.trim() || !/^\S+@\S+\.\S+$/.test(c.email)) return setErr("Business name, phone and a valid email are required.");
    setErr(""); save(); notify("Contact details saved");
  };
  return (
    <Panel className="max-w-2xl space-y-4">
      <Text label="Business name" value={c.businessName} onChange={f("businessName")} />
      <Text label="Phone number" value={c.phone} onChange={f("phone")} />
      <Text label="Email address" type="email" value={c.email} onChange={f("email")} />
      <Text label="City and state" value={c.cityState} onChange={f("cityState")} />
      <Text label="Address" value={c.address} onChange={f("address")} />
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <SaveBar onSave={submit} />
    </Panel>
  );
}

function Settings({ notify }: N) {
  const { data, update } = useStore();
  const [s, set, save] = useDraft("settings");
  return (
    <div className="space-y-6">
      <Panel className="max-w-2xl space-y-4">
        <Text label="Website title" value={s.siteTitle} onChange={(v) => set({ ...s, siteTitle: v })} />
        <Text label="Logo text" value={s.logoText} onChange={(v) => set({ ...s, logoText: v })} />
        <Text label="Footer credit" value={s.footerCredit} onChange={(v) => set({ ...s, footerCredit: v })} />
        <Text label="Featured products shown on homepage" type="number" value={s.productCount} onChange={(v) => set({ ...s, productCount: Math.max(1, Number(v) || 1) })} />
        <SaveBar onSave={() => { save(); notify("Settings saved"); }} />
      </Panel>
      <Panel className="max-w-2xl">
        <h2 className="text-xl">Featured products</h2>
        <ul className="mt-3 divide-y divide-border">
          {sortedProducts(data).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>{p.name}</span>
              <Toggle on={p.featured} label={`Featured ${p.name}`} onClick={() => update((d) => ({ ...d, products: d.products.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)) }))} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------- enquiries ---------- */
function Enquiries({ notify }: N) {
  const { data, update } = useStore();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const [view, setView] = useState<Enquiry | null>(null);
  const [del, setDel] = useState<Enquiry | null>(null);
  const t = q.trim().toLowerCase();
  const list = [...data.enquiries].sort((a, b) => b.date.localeCompare(a.date))
    .filter((e) => (st === "all" || e.status === st) && (!t || [e.name, e.email, e.phone, e.message].some((x) => x.toLowerCase().includes(t))));
  const setStatus = (id: string, status: Enquiry["status"]) => {
    update((d) => ({ ...d, enquiries: d.enquiries.map((e) => (e.id === id ? { ...e, status } : e)) }));
    notify(`Marked as ${status}`);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <input aria-label="Search enquiries" placeholder="Search enquiries" value={q} onChange={(e) => setQ(e.target.value)} className="field min-w-52 flex-1" />
        <select aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)} className="field w-auto">
          <option value="all">All statuses</option><option>New</option><option>Contacted</option><option>Resolved</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground">Demo enquiries are stored in this browser only; no emails are sent.</p>
      <div className="overflow-x-auto border border-border bg-ivory">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-champagne/50 text-left text-xs uppercase tracking-widest">
            <tr><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((e) => (
              <tr key={e.id}>
                <td className="p-3 text-ink">{e.name}</td>
                <td className="p-3">{e.email}<br /><span className="text-xs">{e.phone}</span></td>
                <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <select aria-label={`Status for ${e.name}`} value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value as Enquiry["status"])} className="field w-auto py-1">
                    <option>New</option><option>Contacted</option><option>Resolved</option>
                  </select>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setView(e)} className="px-2 underline-offset-4 hover:underline">View</button>
                  <button onClick={() => setDel(e)} className="px-2 text-destructive underline-offset-4 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No enquiries found.</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal open={!!view} onClose={() => setView(null)} label="Enquiry details">
        {view && (
          <div className="space-y-2 p-8 text-sm">
            <h2 className="text-2xl">{view.name}</h2>
            <p>Email: <a href={`mailto:${view.email}`} className="text-gold-deep">{view.email}</a></p>
            <p>Phone: <a href={`tel:${view.phone}`} className="text-gold-deep">{view.phone}</a></p>
            <p>Date: {new Date(view.date).toLocaleString()}</p>
            <p>Status: {view.status}</p>
            <p className="whitespace-pre-wrap border-t border-border pt-3">{view.message}</p>
          </div>
        )}
      </Modal>
      <Confirm text={del ? `Delete the enquiry from ${del.name}?` : null} onNo={() => setDel(null)}
        onYes={() => { if (del) { update((d) => ({ ...d, enquiries: d.enquiries.filter((e) => e.id !== del.id) })); notify("Enquiry deleted"); } setDel(null); }} />
    </div>
  );
}
