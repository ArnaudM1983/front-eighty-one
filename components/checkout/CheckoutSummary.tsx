import React, { useState } from 'react'
import CartRecap from './CartRecap'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
import ButtonLink from '../ui/ButtonLink'

type Props = {
    onFinalize: () => Promise<boolean>; // Fonction pour orchestrer la sauvegarde/paiement
    isSavingAddress: boolean; // État de sauvegarde de l'adresse (passé par PaiementPage)
}

const CheckoutSummary = ({ onFinalize, isSavingAddress }: Props) => {
  // 1. États pour stocker le sous-total et les frais de port
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  // Calcul du total
  const finalTotal = subtotal + shippingPrice;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // État pour le paiement

  const handleFinalSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. Déclencher l'orchestration (Sauvegarde Adresse + Paiement) via la prop
    setIsProcessingPayment(true);
    const success = await onFinalize();
    
    if (success) {
        // L'adresse est sauvegardée. Maintenant, on passe à Stripe (à implémenter)
        console.log("Paiement initié après sauvegarde de l'adresse.");
        // TODO: Ajoutez ici la logique de confirmation Stripe (stripe.confirmPayment)
    } else {
        // L'échec est géré par la logique de ShippingAddressForm (affichage des erreurs)
        console.error("Échec de la validation de la commande.");
    }
    
    setIsProcessingPayment(false);
  };

  const buttonIsDisabled = isSavingAddress || isProcessingPayment;
  let buttonText = `Payer ${finalTotal.toFixed(2)} €`;

  if (isSavingAddress) {
      buttonText = "Vérification adresse...";
  } else if (isProcessingPayment) {
      buttonText = "Paiement en cours...";
  }

  return (
    <div className="checkout-summary">
        <h2 className='mb-4'>Panier</h2>
        
        {/* 2. Passer le setter pour mettre à jour le sous-total */}
        <CartRecap setSubtotal={setSubtotal} /> 
        
        {/* 3. Passer le setter pour mettre à jour les frais de port */}
        <CheckoutShipping setShippingPrice={setShippingPrice} />
        
        {/* 4. Affichage du Total Final */}
        <div className="total-summary mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between text-xl font-medium">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
            </div>
        </div>

        <div className="mt-8">
            <StripePaymentForm />
        </div>
        
        {/* ⚠️ Bouton unique qui gère toute l'orchestration ⚠️ */}
        <button 
            onClick={handleFinalSubmit} 
            disabled={buttonIsDisabled}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
            {buttonText}
        </button>
    </div>
  )
}

export default CheckoutSummary;