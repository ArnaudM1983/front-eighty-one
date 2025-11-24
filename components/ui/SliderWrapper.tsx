"use client";

import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
};

const SlickArrowFix = ({ onClick }: { onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="hidden" />
);

export default function SliderWrapper({
  children,
  slidesToShow = 4,
  autoplay = true,
}: Props) {
  // Ref typé en any pour éviter les erreurs TypeScript avec react-slick
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay,
    autoplaySpeed: 3000,
    nextArrow: <SlickArrowFix />,
    prevArrow: <SlickArrowFix />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, slidesToShow) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, slidesToShow) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>

      <div className="flex gap-3 mt-4 justify-end">
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="w-10 h-10 flex items-center justify-center rounded-full border-gray-300 hover:opacity-60 transition cursor-pointer"
        >
          <CircleArrowLeft size={40} color="#555555" strokeWidth={1} />
        </button>

        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="w-10 h-10 flex items-center justify-center rounded-full border-gray-300 hover:opacity-60 transition cursor-pointer"
        >
          <CircleArrowRight size={40} color="#555555" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
}
