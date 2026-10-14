import { useEffect, useState, type ReactNode, type ImgHTMLAttributes } from "react";

export function Img({ src, alt, className = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed || !src) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-champagne text-gold-deep ${className}`}>
        <span className="font-display text-2xl">PG</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} {...rest} />;
}

const paths: Record<string, ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 7l9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A10 10 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.8M6.1 6.1A17 17 0 002 12s4 7 10 7a10 10 0 005-1.3" /></>,
  diamond: <path d="M6 3h12l3 6-9 12L3 9z M3 9h18" />,
};
export function Icon({ name, className = "h-5 w-5" }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Modal({ open, onClose, label, children, wide }: { open: boolean; onClose: () => void; label: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full overflow-y-auto bg-ivory shadow-soft ${wide ? "max-w-4xl" : "max-w-lg"}`}>
        <button autoFocus onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-paper/90 text-ink hover:text-gold-deep">
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="border-b border-border bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl md:text-5xl">{title}</h1>
        <div className="gold-rule mx-auto mt-6" />
        {text && <p className="mx-auto mt-6 max-w-2xl leading-relaxed">{text}</p>}
      </div>
    </section>
  );
}
