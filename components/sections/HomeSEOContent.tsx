import Link from "next/link";

const HomeSEOContent = () => {
    const linkStyle = "font-bold text-black underline decoration-(--primary) decoration-2 underline-offset-4 hover:bg-(--primary)/10 transition-colors px-0.5 mx-0.5";

    return (
        <section className="px-6 py-20 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto">
                {/* H1 : Impact SEO maximal avec mots-clés stratégiques */}
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-black leading-none text-center">
                    Eightyone Store : <span className="text-(--primary)">Matériel Graffiti</span> & Fournitures Artistiques à Lyon depuis 2008.
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 leading-relaxed text-sm md:text-base">

                    {/* COLONNE 1 : Expertise & Ancrage Local */}
                    <div className="space-y-6">
                        <p className="text-justify">
                            Référence de la culture urbaine depuis plus de 15 ans, <strong>Eightyone Store</strong> est bien plus qu'un simple shop. Créé par des passionnés pour des créatifs, notre store vous ouvre ses portes au <strong className="text-black">21 Rue des Capucins (69001 Lyon)</strong> et sur notre boutique en ligne. Accédez en quelques clics aux meilleurs outils pour le 
                            <Link href="/bombes-de-peinture" className={linkStyle}>graffiti</Link>, 
                            le Street Art et les Beaux-Arts.
                        </p>
                        <p className="text-justify">
                            Que vous cherchiez une 
                            <Link href="/bombes-de-peinture/classiques" className={linkStyle}>bombe de peinture Montana Black</Link>, 
                            l'efficacité des sprays 
                            <Link href="/bombes-de-peinture/classiques" className={linkStyle}>Double-A</Link>, 
                            ou des vernis techniques, notre sélection répond aux exigences des pros. Nous proposons également un catalogue massif de 
                            <Link href="/bombes-de-peinture/caps" className={linkStyle}>caps diffuseurs</Link> 
                            pour moduler vos tracés avec précision.
                        </p>
                    </div>

                    {/* COLONNE 2 : Customisation & Logistique France */}
                    <div className="space-y-6">
                        <p className="text-justify">
                            Pour la customisation et le dessin, profitez de notre gamme complète de 
                            <Link href="/marqueurs-et-encres/posca-uni-paint" className={linkStyle}>marqueurs Posca</Link> 
                            et 
                            <Link href="/marqueurs-et-encres/posca-uni-paint" className={linkStyle}>feutres Uni-Paint</Link>. 
                            Retrouvez aussi les célèbres 
                            <Link href="/marqueurs-et-encres/squeezers" className={linkStyle}>squeezers OTR</Link> 
                            et des <Link href="/marqueurs-et-encres/encres" className={linkStyle}>encres</Link>  permanentes à haut débit. Eightyone Store, c'est l'assurance d'un matériel sélectionné pour sa tension de surface, son opacité et sa résistance UV.
                        </p>

                        {/* BLOC GEOGRAPHIQUE (Référencement National) */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-[11px] uppercase tracking-widest font-black text-gray-400 mb-3 italic">Expédition 100% France métropolitaine</p>
                            <p className="text-xs leading-relaxed">
                                <strong>Livraison rapide :</strong> Nous expédions votre matériel graffiti à Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Strasbourg, Montpellier, Bordeaux et Lille. Eightyone Store dessert également Reims, Brest, Saint-Étienne, Toulon, Grenoble, Annecy, Chambéry, Angers, Dijon, Le Mans et toutes les communes de l'Hexagone (Livraison France uniquement).
                            </p>
                        </div>
                    </div>
                </div>

                {/* FOOTER DU BLOC : Rappel des piliers E-E-A-T */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-6 items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-6 flex-wrap">
                        <Link href="/shop" className="hover:text-black transition-colors underline decoration-gray-200">Le Shop</Link>
                        <span className="h-1 w-1 bg-gray-300 rounded-full hidden sm:block"></span>
                        <Link href="/guides" className="hover:text-black transition-colors underline decoration-gray-200">Guides & Tutos</Link>
                        <span className="h-1 w-1 bg-gray-300 rounded-full hidden sm:block"></span>
                        <Link href="/accessoires-equipements/protections-equipements" className="hover:text-black transition-colors underline decoration-gray-200">Protections</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Conseils de graffeurs actifs</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeSEOContent;