import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui-bits";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Pratik Gold" },
      { name: "description", content: "Pratik Gold demo admin login." },
      { property: "og:title", content: "Admin Login — Pratik Gold" },
      { property: "og:description", content: "Demo admin access for the Pratik Gold website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, authed, ready } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (ready && authed) navigate({ to: "/admin/dashboard" });
  }, [ready, authed, navigate]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pw) return setErr("Please enter email and password.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr("Please enter a valid email address.");
    if (login(email, pw)) {
      setErr("");
      navigate({ to: "/admin/dashboard" });
    } else setErr("Invalid email or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-md border border-gold/40 bg-ivory p-8">
        <p className="eyebrow">Pratik Gold</p>
        <h1 className="mt-3 text-3xl">Admin Login</h1>
        <div className="gold-rule mt-5" />
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="em" className="mb-1 block text-xs uppercase tracking-widest">Email</label>
            <input id="em" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="pw" className="mb-1 block text-xs uppercase tracking-widest">Password</label>
            <div className="flex gap-2">
              <input id="pw" type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="field" />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="btn-outline px-3">
                <Icon name={show ? "eyeOff" : "eye"} className="h-4 w-4" />
              </button>
            </div>
          </div>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="btn-gold w-full">Login</button>
          <div className="border border-gold/30 bg-paper p-3 text-xs leading-relaxed">
            <p className="font-semibold text-ink">Demo credentials</p>
            <p>Email: admin@pratikgold.demo</p>
            <p>Password: GoldAdmin@123</p>
            <p className="mt-1 text-muted-foreground">Frontend-only demo login — not production security.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
