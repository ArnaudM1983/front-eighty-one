"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ShippingAddressForm, { ShippingFormRef, PUDOInfo } from "@/components/checkout/ShippingAddressForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default function PaiementPage() {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // --- ÉTATS MAÎTRES DE LIVRAISON & COÛTS ---
    const [shippingCost, setShippingCost] = useState<number>(0);
    // Initialiser avec 'pickup' ou la valeur par défaut si elle existe dans l'API
    const [shippingMethod, setShippingMethod] = useState<string>('pickup');
    const [selectedPudo, setSelectedPudo] = useState<PUDOInfo>(null);
    const [orderSubtotalState, setOrderSubtotalState] = useState<number>(0); // Gérer le subtotal ici
    // ------------------------------------------

    const shippingFormRef = useRef<ShippingFormRef>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}`);
                if (!res.ok) throw new Error("Erreur de récupération de la commande.");
                
                const data = await res.json();
                
                setOrder(data);
                
                // Initialise le subtotal une fois l'ordre chargé
                const initialSubtotal = data?.total ? parseFloat(data.total) : 0;
                setOrderSubtotalState(initialSubtotal);

            } catch (err) {
                console.error("Erreur lors du chargement de la commande:", err);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // FONCTION D'ORCHESTRATION AU CLIC SUR "PAYER"
    const handleFullCheckout = async () => {
        if (!shippingFormRef.current) return false;

        // Validation de sécurité: Si ce n'est pas 'pickup', le coût doit être positif.
        if (shippingMethod !== 'pickup' && shippingCost <= 0) {
             alert("Veuillez patienter pendant le calcul des frais de port.");
             return false;
        }
        
        // Validation additionnelle pour le mode Mondial Relay (via shippingMethod)
        if (shippingMethod.includes('_pr') && !selectedPudo) {
            alert("Veuillez sélectionner un Point Relais avant de continuer.");
            return false;
        }


        setIsSaving(true);
        console.log("Étape 1: Sauvegarde des infos de livraison...");

        const success = await shippingFormRef.current.submitForm();

        setIsSaving(false);

        if (success) {
            console.log("Étape 2: Adresse et frais enregistrés. Procéder au paiement...");
            // TODO: Déclencher la logique de confirmation Stripe ici
            return true;
        } else {
            console.error("Échec de la validation de l'adresse ou des frais.");
            return false;
        }
    };

    if (loading) return <p>Chargement de la commande...</p>;
    if (!order) return <p>Commande introuvable</p>;

    // --- PRÉPARATION DES PROPS DE COMMANDE ---
    const orderIdString = orderId as string;
    const orderTotalWeight = order?.totalWeight || 0; // Valeur en grammes
    const orderItems = order?.items || [];
    
    // 💡 EXTRACTION DU CODE POSTAL ET DU PAYS DE L'ADRESSE PAR DÉFAUT
    const customerPostalCode = order?.shippingAddress?.postalCode || '';
    const customerCountryCode = order?.shippingAddress?.countryCode || '';
    // -----------------------------------------

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24 mt-8">

            <h2 className="text-3xl font-bold text-center mb-10">Paiement</h2>

            <div className="flex flex-col lg:flex-row gap-12">

                {/* Colonne gauche : Formulaire d'adresse / Expédition */}
                <div className="w-full lg:w-2/3">
                    <ShippingAddressForm
                        ref={shippingFormRef}
                        orderId={orderIdString}
                        // PASSAGE DES INFOS DE LIVRAISON AU FORMULAIRE POUR SAUVEGARDE
                        selectedPudo={selectedPudo}
                        shippingMethod={shippingMethod}
                        shippingCost={shippingCost}
                    />
                </div>

                {/* Colonne droite : Résumé, Options de Livraison et Paiement */}
                <div className="w-full lg:w-1/3">
                    <CheckoutSummary
                        onFinalize={handleFullCheckout}
                        isSavingAddress={isSaving}

                        // DONNÉES DE COMMANDE ESSENTIELLES
                        totalWeight={orderTotalWeight} // Valeur en GRAMMES (convertie en KG dans CheckoutSummary)
                        orderId={orderIdString}
                        subtotal={orderSubtotalState}
                        orderItems={orderItems}

                        // 💡 PASSAGE DES INFOS CLIENT
                        customerPostalCode={customerPostalCode}
                        customerCountryCode={customerCountryCode}

                        // PASSAGE DES SETTERS POUR CONTRÔLER L'ÉTAT
                        setShippingCost={setShippingCost}
                        setShippingMethod={setShippingMethod}
                        setSelectedPudo={setSelectedPudo}
                        shippingCost={shippingCost}
                    />
                </div>
            </div>
        </div>
    );
}