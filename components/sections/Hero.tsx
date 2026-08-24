import Image from "next/image";

type Props = {};

const Hero = (props: Props) => {
  const text = "INFORMATIONS EXPÉDITIONS : FERMETURE DU 10 AU 24 AOÛT - REPRISE DES ENVOIS LE 25 AOÛT - MERCI POUR VOTRE PATIENCE";

  // CSS for seamless marquee loop and pause on hover/active (touch)
  const styles = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: marquee 25s linear infinite;
    }
    .group:hover .animate-marquee,
    .group:active .animate-marquee {
      animation-play-state: paused;
    }
  `;

  return (
    <div className="min-h-screen pt-16 bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="relative flex items-center justify-center w-full max-w-[450px] px-6">
        {/* Logo */}
        <Image
          src="/logo-81.webp"
          alt="Logo"
          width={400}
          height={400}
          className="object-contain opacity-90 select-none pointer-events-none"
          priority
          fetchPriority="high"
        />

        {/* Marquee Announcement Overlay (Taller height with py-6 and larger font) */}
        {/* <div className="group absolute w-screen left-1/2 -translate-x-1/2 overflow-hidden py-5 md:py-6 bg-[#FFF100] text-black font-black uppercase tracking-widest text-sm md:text-base border-y-2 border-black/15 rotate-[-2.5deg] shadow-2xl cursor-pointer select-none z-10 transition-transform hover:scale-105 duration-300">
          <div className="flex animate-marquee">
            <div className="flex shrink-0 items-center justify-around gap-12 px-6">
              <span>{text}</span>
            </div>
            <div className="flex shrink-0 items-center justify-around gap-12 px-6">
              <span>{text}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
