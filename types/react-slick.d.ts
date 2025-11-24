// types/react-slick.d.ts
import { ReactNode } from "react";

declare module "react-slick" {
  export interface SlickSettings {
    children?: ReactNode;
    slidesToShow?: number;
    slidesToScroll?: number;
    infinite?: boolean;
    dots?: boolean;
    speed?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    nextArrow?: ReactNode;
    prevArrow?: ReactNode;
    responsive?: { breakpoint: number; settings: Partial<SlickSettings> }[];
    [key: string]: any;
  }

  export interface SliderMethods {
    slickNext: () => void;
    slickPrev: () => void;
    slickGoTo: (slide: number) => void;
    slickPlay: () => void;
    slickPause: () => void;
  }

  const Slider: (props: SlickSettings & { ref?: React.Ref<SliderMethods> }) => JSX.Element;

  export default Slider;
}
