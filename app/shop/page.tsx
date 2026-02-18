import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, TrainFront, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Eightyone Store | Graffiti Shop Lyon depuis 2008",
  description: "81 Store, votre boutique spécialisée graffiti à Lyon depuis 2008. Découvrez notre histoire et nos horaires au 21 rue des Capucins.",
};

export default function ShopPage() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "La boutique" }
  ];

  return (
    <div className="bg-white">
      {/* Fil d'ariane discret */}
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      {/* SECTION HISTOIRE : L'ACCENT SUR 2008 */}
      <section className="max-w-6xl mx-auto py-12 md:py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="relative">
            {/* Badge d'ancienneté */}
            <div className="absolute -top-6 -right-6 z-10 bg-[#01B0F0] text-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
              <span className="text-[10px] font-black uppercase tracking-widest">Depuis</span>
              <span className="text-3xl font-black">2008</span>
            </div>
            
            <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="/81store-shop-5.jpg" 
                alt="Eightyone Store Lyon - Graffiti Shop" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
                  La référence <br/>
                  <span className="text-[#01B0F0]">Graffiti à Lyon</span>
                </h1>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Établi en 2008</p>
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p className="font-bold text-slate-900">
                81 Store est le graffiti shop de référence en France, spécialisé dans le matériel de graffiti et d’arts graphiques depuis 2008.
              </p>
              <p>
                Retrouvez un large choix de bombes de peinture, caps, marqueurs, Posca, encres, squeezers et accessoires dédiés à l’univers du graffiti. Créé en 2008, la boutique Eightyone Store est née de la passion du graffiti et de la volonté de proposer du matériel spécifique au service des artistes.
              </p>
              <p>
                Véritable lieu de vie, le shop s’est imposé comme un lieu incontournable à Lyon pour tout amateur de culture underground. 
              </p>
              <p>
                Diversifiant ses activités au fil des années, le « shop » – comme l’appellent les habitués – accueille désormais des artistes de la scène locale et nationale lors d’expositions, créant ainsi un véritable carrefour entre artistes et amateurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION INFOS PRATIQUES */}
      <section className="bg-(--background-secondary) text-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-12 h-1 bg-[#01B0F0]"></span>
                Nous rendre visite
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[#01B0F0] mb-4">
                    <MapPin size={24} />
                    <span className="font-black uppercase tracking-widest text-xs">Adresse</span>
                  </div>
                  <p className="text-xl font-bold">Eightyone Store</p>
                  <p className="text-slate-400">21 rue des Capucins<br/>69001 LYON</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[#01B0F0] mb-4">
                    <Clock size={24} />
                    <span className="font-black uppercase tracking-widest text-xs">Horaires</span>
                  </div>
                  <p className="text-slate-400"><span className="text-black font-bold">Lundi :</span> 14h - 19h</p>
                  <p className="text-slate-400"><span className="text-black font-bold">Mar. - Sam. :</span> 11h - 19h</p>
                  <p className="text-slate-400 italic text-sm">(Non stop)</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[#01B0F0] mb-4">
                    <Phone size={24} />
                    <span className="font-black uppercase tracking-widest text-xs">Contact</span>
                  </div>
                  <p className="text-xl font-bold">+04 78 91 18 52</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[#01B0F0] mb-4">
                    <TrainFront size={24} />
                    <span className="font-black uppercase tracking-widest text-xs">Accès</span>
                  </div>
                  <p className="text-slate-400">Métro A – <span className="text-black font-bold">Hôtel de Ville</span></p>
                  <p className="text-slate-400">Métro C – <span className="text-black font-bold">Croix-Paquet</span></p>
                </div>
              </div>
            </div>

            {/* MAP & IMAGE SHOP */}
            <div className="space-y-4">
              <Link 
                href="https://www.google.com/maps/search/Eightyone+Store+Lyon" 
                target="_blank"
                className="block relative h-[450px] rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-[#01B0F0] transition-colors group"
              >
                <Image 
                  src="/plan.png" 
                  alt="Plan d'accès Eightyone Store" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                  <span className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-xs shadow-2xl">Voir sur Google Maps</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      <InstagramFeed />
    </div>
  );
}