"use client";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

type DropdownItem = {
    label: string;
    href: string;
};

type Props = {
    title: string;
    href: string;
    items: DropdownItem[];
};

export default function Dropdown({ title, href, items }: Props) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <div className="relative group flex items-center gap-1">
            {/* Lien parent dynamique */}
            <Link
                href={href}
                className="hover:opacity-70 uppercase font-normal flex items-center gap-1"
            >
                {title} <ChevronDown className="w-3 h-3" />
            </Link>

            {/* Dropdown container */}
            <div
                className={`
                    absolute left-0 top-full mt-0 w-48 pt-4
                    opacity-0 invisible -translate-y-2.5
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition-all duration-300 ease-out
                    z-50                   /*  ⬅️ Le plus important */
                    ${isHome ? "bg-black text-white" : "bg-white text-black"}
                `}
            >
                {/* Dropdown items */}
                {items.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            block px-4 py-2 font-normal
                            ${isHome ? "hover:bg-gray-800" : "hover:bg-gray-100"}
                            opacity-0 -translate-y-4
                            group-hover:opacity-100 group-hover:translate-y-0
                            transition-all duration-300
                            delay-[${index * 75}ms]
                        `}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
