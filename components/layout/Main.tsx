"use client";

import { usePathname } from "next/navigation";

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={isHome ? "grow" : "grow pt-24"}>
      {children}
    </main>
  );
}
