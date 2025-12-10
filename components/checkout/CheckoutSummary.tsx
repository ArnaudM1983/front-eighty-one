// src/components/checkout/CheckoutSummary.tsx

import React, { useState } from 'react'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'

// Type PUDOInfo doit être disponible (assuré par le parent)
type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;

// Type pour les OrderItems reçus de l'API
type OrderItemType = {
    orderItemId: number;
    name: string;
    quantity: number;
    price: string;
    total: string;
};

type Props = {
    onFinalize: () => Promise<boolean>;
    isSavingAddress: boolean;

    // Props de la commande
    totalWeight: number; // Reçu en Grammes (ex: 1780)
    orderId: string;
    subtotal: number;
    orderItems: OrderItemType[]; // Liste des articles pour le récapitulatif
    shippingCost: number;

    // Setters du parent (PaiementPage)
    setShippingCost: (price: number) => void;
    setShippingMethod: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
}

// Composant SimpleCartRecap (déplacé ici pour simplicité)
const SimpleCartRecap = ({ items, subtotal }: { items: OrderItemType[], subtotal: number }) => (
    <div className="p-4 bg-gray-50 rounded">
        {items.map(item => (
            <div
                key={item.orderItemId}
                className="flex justify-between items-center border-b border-gray-200 py-1 text-sm"
            >
                <div className="flex-1 pr-2">
                    <p className="font-medium text-gray-700">
                        {item.name} x {item.quantity}
                    </p>
                </div>
                <div className="text-right">
                    {parseFloat(item.total).toFixed(2)} €
                </div>
            </div>
        ))}
        <div className="mt-3 pt-2 border-t border-gray-300 flex justify-between font-regular">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
        </div>
    </div>
);


const CheckoutSummary = ({
    onFinalize,
    isSavingAddress,
    totalWeight,
    orderId,
    subtotal,
    orderItems,
    shippingCost,

    setShippingCost,
    setShippingMethod,
    setSelectedPudo
}: Props) => {

    // ** CORRECTION CLÉ : CONVERSION GRAMME -> KG **
    const totalWeightInKg = totalWeight / 1000;
    
    const finalTotal = subtotal + shippingCost;
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const handleFinalSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        setIsProcessingPayment(true);
        const success = await onFinalize();

        if (success) {
            console.log("Paiement initié.");
        }

        setIsProcessingPayment(false);
    };

    const buttonIsDisabled = isSavingAddress || isProcessingPayment;
    let buttonText = `Payer ${finalTotal.toFixed(2)} €`;

    if (isSavingAddress) {
        buttonText = "Vérification adresse & frais...";
    } else if (isProcessingPayment) {
        buttonText = "Paiement en cours...";
    }

    return (
        <div className="checkout-summary">
            <h2 className='mb-4 text-xl font-semibold'>Résumé de la commande</h2>

            {/* Rendu du sous-total (Passe les articles et le sous-total) */}
            <SimpleCartRecap subtotal={subtotal} items={orderItems} />

            {/* Options de Livraison et Calcul du Prix */}
            <CheckoutShipping
                setShippingPrice={setShippingCost}
                setSelectedOptionId={setShippingMethod}
                setSelectedPudo={setSelectedPudo}

                // Utilisation du poids converti
                totalWeight={totalWeightInKg} 
                orderId={orderId}
                currentPrice={shippingCost}
            />

            {/* Affichage des frais de port séparément */}
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Frais de port</span>
                <span>{shippingCost.toFixed(2)} €</span>
            </div>

            {/* Total Final */}
            <div className="total-summary mt-6 pt-4 border-t border-gray-300">
                <div className="flex justify-between text-xl font-medium">
                    <span>Total TTC</span>
                    <span>{finalTotal.toFixed(2)} €</span>
                </div>
            </div>

            <div className="mt-8">
                <StripePaymentForm />
            </div>

            <button
                onClick={handleFinalSubmit}
                disabled={buttonIsDisabled}
                className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
                {buttonText}
            </button>
        </div>
    )
}

export default CheckoutSummary;