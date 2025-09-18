"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, clearRole } from "@/lib/role";

export default function MobileAuthFooter() {
  const router = useRouter();
  // Hydration-safe: default to guest and update after mount
  const [role, setRoleState] = useState<"guest" | "user" | "admin">("guest");
  useEffect(() => {
    const r = getRole();
    if (r === "admin" || r === "user") setRoleState(r);
    else setRoleState("guest");
  }, []);
  const isAuthed = role === "admin" || role === "user";

  return (
    <div className="mobile-auth-footer mobile-only">
      {isAuthed ? (
        <button
          className="auth-btn"
          onClick={() => { clearRole(); router.push("/"); }}
        >
          <i className="fa-solid fa-right-from-bracket" />
          <span>Logout</span>
        </button>
      ) : (
        <Link href="/auth" className="auth-btn">
          <i className="fa-solid fa-right-to-bracket" />
          <span>Login</span>
        </Link>
      )}
    </div>
  );
}
