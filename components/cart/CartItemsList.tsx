"use client";

import CartItem from "./CartItem";

type CartItemType = {
  id: number;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
};

type Props = {
  cartItems: CartItemType[];
  updateQuantity: (id: number, newQty: number) => void;
  removeItem: (id: number) => void;
};

export default function CartItemsList({ cartItems, updateQuantity, removeItem }: Props) {
  if (cartItems.length === 0) return <p>Votre panier est vide</p>;

  return (
    <div className="space-y-4">
        <h2>Panier</h2>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          variantName={item.variantName}
          price={item.price}
          quantity={item.quantity}
          image={item.image ? `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${item.image}` : undefined}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      ))}
    </div>
  );
}
