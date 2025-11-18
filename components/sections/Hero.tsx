import Image from "next/image";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="min-h-screen pt-16 bg-black flex flex-col items-center justify-center">
      <Image
        src="/logo-81.png"    
        alt="Logo"
        width={400}
        height={400}
        className="object-contain"
      />
    </div>
  );
};

export default Hero;
