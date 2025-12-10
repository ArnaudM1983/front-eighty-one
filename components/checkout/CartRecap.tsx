import React, { useEffect } from 'react';

// NOTE: Le type OrderItemType est basé sur la réponse JSON de votre API getOrder
type OrderItemType = {
    orderItemId: number;
    name: string;
    quantity: number;
    price: string; // La prop price est une string dans le JSON
    total: string; // La prop total est une string dans le JSON
};

// Définition des Props pour remonter le sous-total et recevoir les articles
type CartRecapProps = {
  items: OrderItemType[]; // <-- Reçoit les OrderItems depuis la commande
  subtotal: number;       // Reçoit le sous-total déjà calculé sur la commande
};

const CartRecap = ({ items, subtotal }: CartRecapProps) => {
  // NOTE: On ne dépend plus de useCart, donc on retire useCart, loading, error

  return (
    <div className="cart-recap space-y-4 pt-4">
      {items.length === 0 ? (
        <p className="text-gray-500">Aucun article trouvé pour cette commande.</p>
      ) : (
        <>
          {/* Liste des articles de la COMMANDE */}
          <div className="items-list m-0">
            {items.map((item: OrderItemType) => (
              <div
                key={item.orderItemId}
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
                  {/* Affichage du prix total de l'article (déjà calculé par Symfony) */}
                  {parseFloat(item.total).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>

          {/* Sous-total affiché ici pour le contexte */}
          <div className="flex justify-between font-regular pt-2 border-b border-gray-300 py-2">
            <span>Sous-total des articles</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>

        </>
      )}
    </div>
  );
};

export default CartRecap;