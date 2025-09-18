"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getRole } from "@/lib/role";

export default function MobileTabBar() {
  const pathname = usePathname();
  // Hydration-safe: default to guest on SSR, then update after mount
  const [role, setRoleState] = useState<"guest" | "user" | "admin">("guest");

  useEffect(() => {
    const r = getRole();
    if (r === "admin" || r === "user") setRoleState(r);
    else setRoleState("guest");
  }, []);

  const { tabs, base } = useMemo(() => {
    const isAuthed = role === "admin" || role === "user";
    const basePath = role === "admin" ? "/admin" : "/user";
    if (!isAuthed) {
      return {
        base: "/",
        tabs: [
          { href: "/", label: "Home", icon: "fa-house" },
          { href: "/auth?next=%2Fuser%3Ftab%3Dchat", label: "Chat", icon: "fa-comments" },
        ],
      } as const;
    }
    return {
      base: basePath,
      tabs: [
        { href: `${basePath}?tab=chat`, label: "Chat", icon: "fa-comments" },
        { href: `${basePath}/deals`, label: "Deals", icon: "fa-tags" },
        { href: `${basePath}/orders`, label: "Orders", icon: "fa-box" },
        { href: `${basePath}/dashboard`, label: "Dashboard", icon: "fa-gauge" },
      ],
    } as const;
  }, [role]);

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {tabs.map((t) => {
        const baseHref = t.href.split("?")[0];
        const active = pathname === baseHref;
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
