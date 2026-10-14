import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site";
import { Icon, PageHeader } from "@/components/ui-bits";
import { useStore, uid } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>) => ({ product: typeof s["product"] === "string" ? (s["product"] as string) : undefined }) as { product?: string },
  head: () => ({
    meta: [
      { title: "Contact Us — Pratik Gold, Mumbai" },
      { name: "description", content: "Contact Pratik Gold in Mumbai to enquire about gold rings and earrings. Call 07942704033." },
      { property: "og:title", content: "Contact Us — Pratik Gold" },
      { property: "og:description", content: "Enquire about gold rings and earrings with Pratik Gold." },
    ],
  }),
  component: Contact,
});

type Errs = Partial<Record<"name" | "email" | "phone" | "message", string>>;

function Contact() {
  const { data, update } = useStore();
  const { product } = Route.useSearch();
  const c = data.contact;
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [errs, setErrs] = useState<Errs>({});
  const [status, setStatus] = useState<"" | "ok" | "err">("");
  useEffect(() => { if (product) setF((x) => ({ ...x, message: `I would like to enquire about: ${product}` })); }, [product]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Errs = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "Please enter a valid email address.";
    if (!/^[+\d][\d\s-]{6,14}$/.test(f.phone.trim())) er.phone = "Please enter a valid phone number.";
    if (f.message.trim().length < 10) er.message = "Message should be at least 10 characters.";
    setErrs(er);
    if (Object.keys(er).length) { setStatus("err"); return; }
    update((d) => ({ ...d, enquiries: [{ id: uid(), ...f, status: "New", date: new Date().toISOString() }, ...d.enquiries] }));
    setF({ name: "", email: "", phone: "", message: "" });
    setStatus("ok");
  };

  const input = (k: keyof typeof f, label: string, type = "text") => (
    <div>
      <label htmlFor={k} className="mb-1 block text-xs uppercase tracking-widest text-ink">{label}</label>
      {k === "message"
        ? <textarea id={k} rows={5} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" aria-invalid={!!errs[k]} />
        : <input id={k} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" aria-invalid={!!errs[k]} />}
      {errs[k] && <p className="mt-1 text-sm text-destructive">{errs[k]}</p>}
    </div>
  );

  return (
    <SiteLayout>
      <PageHeader eyebrow="Get in touch" title="Contact Us" text={`Connect with ${c.businessName} to enquire about gold rings and earrings.`} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {[
            { icon: "pin", label: "Address", value: c.address },
            { icon: "phone", label: "Phone", value: c.phone, href: `tel:${c.phone}` },
            { icon: "mail", label: "Email", value: c.email, href: `mailto:${c.email}` },
          ].map((x) => (
            <div key={x.label} className="flex gap-5 border border-border bg-paper p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-gold-deep"><Icon name={x.icon} /></span>
              <div className="min-w-0">
                <p className="eyebrow">{x.label}</p>
                {x.href ? <a href={x.href} className="mt-1 block break-all text-lg text-ink hover:text-gold-deep">{x.value}</a> : <p className="mt-1 text-lg text-ink">{x.value}</p>}
              </div>
            </div>
          ))}
          <p className="pt-2 font-display text-2xl text-ink">{c.businessName}</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5 border border-border bg-paper p-6 md:p-10">
          <h2 className="text-3xl">Send an Enquiry</h2>
          <p className="text-sm text-muted-foreground">Demo form: enquiries are saved in this browser only and are not emailed.</p>
          <div className="grid gap-5 md:grid-cols-2">{input("name", "Name")}{input("email", "Email", "email")}</div>
          {input("phone", "Phone", "tel")}
          {input("message", "Message")}
          {status === "ok" && <p role="status" className="border border-success/40 bg-success/10 p-3 text-sm text-success">Thank you — your enquiry has been recorded.</p>}
          {status === "err" && <p role="alert" className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">Please correct the highlighted fields.</p>}
          <button type="submit" className="btn-gold w-full md:w-auto">Submit Enquiry</button>
        </form>
      </section>
    </SiteLayout>
  );
}
