"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oups ! Cette page n'existe pas.</p>
      <Link href="/" className="text-blue-600 underline">
        Retour à l’accueil
      </Link>
    </div>
  );
}
