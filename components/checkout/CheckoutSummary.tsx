import React, { useState } from 'react'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
import SimpleCartRecap from './SimpleCartRecap';
import { Banknote, CreditCard, Info } from 'lucide-react';

// Type PUDOInfo
type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;

// Type pour les OrderItems
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
    totalWeight: number; 
    orderId: string;
    subtotal: number;
    orderItems: OrderItemType[];
    shippingCost: number;
    shippingMethod: string; // Ajouté pour détecter "pickup"

    // Informations Client
    customerPostalCode: string;
    customerCountryCode: string;
    customerAddress: string;

    // Setters
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
    shippingMethod,

    customerPostalCode,
    customerCountryCode,
    customerAddress,

    setShippingCost,
    setShippingMethod,
    setSelectedPudo
}: Props) => {

    // État pour la méthode de paiement
    const [paymentType, setPaymentType] = useState<'stripe' | 'cod'>('stripe');

    // Conversion Gramme -> KG
    const totalWeightInKg = totalWeight / 1000;
    const finalTotal = subtotal + shippingCost;
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    // Déterminer si le retrait boutique est actif
    const isPickup = shippingMethod === 'pickup';

    const handleFinalSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Empêcher le double clic
        if (isProcessingPayment || isSavingAddress) return;
        
        setIsProcessingPayment(true);

        // 1. D'abord, on sauvegarde l'adresse via la fonction du parent (PaiementPage)
        const addressSaved = await onFinalize();

        if (!addressSaved) {
            setIsProcessingPayment(false);
            return; // On arrête si l'adresse n'est pas valide
        }

        // 2. Gestion selon le mode de paiement
        if (paymentType === 'cod') {
            // --- CAS PAIEMENT EN BOUTIQUE ---
            try {
                // C'EST ICI QU'ON APPELLE LA NOUVELLE ROUTE SYMFONY
                const response = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}/confirm-pickup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    // Succès : Redirection vers la page de confirmation avec un paramètre spécial
                    window.location.href = `/order/confirmation/${orderId}?payment=cod`;
                } else {
                    const errorData = await response.json();
                    console.error(errorData);
                    setIsProcessingPayment(false);
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
                setIsProcessingPayment(false);
            }

        } else {
            // --- CAS STRIPE ---
            // On déclenche le clic sur le bouton caché du formulaire StripePaymentForm
            const stripeButton = document.getElementById('submit-stripe');
            if (stripeButton) {
                stripeButton.click();
                // Note : setIsProcessingPayment restera true jusqu'à ce que Stripe redirige ou échoue
            } else {
                setIsProcessingPayment(false);
            }
        }
    };

    const buttonIsDisabled = isSavingAddress || isProcessingPayment;
    
    // Texte dynamique du bouton
    let buttonText = `Payer ${finalTotal.toFixed(2)} €`;
    if (paymentType === 'cod') buttonText = "Confirmer la commande";
    if (isSavingAddress) buttonText = "Vérification...";
    if (isProcessingPayment) buttonText = "Traitement en cours...";

    return (
        <div className="checkout-summary bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className='mb-6 text-xl font-bold text-gray-800'>Résumé de la commande</h2>

            <SimpleCartRecap subtotal={subtotal} items={orderItems} />

            <CheckoutShipping
                setShippingPrice={setShippingCost}
                setSelectedOptionId={setShippingMethod}
                setSelectedPudo={setSelectedPudo}
                totalWeight={totalWeightInKg}
                orderId={orderId}
                currentPrice={shippingCost}
                customerPostalCode={customerPostalCode}
                customerCountryCode={customerCountryCode}
                customerAddress={customerAddress}
            />

            <div className="flex justify-between text-sm text-gray-500 mt-8">
                <span>Frais de port</span>
                <span className="font-semibold">{shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}</span>
            </div>

            <div className="total-summary mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Total TTC</span>
                    <span className="text-(--primary)">{finalTotal.toFixed(2)} €</span>
                </div>
            </div>

            {/* OPTIONS DE PAIEMENT */}
            <div className="mt-10 pt-6 border-t border-gray-100">
                <p className='font-bold mb-4 text-gray-800 uppercase text-xs tracking-widest'>Méthode de paiement</p>
                
                <div className="space-y-3">
                    {/* OPTION : STRIPE */}
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentType === 'stripe' ? 'border-(--primary) bg-blue-50/30 ring-1 ring-(--primary)' : 'border-gray-200'}`}>
                        <input 
                            type="radio" 
                            name="payment_type" 
                            checked={paymentType === 'stripe'} 
                            onChange={() => setPaymentType('stripe')}
                            className="form-radio h-4 w-4 text-(--primary)"
                        />
                        <div className="ml-3 flex items-center gap-2">
                            <CreditCard size={18} className="text-gray-600" />
                            <span className="text-sm font-semibold">Carte bancaire (Stripe)</span>
                        </div>
                    </label>

                    {/* OPTION : PAIEMENT AU RETRAIT (Conditionnel) */}
                    {isPickup && (
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all animate-in fade-in slide-in-from-top-1 ${paymentType === 'cod' ? 'border-(--primary) bg-blue-50/30 ring-1 ring-(--primary)' : 'border-gray-200'}`}>
                            <input 
                                type="radio" 
                                name="payment_type" 
                                checked={paymentType === 'cod'} 
                                onChange={() => setPaymentType('cod')}
                                className="form-radio h-4 w-4 text-(--primary)"
                            />
                            <div className="ml-3">
                                <div className="flex items-center gap-2">
                                    <Banknote size={18} className="text-gray-600" />
                                    <span className="text-sm font-semibold">Paiement au retrait</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Payez lors de la récupération en boutique.</p>
                            </div>
                        </label>
                    )}
                </div>

                <div className="mt-6">
                    {paymentType === 'stripe' ? (
                        <StripePaymentForm orderId={orderId} />
                    ) : (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
                            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Votre commande sera validée immédiatement. Vous devrez régler la somme de <strong>{finalTotal.toFixed(2)} €</strong> directement au comptoir.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleFinalSubmit}
                disabled={buttonIsDisabled}
                className={`
                    w-full mt-6 
                    group inline-block px-6 py-4 font-bold rounded-2xl border
                    border-(--primary) bg-(--primary) text-white
                    hover:bg-white hover:text-(--primary) hover:border-(--primary)
                    transition-all duration-200 cursor-pointer shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-widest
                `}
            >
                {buttonText}
            </button>
        </div>
    )
}

export default CheckoutSummary;