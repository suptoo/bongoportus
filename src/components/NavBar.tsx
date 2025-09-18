"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getRole, clearRole } from "@/lib/role";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Start as 'guest' to keep SSR and first client render identical; update after mount
  const [role, setRoleState] = useState<"guest" | "user" | "admin">("guest");
  useEffect(() => {
    setRoleState(getRole());
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAuthed = role === "admin" || role === "user";
  const rightCta = isAuthed ? (
    <button className="admin-btn desktop-only" onClick={() => { clearRole(); setRoleState("guest"); router.push("/"); }}>
      Logout
    </button>
  ) : (
    <Link href="/auth" className="admin-btn desktop-only">Login</Link>
  );

  // Links: guest = Home, Chat, Login; authed user/admin = Chat, Deals, Orders, Dashboard
  const menu = useMemo(() => {
    if (!isAuthed) {
      return [
        { href: "/", label: "Home" },
        { href: "/auth?next=%2Fuser%3Ftab%3Dchat", label: "Chat" },
      ];
    }
    const base = role === "admin" ? "/admin" : "/user";
    return [
      { href: `${base}?tab=chat`, label: "Chat" },
      { href: `${base}/deals`, label: "Deals" },
      { href: `${base}/orders`, label: "Orders" },
      { href: `${base}/dashboard`, label: "Dashboard" },
    ];
  }, [isAuthed, role]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">BongoPortus</Link>

        {/* Desktop links */}
        <ul className="nav-links desktop-nav">
          {menu.map((l) => {
            const baseHref = l.href.split("?")[0];
            const active = pathname === baseHref;
            return (
              <li key={l.href}>
                <Link href={l.href} className={active ? "active-link" : undefined}>
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            {rightCta}
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className={`hamburger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        <ul>
          {menu.map((l) => {
            const baseHref = l.href.split("?")[0];
            const active = pathname === baseHref;
            return (
              <li key={l.href}>
                <Link href={l.href} className={active ? "active-link" : undefined}>
                  <span>{l.label}</span>
                </Link>
              </li>
            );
          })}
          {/* No auth button in mobile drawer; handled by MobileAuthFooter */}
        </ul>
      </div>
    </nav>
  );
}
