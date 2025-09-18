"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRole } from "@/lib/role";

export default function MobileTabBar() {
  const pathname = usePathname();
  const role = getRole();
  const isAuthed = role === "admin" || role === "user";
  const base = role === "admin" ? "/admin" : "/user";

  const tabs = !isAuthed
    ? [
        { href: "/", label: "Home", icon: "fa-house" },
        { href: "/admin", label: "Chat", icon: "fa-comments" },
      ]
    : [
        { href: `${base}`, label: "Chat", icon: "fa-comments" },
        { href: `${base}/deals`, label: "Deals", icon: "fa-tags" },
        { href: `${base}/orders`, label: "Orders", icon: "fa-box" },
        { href: `${base}/dashboard`, label: "Dashboard", icon: "fa-gauge" },
      ];

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href} className={`tab ${active ? "active" : ""}`}>
            <i className={`fa-solid ${t.icon}`} aria-hidden="true" />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
