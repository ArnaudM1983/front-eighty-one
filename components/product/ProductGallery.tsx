"use client";

import { useState } from "react";

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
    const allImages = [
        { id: 0, url: mainImage, alt },
        ...images
    ];

    const [currentImage, setCurrentImage] = useState(allImages[0].url);

    return (
        <div className="flex gap-4 md:w-1/2">
            {/* Miniatures */}
            <div className="flex md:flex-col gap-3 w-full md:w-20">
                {allImages.map(img => (
                    <img
                        key={img.id}
                        src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${img.url}`}
                        alt={img.alt ?? alt}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border
                                ${currentImage === img.url ? "border-blue-600" : "border-gray-300"}`}
                        onClick={() => setCurrentImage(img.url)}
                    />
                ))}
            </div>

            {/* Image principale */}
            <div className="flex-1">
                <img
                    src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${currentImage}`}
                    alt={alt}
                    className="w-full h-96 object-cover rounded"
                />
            </div>
        </div>
    );
};

export default ProductGallery;
