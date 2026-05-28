import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  sale_price?: number | string | null;
  final_price?: number | string;
  is_on_sale?: boolean;
  discount_label?: string | null;
  stock?: number;
  main_image: string | null;
  featured?: boolean;
  has_variants?: boolean;
  variants_count?: number;
  category_slugs?: string[]; 
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const words = product.name.split(" ");
  let brand = words[0];

  if (words[0] === "Double" && words[1]) {
    brand = `${words[0]} ${words[1]}`;
  }

  const isOutOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0;
  const showVariantsCount = product.has_variants && product.variants_count && product.variants_count > 0;
  
  const isUrbanWear = product.category_slugs?.includes("urban-wear");

  return (
    <Link href={`/produit/${product.slug}`} className="group">
      <div className="h-112 block bg-white overflow-hidden shadow transition rounded-2xl relative">

        <div className="w-full h-78 flex items-center justify-center overflow-hidden bg-white relative">
          {isOutOfStock && (
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-50 backdrop-blur-sm border border-red-100 rounded-lg shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Rupture</span>
            </div>
          )}

          <img
            src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${product.main_image}`}
            alt={product.name}
            loading="lazy"
            className={`object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
          />
        </div>

        <div className="px-6 flex flex-col justify-between pt-5 pb-5">
          <div className="space-y-1">
            <p className="uppercase text-[11px] font-black tracking-widest text-gray-400">{brand}</p>
            <p className="text-gray-800 font-medium truncate text-sm leading-tight">{product.name}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              {product.is_on_sale ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-xl tracking-tight text-red-600">{product.final_price} €</p>
                    {product.discount_label && (
                      <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap">
                        {product.has_variants ? "Jusqu'à " : ""}{product.discount_label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 line-through font-bold">{product.price} €</p>
                </>
              ) : (
                <p className="font-black text-xl tracking-tight text-gray-900">{product.price} €</p>
              )}
            </div>

            {/* SYSTÈME CONDITIONNEL : COULEUR vs TAILLE */}
            <div className="relative flex items-center justify-center">
              
              {/* CAS 1 : MATÉRIEL (Graffiti, Markers) -> Disque Chromatique */}
              {showVariantsCount && !isOutOfStock && !isUrbanWear && (
                <div className="relative flex items-center">
                  <span className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-tighter">
                    {product.variants_count} teintes
                  </span>
                  <div className="w-9 h-9 rounded-full p-[2px] bg-white border border-gray-100 shadow-sm transition-transform duration-500 group-hover:rotate-180">
                    <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#d46a6a, #d4c86a, #6ad471, #6ad4cf, #6a71d4, #cf6ad4, #d46a6a)' }} />
                  </div>
                </div>
              )}

              {/* CAS 2 : TEXTILE (Urban-wear) -> Badge de Tailles */}
              {showVariantsCount && !isOutOfStock && isUrbanWear && (
                 <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 bg-gray-50 group-hover:border-black transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-black">
                      Tailles
                    </span>
                 </div>
              )}

              {/* CAS 3 : PRODUIT UNIQUE (Pas de variantes ou Rupture) */}
              {(!showVariantsCount || isOutOfStock) && (
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-(--primary) group-hover:text-white transition-colors duration-300">
                  <span className="text-lg font-light">+</span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}