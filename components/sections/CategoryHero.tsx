"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  description: string;
  backgroundImage: string;
  scrollTargetId?: string; 
};

const CategoryHero = ({ title, description, backgroundImage, scrollTargetId }: Props) => {
  const handleScroll = () => {
    if (!scrollTargetId) return;
    const target = document.getElementById(scrollTargetId);
    if (!target) return;

    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };

  return (
    <div className="w-full relative" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Background */}
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-white/50 to-black z-10" />

      {/* Texte */}
      <div className="absolute inset-0 z-20 max-w-6xl mx-auto px-6 flex flex-col h-full justify-start">
        <div className="text-left mt-6">
          <h1 className="text-black mb-4 text-6xl font-bold">{title}</h1>
          <p className="text-sm lg:text-xl text-black mb-6">{description}</p>
        </div>
      </div>

      {/* Chevron en bas */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce z-20"
        onClick={handleScroll}
      >
        <ChevronDown className="text-white" strokeWidth={0.5} width={120} height={120} />
      </div>
    </div>
  );
};

export default CategoryHero;
