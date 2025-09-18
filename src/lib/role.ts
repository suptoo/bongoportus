"use client";

type Role = "guest" | "user" | "admin";

const KEY = "bp_role";

function getRoleFromCookie(): Role | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )bp_role=([^;]+)/);
  if (!match) return null;
  try { return decodeURIComponent(match[1]) as Role; } catch { return null; }
}

export function getRole(): Role {
  if (typeof window === "undefined") return "guest";
  const cookieRole = getRoleFromCookie();
  if (cookieRole) return cookieRole;
  const r = window.localStorage.getItem(KEY) as Role | null;
  return r ?? "guest";
}

export function setRole(role: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, role);
}

export function clearRole() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  // Also clear non-HttpOnly role cookie for UI state
  document.cookie = "bp_role=; Max-Age=0; path=/";
}

export function useRole(): [Role, (r: Role) => void, () => void] {
  const [role, setState] = React.useState<Role>(getRole());
  const set = (r: Role) => { setRole(r); setState(r); };
  const clear = () => { clearRole(); setState("guest"); };
  React.useEffect(() => {
    const listener = () => setState(getRole());
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);
  return [role, set, clear];
}

import * as React from "react";
