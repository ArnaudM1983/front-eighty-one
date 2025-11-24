import SliderWrapper from "../ui/SliderWrapper";
import ProductCard from "../product/ProductCard";
import ButtonLink from "../ui/ButtonLink";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  main_image: string;
  featured?: boolean;
};

type Props = {
  id?: string;
  title: string;
  categorySlug: string;
  useSlider?: boolean;

  // nouvelles props
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

async function fetchProducts(categorySlug: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/${categorySlug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function SubCategoriesSection({
  id,
  title,
  categorySlug,
  useSlider = true,
  description,
  buttonLabel,
  buttonHref,
}: Props) {
  const products = await fetchProducts(categorySlug);

  if (!products || products.length === 0) return null;

  return (
    <section id={id} className="px-8 pt-16 pb-8 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-4">{title}</h2>

        {(description || buttonLabel) && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
            {/* Description */}
            <p className="text-gray-600 max-w-2xl">{description}</p>

            {/* Bouton avec ButtonLink */}
            {buttonLabel && buttonHref && (
              <ButtonLink href={buttonHref}>
                {buttonLabel}
              </ButtonLink>
            )}
          </div>
        )}

        {useSlider ? (
          <SliderWrapper slidesToShow={4} autoplay={true}>
            {products.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </SliderWrapper>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
