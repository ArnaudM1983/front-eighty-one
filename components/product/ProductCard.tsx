import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  stock?: number;
  main_image: string | null;
  featured?: boolean;
  has_variants?: boolean;
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

  // Si le stock (cumulé ou direct) est <= 0, on affiche "Rupture"
  const isOutOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0;

  return (
    <Link href={`/produit/${product.slug}`} className="group">
      <div className="h-112 block bg-white overflow-hidden shadow transition rounded-2xl relative">

        <div className="w-full h-78 flex items-center justify-center overflow-hidden bg-white relative">

          {/* BADGE RUPTURE */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-50 backdrop-blur-sm border border-red-100 rounded-lg shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                Rupture
              </span>
            </div>
          )}

          <img
            src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${product.main_image}`}
            alt={product.name}
            loading="lazy"
            className={`
                object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110
                ${isOutOfStock ? 'opacity-60 grayscale' : ''}
            `}
          />
        </div>

        <div className="px-8 flex flex-col justify-between pt-4 pb-4">
          <div>
            <p className="uppercase font-bold text-(--text-secondary)">{brand}</p>
            <p className="text-(--text-secondary) truncate">{product.name}</p>
          </div>
          <p className="mt-2 font-bold text-xl">{product.price} €</p>
        </div>
      </div>
    </Link>
  );
}