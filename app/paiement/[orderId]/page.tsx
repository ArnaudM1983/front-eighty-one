"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ShippingAddressForm, { ShippingFormRef } from "@/components/checkout/ShippingAddressForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

// Note: Les imports Stripe sont commentés car le test initial ne les utilise pas.
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_votre_cle_publique');

export default function PaiementPage() {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // RÉFÉRENCE POUR SOUMETTRE ShippingAddressForm À DISTANCE
    const shippingFormRef = useRef<ShippingFormRef>(null); 
    const [isSaving, setIsSaving] = useState(false); // État de sauvegarde de l'adresse
    // const [clientSecret, setClientSecret] = useState<string | null>(null); // Décommenter pour Stripe

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                // Récupération des données de la commande
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}`);
                const data = await res.json();
                setOrder(data);

                // Décommenter pour l'étape Stripe
                // const clientSecretRes = await fetch(/* ... votre endpoint clientSecret ... */);
                // setClientSecret(clientSecretRes.clientSecret);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // FONCTION D'ORCHESTRATION AU CLIC SUR "PAYER"
    const handleFullCheckout = async () => {
        if (!shippingFormRef.current) return false;

        setIsSaving(true);
        console.log("Étape 1: Sauvegarde des infos de livraison...");

        // Appeler la fonction de soumission exposée par ShippingAddressForm
        const success = await shippingFormRef.current.submitForm();
        
        setIsSaving(false);

        if (success) {
            console.log("Étape 2: Adresse enregistrée. Procéder au paiement...");
            // TODO: Déclencher la logique de confirmation Stripe ici (si le bouton était externe)
            // Comme le bouton est dans CheckoutSummary, nous supposons que la suite s'y fera.
            return true;
        } else {
            console.error("Échec de la validation de l'adresse.");
            return false;
        }
    };

    if (loading) return <p>Chargement de la commande...</p>;
    if (!order) return <p>Commande introuvable</p>;

    // const stripeOptions = clientSecret ? { clientSecret, locale: 'fr' as const } : undefined; // Décommenter pour Stripe

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24 mt-8">

            <h2 className="text-3xl font-bold text-center mb-10">Paiement</h2>

            <div className="flex flex-col lg:flex-row gap-12">

                {/* Colonne gauche : Rendre le formulaire avec la ref */}
                <div className="w-full lg:w-2/3">
                    <ShippingAddressForm ref={shippingFormRef} /> 
                </div>

                {/* Colonne droite : Rendre le résumé et passer la fonction de finalisation */}
                <div className="w-full lg:w-1/3">
                    {/* ENVELOPPEMENT STRIPE À DÉCOMMENTER LORS DE L'INTÉGRATION FINALE */}
                    {/* {clientSecret && stripeOptions ? (
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <CheckoutSummary onFinalize={handleFullCheckout} isSavingAddress={isSaving} />
                        </Elements>
                    ) : (
                        <div className="p-4 bg-gray-100 rounded">Préparation du module de paiement...</div>
                    )} */}
                    
                    {/* Version de test (sans Stripe) */}
                    <CheckoutSummary onFinalize={handleFullCheckout} isSavingAddress={isSaving} />
                </div>
            </div>
        </div>
    );
}