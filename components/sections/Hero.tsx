import Image from "next/image";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="min-h-screen pt-16 bg-black flex flex-col items-center justify-center">
      <h1 className="hidden">Eighty One Store - Matériel de graffiti et d'arts graphiques à Lyon</h1>
      <Image
        src="/logo-81.webp"
        alt="Logo"
        width={400}
        height={400}
        className="object-contain"
        priority
        fetchPriority="high"
      />
    </div>
  );
};

export default Hero;
