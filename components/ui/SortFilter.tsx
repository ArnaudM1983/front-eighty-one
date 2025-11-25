"use client"

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
    label: string;
    value: string;
};

type Props = {
    disabled?: boolean;
    options?: Option[];
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export default function SortFilter({
    disabled = true,
    options = [
        { label: "Par défaut", value: "default" },
        { label: "Prix croissant", value: "price-asc" },
        { label: "Prix décroissant", value: "price-desc" },
        { label: "Nom A-Z", value: "name-asc" },
        { label: "Nom Z-A", value: "name-desc" },
    ],
    defaultValue = "default",
    onChange = () => { },
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setOpen(false);
    };

    return (<div className="relative w-48" ref={ref}>
        <div
            className={`px-3 py-2 bg-white rounded-md cursor-pointer flex justify-between items-center border border-gray-300 ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            onClick={() => !disabled && setOpen(!open)}
        >
            <span className={defaultValue ? "text-gray-800" : "text-gray-400"}>
                {options.find((o) => o.value === defaultValue)?.label || "Trier par"} </span>
            <ChevronDown className="text-gray-500" />
        </div>
        {open && !disabled && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {options.map((opt) => (
                    <li
                        key={opt.value}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelect(opt.value)}
                    >
                        {opt.label}
                    </li>
                ))}
            </ul>
        )}
    </div>

    );
}
