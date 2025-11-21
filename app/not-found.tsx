"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oups ! Cette page n'existe pas.</p>
      <ButtonLink href="/">
        Retour à l’accueil
      </ButtonLink>
    </div>
  );
}
