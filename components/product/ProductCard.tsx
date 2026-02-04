import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | string; // Accepte string (API) ou number (Cast)
  stock?: number;         // Optionnel
  main_image: string | null; // Peut être null
  featured?: boolean;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const words = product.name.split(" ");
  let brand = words[0];

  // Cas particulier pour "Double A"
  if (words[0] === "Double" && words[1]) {
    brand = `${words[0]} ${words[1]}`;
  }

  return (
    <Link href={`/produit/${product.slug}`}>
      <div className="h-112 block bg-white overflow-hidden shadow transition rounded-2xl">
        <div className="w-full h-78 flex items-center justify-center overflow-hidden bg-white">
          <img
            src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${product.main_image}`}
            alt={product.name}
            loading="lazy"
            className="object-contain w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="px-8 flex flex-col justify-between">
          <p className="uppercase font-bold text-(--text-secondary)">{brand}</p>
          <p className="text-(--text-secondary)">{product.name}</p>
          <p className="mt-2 font-bold text-xl">{product.price} €</p>
        </div>
      </div>
    </Link>
  );
}
