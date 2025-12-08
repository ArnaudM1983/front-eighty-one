import { CartItemType, useCart } from '@/context/CartContext';
import React, { useEffect } from 'react';

// Définition des Props pour remonter le sous-total au parent
type CartRecapProps = {
  setSubtotal: (price: number) => void;
};

const CartRecap = ({ setSubtotal }: CartRecapProps) => {
  const { cartItems, loading, error } = useCart();

  if (loading) {
    return <div className="text-center p-4">Chargement du panier...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Erreur: {error}</div>;
  }

  // Calcul du sous-total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Mettre à jour l'état du sous-total dans le composant parent (CheckoutSummary)
  useEffect(() => {
    setSubtotal(subtotal);
  }, [subtotal, setSubtotal]);

  return (
    <div className="cart-recap space-y-4 pt-4">
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          {/* Liste des articles du panier */}
          <div className="items-list m-0">
            {cartItems.map((item: CartItemType) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-gray-300 py-2 font-light"
              >
                <div className="flex-1 pr-2">
                  <p className="">
                    {item.name}
                    <span>
                      {' '}
                      x {item.quantity}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  {/* Affichage du prix total de l'article */}
                  {(item.price * item.quantity).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>

          {/* Sous-total affiché ici pour le contexte */}
          <div className="flex justify-between font-regular pt-2 border-b border-gray-300 py-2">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>

        </>
      )}
    </div>
  );
};

export default CartRecap;