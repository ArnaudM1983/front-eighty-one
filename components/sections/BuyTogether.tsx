import ProductCard from "../product/ProductCard";
import SliderWrapper from "../ui/SliderWrapper";
import ButtonLink from "../ui/ButtonLink"; // Ajout de l'import pour le bouton

type RelatedProduct = {
    id: number;
    name: string;
    slug: string;
    price: string | number; 
    main_image: string | null;
    stock?: number;
    featured?: boolean;
};

// Props du composant
type Props = {
    products?: RelatedProduct[]; 
};

// Fonction de fallback : récupère les "Featured" si pas de produits liés
async function fetchFeaturedProducts() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products?featured=true`,
            { next: { revalidate: 3600 } } // Cache 1h
        );
        if (!res.ok) return [];
        const allProducts = await res.json();
        // Si l'API ne filtre pas déjà par 'featured', on le fait ici
        return allProducts.filter((p: any) => p.featured);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function BuyTogether({ products = [] }: Props) {
    let productsToDisplay = products;
    // On crée un booléen pour savoir si on affiche les produits liés ou le fallback
    const isCrossSell = productsToDisplay && productsToDisplay.length > 0;

    // Si aucun produit lié n'est passé en props, on charge les Best Sellers en secours
    if (!isCrossSell) {
        productsToDisplay = await fetchFeaturedProducts();
    }

    // Si toujours rien, on n'affiche pas la section
    if (productsToDisplay.length === 0) return null;

    return (
        <section className="w-full px-8 pt-20 pb-24 bg-gray-50 border-t border-gray-100 mt-16">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER (Repris du style de tes Guides) */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <div className="flex-1">
                        <div className="text-(--primary) text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                            {isCrossSell ? "Le combo parfait" : "Les incontournables"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">
                            {isCrossSell ? "Souvent achetés ensemble" : "Nos meilleures ventes"}
                        </h2>
                        <p className="text-gray-600 max-w-2xl italic border-l-2 border-(--primary) pl-4 text-sm md:text-base">
                            {isCrossSell 
                                ? "Complétez votre équipement avec ces articles recommandés par le shop pour accompagner votre achat."
                                : "Les références les plus plébiscitées par les artistes et passionnés au shop."}
                        </p>
                    </div>
                    
                    <ButtonLink href="/shop">
                        Voir tout le shop
                    </ButtonLink>
                </div>

                {/* SLIDER */}
                <SliderWrapper slidesToShow={4} autoplay={true}>
                    {productsToDisplay.map((product) => (
                        <div key={product.id} className="px-2">
                            {/* On cast les types si besoin pour ProductCard */}
                            <ProductCard product={{
                                ...product,
                                price: Number(product.price), // Conversion string -> number si besoin
                                stock: product.stock ?? 10,   // Valeur par défaut si stock manquant dans le résumé
                                featured: product.featured ?? false,
                                main_image: product.main_image ?? ""
                            }} />
                        </div>
                    ))}
                </SliderWrapper>
            </div>
        </section>
    );
}