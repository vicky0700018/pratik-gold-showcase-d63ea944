import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import ring1 from "@/assets/ring1.jpg";
import ring2 from "@/assets/ring2.jpg";
import ring3 from "@/assets/ring3.jpg";
import ring4 from "@/assets/ring4.jpg";
import ear1 from "@/assets/earring1.jpg";
import ear2 from "@/assets/earring2.jpg";
import ear3 from "@/assets/earring3.jpg";
import ear4 from "@/assets/earring4.jpg";

export const IMAGES = { hero, about, ring1, ring2, ring3, ring4, ear1, ear2, ear3, ear4 };

export type Category = { id: string; name: string; description: string; image: string };
export type Product = {
  id: string; name: string; categoryId: string; code: string; description: string;
  image: string; featured: boolean; available: boolean; order: number;
};
export type GalleryItem = { id: string; image: string; title: string; caption: string; category: string; order: number };
export type Enquiry = { id: string; name: string; email: string; phone: string; message: string; status: "New" | "Contacted" | "Resolved"; date: string };
export type Data = {
  categories: Category[];
  products: Product[];
  gallery: GalleryItem[];
  enquiries: Enquiry[];
  home: {
    heroEyebrow: string; heroHeading: string; heroDescription: string; heroImage: string;
    heroPrimary: string; heroSecondary: string;
    aboutHeading: string; aboutDescription: string; aboutImage: string;
    ctaHeading: string; ctaDescription: string;
  };
  about: { heading: string; description: string; overview: string; image: string; highlights: { title: string; text: string }[] };
  contact: { businessName: string; phone: string; email: string; cityState: string; address: string };
  settings: { siteTitle: string; logoText: string; footerCredit: string; productCount: number };
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const SEED: Data = {
  categories: [
    { id: "rings", name: "Gold Ring", description: "Ladies gold rings in party wear, round and classic carat styles.", image: ring1 },
    { id: "earrings", name: "Gold Earrings", description: "Gold earrings for party wear and casual everyday styling.", image: ear1 },
  ],
  products: [
    { id: "p1", name: "Party Wear Ladies Gold Ring", categoryId: "rings", code: "", description: "A statement gold ring with detailed filigree work, styled for celebrations and evening occasions.", image: ring4, featured: true, available: true, order: 1 },
    { id: "p2", name: "10 mm Round Ladies Gold Ring", categoryId: "rings", code: "", description: "A polished round gold band with a 10 mm profile and a smooth, classic finish.", image: ring2, featured: true, available: true, order: 2 },
    { id: "p3", name: "LR-21445 18 Carat Ladies Gold Ring", categoryId: "rings", code: "LR-21445", description: "An 18 carat ladies gold ring with a delicate floral motif for refined daily wear.", image: ring3, featured: false, available: true, order: 3 },
    { id: "p4", name: "22 Carat Ladies Gold Ring", categoryId: "rings", code: "", description: "A 22 carat ladies gold ring with an ornate traditional floral design.", image: ring1, featured: true, available: true, order: 4 },
    { id: "p5", name: "ET-23630 Party Wear Gold Earring", categoryId: "earrings", code: "ET-23630", description: "Party wear gold drop earrings with intricate detailing and pearl accents.", image: ear1, featured: true, available: true, order: 5 },
    { id: "p6", name: "BET-23061 20 Carat Ladies Gold Earring", categoryId: "earrings", code: "BET-23061", description: "20 carat ladies gold jhumka earrings with traditional dome craftsmanship.", image: ear3, featured: true, available: true, order: 6 },
    { id: "p7", name: "Casual Wear Ladies Gold Earrings", categoryId: "earrings", code: "", description: "A versatile set of gold hoops and studs for easy everyday elegance.", image: ear2, featured: false, available: true, order: 7 },
    { id: "p8", name: "Casual Wear Ladies Gold Earring", categoryId: "earrings", code: "", description: "Light gold leaf-shaped studs with fine texture, made for casual wear.", image: ear4, featured: false, available: true, order: 8 },
  ],
  gallery: [
    { id: "g1", image: hero, title: "The Display", caption: "Rings and earrings on black velvet", category: "Compositions", order: 1 },
    { id: "g2", image: ring1, title: "Floral Ring", caption: "Ornate ladies gold ring, close-up", category: "Gold Rings", order: 2 },
    { id: "g3", image: ear3, title: "Jhumka", caption: "Traditional gold jhumka earrings", category: "Gold Earrings", order: 3 },
    { id: "g4", image: about, title: "Everyday Grace", caption: "Gold ring and studs, styled", category: "Occasion Wear", order: 4 },
    { id: "g5", image: ring4, title: "Filigree Dome", caption: "Party wear ring detail", category: "Close-ups", order: 5 },
    { id: "g6", image: ear1, title: "Drop Earrings", caption: "Party wear gold earrings with pearls", category: "Occasion Wear", order: 6 },
    { id: "g7", image: ring2, title: "Gold Bands", caption: "Polished round gold rings", category: "Gold Rings", order: 7 },
    { id: "g8", image: ear2, title: "Hoops & Studs", caption: "Casual gold earrings on marble", category: "Gold Earrings", order: 8 },
    { id: "g9", image: ring3, title: "Petal Ring", caption: "Delicate floral gold ring", category: "Close-ups", order: 9 },
    { id: "g10", image: ear4, title: "Leaf Studs", caption: "Textured gold leaf earrings", category: "Close-ups", order: 10 },
  ],
  enquiries: [],
  home: {
    heroEyebrow: "THE ART OF GOLD",
    heroHeading: "Timeless Gold. Elegant Expressions.",
    heroDescription: "Discover elegant gold rings and earrings with Pratik Gold, featuring jewellery styles for celebrations, special occasions and everyday elegance.",
    heroImage: hero, heroPrimary: "Explore Our Collection", heroSecondary: "Contact Us",
    aboutHeading: "A Celebration of Gold and Elegance",
    aboutDescription: "Pratik Gold presents an elegant selection of gold rings and earrings, showcasing jewellery styles for different occasions.",
    aboutImage: about,
    ctaHeading: "Looking for Elegant Gold Jewellery?",
    ctaDescription: "Connect with Pratik Gold to enquire about gold rings and earrings.",
  },
  about: {
    heading: "About Pratik Gold",
    description: "Pratik Gold is a gold jewellery business based in Mumbai, Maharashtra, presenting a curated selection of gold rings and gold earrings.",
    overview: "Our collection spans party wear, casual wear and classic carat styles, giving customers a range of designs for celebrations, special occasions and everyday elegance. Reach out to enquire about any piece.",
    image: about,
    highlights: [
      { title: "Gold Rings", text: "Ladies gold rings including party wear, round band and carat-specific designs." },
      { title: "Gold Earrings", text: "Gold earrings from statement party wear pieces to light casual studs and hoops." },
      { title: "Enquiry-Led Service", text: "Contact us directly by phone or email to learn more about any design." },
    ],
  },
  contact: { businessName: "Pratik Gold", phone: "07942704033", email: "partikgold@gmail.com", cityState: "Mumbai, Maharashtra", address: "Mumbai, Maharashtra, India" },
  settings: { siteTitle: "Pratik Gold — Gold Rings & Earrings, Mumbai", logoText: "Pratik Gold", footerCredit: "Designed and development by SOSynch Ai Tech", productCount: 6 },
};

const KEY = "pratik-gold-data-v1";
const AUTH = "pratik-gold-admin";

type Ctx = {
  data: Data; ready: boolean;
  update: (fn: (d: Data) => Data) => void;
  reset: () => void;
  authed: boolean; login: (e: string, p: string) => boolean; logout: () => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(SEED);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...SEED, ...JSON.parse(raw) });
      setAuthed(localStorage.getItem(AUTH) === "1");
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => { if (ready) document.title = document.title || data.settings.siteTitle; }, [ready, data.settings.siteTitle]);

  const value: Ctx = {
    data, ready,
    update: (fn) => setData((d) => fn(d)),
    reset: () => setData(SEED),
    authed,
    login: (e, p) => {
      if (e.trim().toLowerCase() === "admin@pratikgold.demo" && p === "GoldAdmin@123") {
        localStorage.setItem(AUTH, "1"); setAuthed(true); return true;
      }
      return false;
    },
    logout: () => { localStorage.removeItem(AUTH); setAuthed(false); },
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}

export const sortedProducts = (d: Data) => [...d.products].sort((a, b) => a.order - b.order);
export const catName = (d: Data, id: string) => d.categories.find((c) => c.id === id)?.name ?? "Uncategorised";
