type ProductVariant = {
  id: number;
  name: string;
  sku: string | null;
  price: string;
  stock: number;
  image: string | null;
  attributes: Record<string, any>;
};

type Props = {
  variants: ProductVariant[];
};

const ColorChart = ({ variants }: Props) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Variantes</h2>

      <div className="flex gap-4">
        {variants.map((variant) => (
          <div key={variant.id} className="w-32">
            {variant.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${variant.image}`}
                alt={variant.name}
                className="w-full h-32 object-cover rounded"
              />
            )}
            <p className="text-sm text-center mt-1">{variant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorChart;
