import ProductCard from "../product/ProductCard";
import SliderWrapper from "../ui/SliderWrapper";
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = { containScroll: false }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    main_image: string;
    featured: boolean;
};

async function fetchProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        // Throw an error to trigger error.tsx
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export default async function BestSellers() {
  
  const products: Product[] = await fetchProducts();

  // Filter only featured products
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-12">Nos Best-sellers</h2>
        <SliderWrapper slidesToShow={4} autoplay={true}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </SliderWrapper>
      </div>
    </section>
  );
}