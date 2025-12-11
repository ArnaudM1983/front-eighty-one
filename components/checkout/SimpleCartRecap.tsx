// src/components/checkout/SimpleCartRecap.tsx

import React from 'react';

// Type pour les OrderItems (tel que défini dans CheckoutSummary.tsx)
type OrderItemType = {
    orderItemId: number;
    name: string;
    quantity: number;
    price: string; 
    total: string;
};

type SimpleCartRecapProps = {
    items: OrderItemType[];
    subtotal: number;
    // La prop 'shippingCost' est optionnelle pour le récap, mais utile pour l'affichage final
    shippingCost?: number; 
};

const SimpleCartRecap = ({ items, subtotal, shippingCost = 0 }: SimpleCartRecapProps) => {
    
    const finalTotal = subtotal + shippingCost;
    
    return (
        <div className="p-4 bg-gray-50 rounded">
            
            {/* --- Liste des Articles --- */}
            <div className="space-y-1 pb-3 border-b border-gray-200">
                {items.map(item => (
                    <div 
                        key={item.orderItemId}
                        className="flex justify-between items-center text-sm"
                    >
                        <div className="flex-1 pr-2">
                            <p className="font-medium text-gray-700">
                                {item.name} <span className="text-gray-500">x {item.quantity}</span>
                            </p>
                        </div>
                        <div className="text-right font-medium">
                            {parseFloat(item.total).toFixed(2)} €
                        </div>
                    </div>
                ))}
            </div>
            
            {/* --- Sous-total --- */}
            <div className="mt-2 flex justify-between font-regular text-sm">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
            </div>
            
            {/* --- Frais de Port (Affiché seulement si > 0 ou si la prop est fournie) --- */}
            {shippingCost > 0 && (
                <div className="flex justify-between font-regular text-sm text-gray-600 mt-1">
                    <span>Frais de port</span>
                    <span>{shippingCost.toFixed(2)} €</span>
                </div>
            )}

            {/* --- Total Final (Optionnel) --- */}
            {shippingCost > 0 && (
                 <div className="mt-3 pt-2 border-t border-gray-300 flex justify-between font-semibold">
                    <span>Total TTC</span>
                    <span>{finalTotal.toFixed(2)} €</span>
                </div>
            )}
            
        </div>
    );
};

export default SimpleCartRecap;