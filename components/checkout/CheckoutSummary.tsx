import React, { useState } from 'react'
import CartRecap from './CartRecap'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
<<<<<<< Updated upstream
import SimpleCartRecap from './SimpleCartRecap';

// Type PUDOInfo doit être disponible
=======

// Type PUDOInfo doit être disponible (importé depuis le fichier du formulaire)
>>>>>>> Stashed changes
type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;

// Type pour les OrderItems reçus de l'API
type OrderItemType = {
    orderItemId: number;
    name: string;
    quantity: number;
<<<<<<< Updated upstream
    price: string;
=======
    price: string; 
>>>>>>> Stashed changes
    total: string;
};

type Props = {
    onFinalize: () => Promise<boolean>;
    isSavingAddress: boolean;
<<<<<<< Updated upstream

=======
    
>>>>>>> Stashed changes
    // Props de la commande
    totalWeight: number;
    orderId: string;
    subtotal: number;
<<<<<<< Updated upstream
    orderItems: OrderItemType[]; // Liste des articles pour le récapitulatif
=======
    orderItems: OrderItemType[]; // <-- AJOUT DE LA LISTE DES ARTICLES
>>>>>>> Stashed changes
    shippingCost: number;

    // Setters du parent (PaiementPage)
    setShippingCost: (price: number) => void;
    setShippingMethod: (method: string) => void;
<<<<<<< Updated upstream
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

    setShippingCost,
    setShippingMethod,
    setSelectedPudo
}: Props) => {

    const totalWeightInKg = totalWeight / 1000;
    const finalTotal = subtotal + shippingCost;
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
=======
    setSelectedPudo: (pudo: PUDOInfo) => void; 
}

// Composant simplifé pour la démo, suppose qu'il reçoit items et subtotal
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
                    {/* Affichage du prix total de l'article (déjà calculé par Symfony) */}
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
    orderItems, // <-- ARTICLE REÇUS
    shippingCost,
    
    setShippingCost,
    setShippingMethod,
    setSelectedPudo
}: Props) => {

  const finalTotal = subtotal + shippingCost;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
>>>>>>> Stashed changes

    const handleFinalSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

<<<<<<< Updated upstream
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
=======
    setIsProcessingPayment(true);
    const success = await onFinalize();
    
    if (success) {
        console.log("Paiement initié.");
>>>>>>> Stashed changes
    }

    return (
        <div className="checkout-summary">
            <h2 className='mb-4 text-xl font-semibold'>Résumé de la commande</h2>

<<<<<<< Updated upstream
            {/* Rendu du sous-total (Passe les articles et le sous-total) */}
            <SimpleCartRecap subtotal={subtotal} items={orderItems} />

            {/* Options de Livraison et Calcul du Prix */}
            <CheckoutShipping
                setShippingPrice={setShippingCost}
                setSelectedOptionId={setShippingMethod}
                setSelectedPudo={setSelectedPudo}

                totalWeight={totalWeightInKg}
                orderId={orderId}
                currentPrice={shippingCost}
            />

            {/* Affichage des frais de port séparément */}
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Frais de port</span>
                <span>{shippingCost.toFixed(2)} €</span>
=======
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
            
            totalWeight={totalWeight}
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
>>>>>>> Stashed changes
            </div>

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
}

export default CheckoutSummary;