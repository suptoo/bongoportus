"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole } from "@/lib/role";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  // Hydration-safe: assume guest on first render, update after mount
  const [role, setRoleState] = useState<"guest" | "user" | "admin">("guest");
  useEffect(() => {
    const r = getRole();
    setRoleState(r === "admin" || r === "user" ? r : "guest");
  }, []);
  const isAuthed = role === "admin" || role === "user";
  const base = role === "admin" ? "/admin" : "/user";

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (role === 'admin') {
      // Admin doesn't have search tab; route to chat instead
      router.push(`${base}?tab=chat`);
      return;
    }
    if (!isAuthed) {
      const next = !q ? `/user?tab=search` : `/user?tab=search&q=${encodeURIComponent(q)}`;
      router.push(`/auth?next=${encodeURIComponent(next)}`);
      return;
    }
    // User
    const target = !q ? `${base}?tab=search` : `${base}?tab=search&q=${encodeURIComponent(q)}`;
    router.push(target);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #000; color: #fff; }
        .wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px; }

        /* HERO */
        .hero {
          min-height: 70vh;
          display: grid; place-items: center; text-align: center; padding: 64px 0 32px;
          background: radial-gradient(1200px 600px at 50% -20%, rgba(255,255,255,0.06), transparent),
                      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
        }
        .title { font-weight: 800; letter-spacing: 0.5px; line-height: 1.1; margin-bottom: 12px; }
        .title span { background: linear-gradient(45deg, #6ee7b7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #a1a1aa; max-width: 640px; margin: 0 auto 24px; }

        /* QUICK ACTIONS (app-like) */
        .actions { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; max-width: 520px; margin: 0 auto; }
        .action {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 16px; border-radius: 14px; text-decoration: none; color: #fff;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .action:hover { transform: translateY(-2px); background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .action i { width: 18px; text-align: center; opacity: .9; }
        @media (max-width: 420px) { .actions { grid-template-columns: 1fr; } .action { padding: 18px; } }

        /* Search bar */
  .searchWrap { margin: 18px auto 8px; max-width: 640px; display: grid; grid-template-columns: 1fr auto; gap: 10px; }
        .searchInput { padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: #fff; outline: none; }
        .searchInput:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.2); }
        .searchBtn { padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,.1); background: linear-gradient(45deg, #22c55e, #3b82f6); color: #fff; font-weight: 700; }
  @media (max-width: 520px) { .searchWrap { grid-template-columns: 1fr; } .searchBtn { width: 100%; } }

        /* FEATURE CARDS */
        .section { padding: 28px 0 72px; }
        .cards { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .card {
          padding: 18px; border-radius: 16px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); min-height: 110px;
        }
        .card h3 { font-size: 1rem; font-weight: 700; margin: 2px 0 6px; }
        .card p { font-size: .9rem; color: #a1a1aa; }

        /* FOOTER */
        .footer { border-top: 1px solid rgba(255,255,255,.08); padding: 32px 0; color: #a1a1aa; font-size: .9rem; }

        /* RESPONSIVE TYPE SCALE */
        @media (min-width: 480px) { .title { font-size: 2.2rem; } .subtitle { font-size: 1rem; } }
        @media (min-width: 768px) { .title { font-size: 3rem; }   .subtitle { font-size: 1.05rem; } }
        @media (min-width: 1024px){ .title { font-size: 3.5rem; } }
      `}</style>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="wrap">
            <h1 className="title">Make Trade Simple with <span>BongoPortus</span></h1>
            <p className="subtitle">Global shopping, made simple. Source from Amazon and top suppliers and get fast air shipment to your door.</p>

            <form className="searchWrap" onSubmit={onSearch} role="search" aria-label="Product search">
              <input
                className="searchInput"
                type="search"
                placeholder="Search products (e.g. iPhone, shoes, headset)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="searchBtn" type="submit"><i className="fa-solid fa-magnifying-glass"/> Search</button>
            </form>
            <div className="actions">
              {/* Search Products: admin → chat, user → search, guest → auth next to user search */}
              <Link
                href={role === 'admin'
                  ? `${base}?tab=chat`
                  : (isAuthed ? `${base}?tab=search` : `/auth?next=${encodeURIComponent('/user?tab=search')}`)}
                className="action"
              >
                <i className="fa-solid fa-magnifying-glass"/> Search Products
              </Link>
              {/* Chat */}
              <Link
                href={isAuthed ? `${base}?tab=chat` : `/auth?next=${encodeURIComponent('/user?tab=chat')}`}
                className="action"
              >
                <i className="fa-solid fa-comments"/> Chat
              </Link>
              {/* Orders */}
              <Link
                href={isAuthed ? `${base}/orders` : `/auth?next=${encodeURIComponent('/user/orders')}`}
                className="action"
              >
                <i className="fa-solid fa-box"/> Orders
              </Link>
              {/* Cart: admin → chat, user → cart tab, guest → auth next to user cart */}
              <Link
                href={role === 'admin'
                  ? `${base}?tab=chat`
                  : (isAuthed ? `${base}?tab=cart` : `/auth?next=${encodeURIComponent('/user?tab=cart')}`)}
                className="action"
              >
                <i className="fa-solid fa-cart-shopping"/> Cart
              </Link>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="section">
          <div className="wrap">
            <div className="cards">
              <div className="card"><h3>Global Sourcing</h3><p>Amazon plus South Korea, China, and India—discover more in one place.</p></div>
              <div className="card"><h3>Fast Air Shipment</h3><p>Priority air cargo options for quicker delivery on popular items.</p></div>
              <div className="card"><h3>Mobile App Feel</h3><p>Streamlined UI built for thumbs—smooth and responsive on every phone.</p></div>
              <div className="card"><h3>Help When You Need</h3><p>Chat with support anytime to track, request, or change orders.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          © {new Date().getFullYear()} BongoPortus
        </div>
      </footer>
    </div>
  );
}