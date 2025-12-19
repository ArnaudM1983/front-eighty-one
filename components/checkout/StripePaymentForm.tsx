"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

// Initialisation de Stripe avec la clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripePaymentForm({ orderId }: { orderId: string }) {
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        // 1. Appeler Symfony pour créer le PaymentIntent
        fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/payment/stripe/create-intent/${orderId}`, {
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => toast.error("Erreur d'initialisation du paiement"));
    }, [orderId]);

    if (!clientSecret) return <div className="text-sm text-gray-500">Chargement du module de paiement...</div>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <CheckoutForm orderId={orderId} />
        </Elements>
    );
}

function CheckoutForm({ orderId }: { orderId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Redirection après succès (vers une page de confirmation)
                return_url: `${window.location.origin}/order/confirmation/${orderId}`,
            },
        });

        if (error) {
            toast.error(error.message);
        }
        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button 
                disabled={isProcessing || !stripe} 
                className="hidden" // On le cache car on va déclencher le submit via le parent
                id="submit-stripe"
            >
                Payer
            </button>
        </form>
    );
}