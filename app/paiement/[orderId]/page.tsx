"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
<<<<<<< Updated upstream
// Assurez-vous que PUDOInfo est correctement importé
import ShippingAddressForm, { ShippingFormRef, PUDOInfo } from "@/components/checkout/ShippingAddressForm"; 
=======
import ShippingAddressForm, { ShippingFormRef, PUDOInfo } from "@/components/checkout/ShippingAddressForm";
>>>>>>> Stashed changes
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default function PaiementPage() {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
<<<<<<< Updated upstream
    // --- ÉTATS MAÎTRES DE LIVRAISON (Nécessaires pour CheckoutSummary) ---
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [shippingMethod, setShippingMethod] = useState<string>('pickup'); // 'pickup' par défaut
    const [selectedPudo, setSelectedPudo] = useState<PUDOInfo>(null); 
    // --------------------------------------------------------------------
=======
    // --- ÉTATS MAÎTRES DE LIVRAISON ---
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [shippingMethod, setShippingMethod] = useState<string>('pickup'); // 'pickup' par défaut
    const [selectedPudo, setSelectedPudo] = useState<PUDOInfo>(null);
    // ----------------------------------------
>>>>>>> Stashed changes

    const shippingFormRef = useRef<ShippingFormRef>(null); 
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}`);
                const data = await res.json();
                
<<<<<<< Updated upstream
                // Le champ 'total' contient maintenant le sous-total réel après la correction Symfony
                setOrder(data); 

=======
                // IMPORTANT: Symfony a besoin que le subTotal soit calculé au chargement 
                // pour que le total initial ne soit pas zéro.
                if (data.total) {
                     // Utiliser le total initial enregistré (qui devrait être le subTotal)
                    setOrder(data);
                } else {
                    throw new Error("Erreur de récupération des données de commande.");
                }
>>>>>>> Stashed changes
            } catch (err) {
                console.error(err);
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
        
        // Sécurité de base
        if (shippingMethod !== 'pickup' && shippingCost <= 0) {
             alert("Veuillez patienter pendant le calcul des frais de port.");
             return false;
        }

        // Validation de sécurité (vérification que le coût a été calculé)
        if (shippingMethod !== 'pickup' && shippingCost <= 0) {
             alert("Veuillez patienter pendant le calcul des frais de port.");
             return false;
        }

        setIsSaving(true);
        console.log("Étape 1: Sauvegarde des infos de livraison...");

        const success = await shippingFormRef.current.submitForm();
        
        setIsSaving(false);

        if (success) {
            console.log("Étape 2: Adresse et frais enregistrés. Procéder au paiement...");
<<<<<<< Updated upstream
=======
            // TODO: Déclencher la logique de confirmation Stripe ici
>>>>>>> Stashed changes
            return true;
        } else {
            console.error("Échec de la validation de l'adresse ou des frais.");
            return false;
        }
    };

    if (loading) return <p>Chargement de la commande...</p>;
    if (!order) return <p>Commande introuvable</p>;
<<<<<<< Updated upstream

    // --- PRÉPARATION DES PROPS POUR CHECKOUTSUMMARY (Résolution de l'erreur 2740) ---
    const orderIdString = orderId as string;
    const orderSubtotal = order?.total ? parseFloat(order.total) : 0; // Utilise 'total' comme sous-total initial
    const orderTotalWeight = order?.totalWeight || 0; 
    const orderItems = order?.items || [];
    // ----------------------------------------------------------------------------------
=======
    
    // --- PRÉPARATION DES PROPS DE COMMANDE ---
    const orderIdString = orderId as string;
    // Utiliser le 'total' de l'API comme sous-total initial (car il a été fixé à getSubTotal() lors de la création)
    const orderSubtotal = order?.total ? parseFloat(order.total) : 0; 
    const orderTotalWeight = order?.totalWeight || 0; 
    const orderItems = order?.items || [];
    // -----------------------------------------
>>>>>>> Stashed changes

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24 mt-8">

            <h2 className="text-3xl font-bold text-center mb-10">Paiement</h2>

            <div className="flex flex-col lg:flex-row gap-12">

                {/* Colonne gauche : Formulaire d'adresse / Expédition */}
                <div className="w-full lg:w-2/3">
                    <ShippingAddressForm 
                        ref={shippingFormRef}
                        orderId={orderIdString}
                        // PASSAGE DES INFOS DE LIVRAISON AU FORMULAIRE
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
                        
<<<<<<< Updated upstream
                        // --- PROPS DE COMMANDE (CORRIGÉES) ---
                        totalWeight={orderTotalWeight}
                        orderId={orderIdString}
                        subtotal={orderSubtotal}
                        orderItems={orderItems} 

                        // --- PROPS D'ÉTAT (SETTERS) ---
=======
                        // DONNÉES DE COMMANDE ESSENTIELLES
                        totalWeight={orderTotalWeight}
                        orderId={orderIdString}
                        subtotal={orderSubtotal}
                        orderItems={orderItems} // <-- NOUVEAU: Liste des articles

                        // PASSAGE DES SETTERS POUR CONTRÔLER L'ÉTAT
>>>>>>> Stashed changes
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