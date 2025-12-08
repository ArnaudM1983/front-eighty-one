import React, { useState } from 'react' // Importez useState
import CartRecap from './CartRecap'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
import ButtonLink from '../ui/ButtonLink'

type Props = {}

const CheckoutSummary = (props: Props) => {
  // 1. États pour stocker le sous-total et les frais de port
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  // Calcul du total
  const finalTotal = subtotal + shippingPrice;

  return (
    <div className="checkout-summary">
        <h2 className='mb-4'>Panier</h2>
        
        {/* 2. Passer le setter pour mettre à jour le sous-total */}
        <CartRecap setSubtotal={setSubtotal} /> 
        
        {/* 3. Passer le setter pour mettre à jour les frais de port */}
        <CheckoutShipping setShippingPrice={setShippingPrice} />
        
        {/* 4. Affichage du Total Final (NOUVEAU COMPOSANT/SECTION) */}
        <div className="total-summary mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between text-xl font-medium">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
            </div>
        </div>

        <div className="mt-8">
            <StripePaymentForm />
        </div>
        
        <ButtonLink className="w-full mt-4">Payer {finalTotal.toFixed(2)} €</ButtonLink>
    </div>
  )
}

export default CheckoutSummary