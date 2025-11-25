"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type MobileMenuSection = {
    title: string;
    items?: { label: string; href: string }[];
    href?: string;
};

export default function MobileMenu({
    isOpen,
    isHome,
    sections,
    closeMenu,
}: {
    isOpen: boolean;
    isHome: boolean;
    sections: MobileMenuSection[];
    closeMenu: () => void;
}) {
    return (
        <nav
            className={`
                lg:hidden fixed top-0 left-0 w-full h-full z-40 
                flex flex-col pt-24 px-6 gap-4
                ${isHome ? "bg-black text-white" : "bg-white text-black"}
                transform transition-transform duration-500 ease-out
                ${isOpen ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            {sections.map((section, index) => (
                <MobileMenuItem
                    key={index}
                    {...section}
                    isHome={isHome}
                    closeMenu={closeMenu}
                />
            ))}
        </nav>
    );
}

function MobileMenuItem({
    title,
    href,
    items,
    isHome,
    closeMenu,
}: {
    title: string;
    href?: string;
    items?: { label: string; href: string }[];
    isHome: boolean;
    closeMenu: () => void;
}) {
    const [open, setOpen] = useState(false);

    // Lien simple
    if (!items) {
        return (
            <Link
                href={href || "#"}
                onClick={closeMenu}
                className="w-full text-left text-xl font-light uppercase py-2"
            >
                {title}
            </Link>
        );
    }

    // 🔹 Dropdown avec Chevron animable
    return (
        <div className="w-full">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left text-xl uppercase font-light flex justify-between items-center py-3"
            >
                {title}

                {/* Chevron Down */}
                <ChevronDown
                    className={`
                        w-5 h-5 transition-transform duration-300
                        ${open ? "rotate-180" : "rotate-0"}
                    `}
                />
            </button>

            {/* Contenu du dropdown */}
            <div
                className={`
                    overflow-hidden transition-all duration-300
                    ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <div className="flex flex-col pl-4 border-l border-gray-400/30">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`
                                py-2 text-lg font-light 
                                ${isHome ? "text-gray-300" : "text-gray-700"}
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
