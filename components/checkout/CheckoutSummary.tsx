// src/components/checkout/CheckoutSummary.tsx

import React, { useState } from 'react'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
import SimpleCartRecap from './SimpleCartRecap';

// Type PUDOInfo doit être disponible (assuré par le parent ou défini ici)
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

    // NOUVEAU: Informations Client (provenant du parent de CheckoutSummary)
    customerPostalCode: string; // Ex: '75001'
    customerCountryCode: string; // Ex: 'FR'

    // Setters du parent (PaiementPage)
    setShippingCost: (price: number) => void;
    setShippingMethod: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
}

const CheckoutSummary = ({
    onFinalize,
    isSavingAddress,
    totalWeight,
    orderId,
    subtotal,
    orderItems,
    shippingCost,

    // DÉSTRUCTURATION NÉCESSAIRE des nouvelles props
    customerPostalCode,
    customerCountryCode,

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

                // TRANSMISSION DES NOUVELLES PROPS (nécessaire pour CheckoutShipping)
                customerPostalCode={customerPostalCode}
                customerCountryCode={customerCountryCode}
            />

            {/* Affichage des frais de port séparément */}
            <div className="flex justify-between text-sm text-gray-600 mt-8">
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
                className={`
        w-full mt-4 
        group inline-block px-6 py-2 font-normal rounded-4xl border
        border-(--primary) bg-(--primary) text-white
        hover:bg-white hover:text-(--primary) hover:border-(--primary)
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
    `}
            >
                {buttonText}
            </button>
        </div>
    )
}

export default CheckoutSummary;