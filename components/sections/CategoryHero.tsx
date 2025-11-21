type Props = {
  title: string;
  description: string;
  backgroundImage: string;
};

const CategoryHero = ({ title, description, backgroundImage }: Props) => {
  return (
    <div className="w-full relative">
      <div
        className="w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-white/80 to-transparent z-10" />

      <div className="absolute inset-0 z-20 max-w-6xl mx-auto pt-2 text-left px-6">
        <h1 className="text-md lg:text-4xl font-bold text-black mb-4">{title}</h1>
        <p className="text-md blg:text-2xl text-black">{description}</p>
      </div>
    </div>
  );
};

export default CategoryHero;
