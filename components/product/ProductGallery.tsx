"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  id: number;
  url: string;
  alt?: string | null;
};

type Props = {
  mainImage: string;
  images: GalleryImage[];
  alt: string;
};

const ProductGallery = ({ mainImage, images, alt }: Props) => {
  const allImages = [{ id: 0, url: mainImage, alt }, ...images];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = allImages[currentIndex].url;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex gap-4 relative">
      {/* Miniatures (desktop only) */}
      <div className="hidden md:flex md:flex-col gap-3 w-20">
        {allImages.map((img, idx) => (
          <img
            key={img.id}
            src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${img.url}`}
            alt={img.alt ?? alt}
            className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
              currentIndex === idx ? "border-blue-600" : "border-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      {/* Image principale */}
      <div className="flex-1 relative overflow-hidden rounded">
        {/* Chevron gauche */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white/70 p-1 rounded-full md:hidden"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Chevron droit */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white/70 p-1 rounded-full md:hidden"
        >
          <ChevronRight size={24} />
        </button>

        <img
          src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${currentImage}`}
          alt={alt}
          className="w-full h-108 object-contain rounded transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
