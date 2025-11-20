import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  main_image: string;
};

type Props = {
  product: Product;
};
export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/produit/${product.slug}`}>
      <div className="h-112 block bg-white overflow-hidden shadow transition rounded-2xl">
        <div className="w-full h-78 flex items-center justify-center overflow-hidden bg-white">
          <img
            src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${product.main_image}`}
            alt={product.name}
            className="object-contain w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="px-8 flex flex-col justify-between">
          <h5>{product.name}</h5>
          <p className="mt-2 font-bold text-xl">{product.price} €</p>
        </div>
      </div>
    </Link>

  );
}
