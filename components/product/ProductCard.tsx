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
      <div className="block bg-white overflow-hidden shadow hover:shadow-lg transition">
        <img
          src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${product.main_image}`}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-gray-700 mt-2">{product.price} €</p>
        </div>
      </div>
    </Link>
  );
}
