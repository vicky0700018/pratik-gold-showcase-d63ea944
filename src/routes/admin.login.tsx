import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Pratik Gold" }, { name: "description", content: "Pratik Gold demo admin login." }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, authed, logout } = useStore();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return setErr("Please enter email and password.");
    setErr(login(email, pw) ? "" : "Invalid email or password.");
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-md border border-gold/40 bg-ivory p-8">
        <p className="eyebrow">Pratik Gold</p>
        <h1 className="mt-3 text-3xl">Admin Login</h1>
        {authed ? (
          <div className="mt-6 space-y-4">
            <p>You are signed in. The admin dashboard is not finished yet.</p>
            <button onClick={logout} className="btn-outline">Logout</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div><label htmlFor="em" className="mb-1 block text-xs uppercase tracking-widest">Email</label><input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" /></div>
            <div><label htmlFor="pw" className="mb-1 block text-xs uppercase tracking-widest">Password</label>
              <div className="flex gap-2"><input id="pw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} className="field" />
                <button type="button" onClick={() => setShow(!show)} className="btn-outline px-3">{show ? "Hide" : "Show"}</button></div></div>
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <button className="btn-gold w-full">Login</button>
            <p className="text-xs text-muted-foreground">Demo only: admin@pratikgold.demo / GoldAdmin@123. Not production security.</p>
          </form>
        )}
      </div>
    </main>
  );
}
