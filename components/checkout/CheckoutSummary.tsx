"use client";

import React, { useState } from 'react'
import CheckoutShipping from './CheckoutShipping'
import StripePaymentForm from './StripePaymentForm'
import SimpleCartRecap from './SimpleCartRecap';
import { Banknote, CreditCard, Info, Wallet } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
    shippingMethod: string;

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

    const [paymentType, setPaymentType] = useState<'stripe' | 'paypal' | 'cod' | null>(null);

    const totalWeightInKg = totalWeight / 1000;
    const finalTotal = subtotal + shippingCost;
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const isPickup = shippingMethod === 'pickup';

    const payPalOptions = {
        "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "EUR",
        intent: "capture",
    };

    const handleFinalSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!paymentType) return;
        if (isProcessingPayment || isSavingAddress) return;
        if (paymentType === 'paypal') return;

        setIsProcessingPayment(true);

        // 1. Sauvegarde de l'adresse
        const addressSaved = await onFinalize();

        if (!addressSaved) {
            setIsProcessingPayment(false);
            return;
        }

        // 2. Gestion selon le mode de paiement
        if (paymentType === 'cod') {
            try {
                // CORRECTION : Proxy + Credentials pour la session
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/order/${orderId}/confirm-pickup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    // ON GARDE TON URL D'ORIGINE
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

        } else if (paymentType === 'stripe') {
            const stripeButton = document.getElementById('submit-stripe');
            if (stripeButton) {
                stripeButton.click();
            } else {
                setIsProcessingPayment(false);
            }
        }
    };

    const buttonIsDisabled = isSavingAddress || isProcessingPayment || !paymentType;

    let buttonText = "Choisir un paiement";
    if (paymentType === 'stripe') buttonText = `Payer ${finalTotal.toFixed(2)} €`;
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
                    <span className="text-[#01B0F0]">{finalTotal.toFixed(2)} €</span>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
                <p className='font-bold mb-4 text-gray-800 uppercase text-xs tracking-widest'>Méthode de paiement</p>

                <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentType === 'stripe' ? 'border-[#01B0F0] bg-blue-50/30 ring-1 ring-[#01B0F0]' : 'border-gray-200'}`}>
                        <input type="radio" name="payment_type" checked={paymentType === 'stripe'} onChange={() => setPaymentType('stripe')} className="form-radio h-4 w-4 text-[#01B0F0]" />
                        <div className="ml-3 flex items-center gap-2">
                            <CreditCard size={18} className="text-gray-600" />
                            <span className="text-sm font-semibold">Carte bancaire (Stripe)</span>
                        </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentType === 'paypal' ? 'border-[#01B0F0] bg-blue-50/30 ring-1 ring-[#01B0F0]' : 'border-gray-200'}`}>
                        <input type="radio" name="payment_type" checked={paymentType === 'paypal'} onChange={() => setPaymentType('paypal')} className="form-radio h-4 w-4 text-[#01B0F0]" />
                        <div className="ml-3 flex items-center gap-2">
                            <Wallet size={18} className="text-blue-700" />
                            <span className="text-sm font-semibold">PayPal</span>
                        </div>
                    </label>

                    {isPickup && (
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentType === 'cod' ? 'border-[#01B0F0] bg-blue-50/30 ring-1 ring-[#01B0F0]' : 'border-gray-200'}`}>
                            <input type="radio" name="payment_type" checked={paymentType === 'cod'} onChange={() => setPaymentType('cod')} className="form-radio h-4 w-4 text-[#01B0F0]" />
                            <div className="ml-3">
                                <div className="flex items-center gap-2">
                                    <Banknote size={18} className="text-gray-600" />
                                    <span className="text-sm font-semibold">Paiement au retrait</span>
                                </div>
                            </div>
                        </label>
                    )}
                </div>

                <div className="mt-6">
                    {!paymentType && (
                        <div className="p-4 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
                            Veuillez sélectionner un moyen de paiement.
                        </div>
                    )}

                    {paymentType === 'stripe' && <StripePaymentForm orderId={orderId} />}

                    {paymentType === 'paypal' && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <PayPalScriptProvider options={payPalOptions}>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={async () => {
                                        const addressSaved = await onFinalize();
                                        if (!addressSaved) throw new Error("Adresse invalide");
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/payment/paypal/create/${orderId}`, {
                                            method: "POST",
                                            credentials: 'include'
                                        });
                                        const json = await res.json();
                                        return json.id;
                                    }}
                                    onApprove={async (data) => {
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/payment/paypal/capture/${orderId}`, {
                                            method: "POST",
                                            headers: { 'Content-Type': 'application/json' },
                                            credentials: 'include',
                                            body: JSON.stringify({ paypalOrderId: data.orderID })
                                        });
                                        const json = await res.json();
                                        if (json.status === 'COMPLETED') {
                                            // ON GARDE TON URL D'ORIGINE
                                            window.location.href = `/order/confirmation/${orderId}?payment=paypal`;
                                        }
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    )}
                </div>
            </div>

            {paymentType !== 'paypal' && (
                <button onClick={handleFinalSubmit} disabled={buttonIsDisabled} className="w-full mt-6 bg-[#01B0F0] text-white p-4 rounded-2xl font-bold uppercase tracking-widest disabled:opacity-50">
                    {buttonText}
                </button>
            )}
        </div>
    )
}

export default CheckoutSummary;