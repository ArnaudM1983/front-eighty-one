import Link from "next/image";
import LinkNext from "next/link";

const HomeSEOContent = () => {
    return (
        <section className="px-6 py-20 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto">
                {/* H1 : Mot-clé principal + Localisation + Autorité */}
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-black leading-none text-center">
                    Eightyone Store : <span className="text-(--primary)">Matériel Graffiti</span> & Fournitures Artistiques à Lyon depuis 2008.
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 leading-relaxed text-sm md:text-base">

                    {/* COLONNE 1 : Expertise et Catalogue */}
                    <div className="space-y-6">
                        <p className="text-justify">
                            Fier d’être votre partenaire créatif depuis plus de 15 ans, <strong>Eightyone Store</strong> est le shop graffiti de référence. Créé par des passionnés pour des créatifs, notre shop vous ouvre ses portes au <strong className="text-black">21 Rue des Capucins (69001 Lyon)</strong> et sur notre boutique en ligne. Accédez en quelques clics aux meilleurs outils pour le <LinkNext href="/bombes-de-peinture" className="font-bold text-black underline decoration-(--primary) decoration-2 underline-offset-4 hover:bg-(--primary) transition-colors">Graffiti</LinkNext>, le Street Art et les Beaux-Arts.
                        </p>
                        <p className="text-justify">
                            Que vous cherchiez une <strong>bombe de peinture Montana Black</strong>, NBQ, ou la performance des sprays <strong>Double-A</strong>, notre sélection répond aux exigences des pros comme des débutants. Nous proposons des vernis techniques, des apprêts et un catalogue massif de <LinkNext href="/bombes-de-peinture/caps" className="text-black font-semibold hover:text-(--primary)">caps diffuseurs</LinkNext> pour moduler vos tracés avec précision.
                        </p>
                    </div>

                    {/* COLONNE 2 : Customisation et Livraison Géo-SEO */}
                    <div className="space-y-6">
                        <p className="text-justify">
                            Pour la customisation et le dessin, profitez de notre gamme complète de <LinkNext href="/marqueurs-et-encres" className="font-bold text-black underline decoration-(--primary) decoration-2 underline-offset-4 hover:bg-(--primary) transition-colors">marqueurs Posca</LinkNext>, feutres Uni Paint, <strong>squeezers OTR</strong> et encres permanentes à haut débit. Eightyone Store, c'est l'assurance d'un matériel sélectionné pour sa tension de surface, son opacité et sa résistance UV.
                        </p>

                        {/* BLOC GEOGRAPHIQUE (POUR GOOGLE) */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-[11px] uppercase tracking-widest font-black text-gray-400 mb-3">Expédition & Proximité</p>
                            <p className="text-xs leading-relaxed italic">
                                <strong>Livraison rapide partout en France :</strong> Nous expédions votre matériel graffiti à Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Strasbourg, Montpellier, Bordeaux et Lille. Eightyone Store dessert également Rennes, Reims, Saint-Étienne, Toulon, Grenoble, Angers, Dijon, Le Mans et toutes les communes de l'Hexagone via notre logistique dédiée 100% France.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FOOTER DU BLOC : Rappel E-E-A-T */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-6 items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Expertise Technique Lyon 1er</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                    <span>+ de 1000 références en stock</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                    <span>Conseils de graffeurs actifs</span>
                </div>
            </div>
        </section>
    );
};

export default HomeSEOContent;