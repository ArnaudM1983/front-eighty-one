"use client";
import { useEffect, useRef } from "react";
import SearchField from "./SearchField";

type Props = {
  isOpen: boolean;
  isHome: boolean;
};

export default function SearchBarOverlay({ isOpen, isHome }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP flou uniquement sous le header */}
      <div
        className="absolute left-0 top-full w-full h-[calc(100vh-5rem)] backdrop-blur-sm bg-black/20 z-10"
        style={{ pointerEvents: "none" }}
      />

      {/* Search bar */}
      <div className="relative z-20 px-6 lg:px-16 py-4 transition-all duration-500">
        <SearchField ref={inputRef} isHome={isHome} />
      </div>
    </>
  );
}
