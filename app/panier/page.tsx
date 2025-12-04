"use client";

import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";

export default function PanierPage() {
    const { cartItems, loading, error, updateQuantity, removeItem, cartToken } = useCart();

    return (<div className="max-w-6xl mx-auto px-6 lg:px-16 pt-10 pb-20 flex flex-col lg:flex-row gap-24"> <div className="flex-1">
        {loading ? (<p>Chargement du panier...</p>
        ) : error ? (<p className="text-red-500">{error}</p>
        ) : (<CartItemsList
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
        />
        )} </div>


        <CartSummary cartItems={cartItems} cartToken={cartToken}/>
    </div>


    );
}
