import Link from 'next/link';

export type Guide = {
  slug: string;
  title: string;
  description: string;
  image?: string;
};

interface GuideCardProps {
  guide: Guide;
}

const API_URL = process.env.NEXT_PUBLIC_SYMFONY_API_URL?.replace(/\/$/, '') || '';

export default function GuideCard({ guide }: GuideCardProps) {
  
  const imageUrl = guide.image 
    ? `${API_URL}${guide.image.startsWith('/') ? '' : '/'}${guide.image}` 
    : "/api/placeholder/800/350";

  return (
    <Link href={`/guides/${guide.slug}`} className="group">
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
        
        {/* Image format Cinema (21/9) */}
        <div className="aspect-[21/9] bg-gray-200 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={guide.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Contenu textuel */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
            Expertise Eightyone
          </div>
          
          <h3 className="font-bold text-xl md:text-2xl mb-2 uppercase leading-tight group-hover:text-blue-700 transition-colors">
            {guide.title}
          </h3>
          
          <p className="text-gray-500 text-base line-clamp-2 mb-4 leading-snug">
            {guide.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center font-bold uppercase tracking-widest text-[11px]">
            Lire le guide <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}