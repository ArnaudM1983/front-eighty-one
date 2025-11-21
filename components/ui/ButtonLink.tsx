"use client";

import React from "react";
import Link from "next/link";

type Props = {
  href?: string; 
  onClick?: () => void; 
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

const ButtonLink = ({ href, onClick, children, className, target, rel }: Props) => {
  const baseStyle = `
    group inline-block px-6 py-2 font-normal rounded-4xl border
    border-[var(--primary)] bg-[var(--primary)] text-white
    hover:bg-white hover:text-[var(--primary)] hover:border-[var(--primary)]
    transition-colors duration-200 cursor-pointer
    ${className || ""}
  `;

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={baseStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseStyle}>
      {children}
    </button>
  );
};

export default ButtonLink;
