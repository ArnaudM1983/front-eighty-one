import ProductCard from "../product/ProductCard";
import SliderWrapper from "../ui/SliderWrapper";

// On définit un type plus souple qui accepte ce que Symfony envoie
type RelatedProduct = {
    id: number;
    name: string;
    slug: string;
    price: string | number; // Symfony envoie string, ton ProductCard veut peut-être number
    main_image: string | null;
    stock?: number;
    featured?: boolean;
};

// Props du composant
type Props = {
    products?: RelatedProduct[]; // Optionnel car on a un fallback
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

    // Si aucun produit lié n'est passé en props, on charge les Best Sellers en secours
    if (!productsToDisplay || productsToDisplay.length === 0) {
        productsToDisplay = await fetchFeaturedProducts();
    }

    // Si toujours rien, on n'affiche pas la section
    if (productsToDisplay.length === 0) return null;

    return (
        <section className="px-4 py-16 bg-(--background-secondary)"> 
            <div className="max-w-6xl mx-auto">
                <h3 className="text-xl font-semibold mb-12">
                    {products.length > 0 ? "Souvent achetés ensemble" : "Nos meilleures ventes"}
                </h3>
                
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