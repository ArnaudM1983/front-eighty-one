
"use client";
import React, { useState, useEffect, useCallback } from 'react';

export type PUDOInfo = { 
    id: string; 
    name: string; 
    address: string; 
    postalCode: string; 
    city: string; 
    country: string;
} | null;

interface MondialRelayHandlerProps {
    totalWeight: number; // En KG
    orderId: string;
    
    // Setters pour remonter au CheckoutSummary (et PaiementPage)
    setShippingPrice: (price: number) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    setShippingMethod: (method: string) => void; 
    
    currentPrice: number; // Prix actuel
}

const MODE_ID = 'mondial_relay_pr';
const MODE_CODE = 'pr'; // Code pour l'API de calcul

const MondialRelayHandler: React.FC<MondialRelayHandlerProps> = ({
    totalWeight,
    orderId,
    setShippingPrice,
    setSelectedPudo,
    setShippingMethod,
    currentPrice
}) => {
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [localPudo, setLocalPudo] = useState<PUDOInfo>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialisation : S'assure que le parent est au courant du mode de livraison
    useEffect(() => {
        setShippingMethod(MODE_ID);
    }, [setShippingMethod]);


    // --- LOGIQUE D'APPEL API POUR CALCULER LE PRIX ---
    useEffect(() => {
        if (totalWeight <= 0) {
            setShippingPrice(0);
            return;
        }
        
        const calculatePrice = async () => {
            setLoadingPrice(true);
            setError(null);
            
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight, 
                        modeCode: MODE_CODE, 
                        countryCode: 'FR',
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    console.error("API Error during tariff calculation:", res.status, errorData);
                    throw new Error(errorData.message || "Erreur de calcul de tarif.");
                }

                const data = await res.json();
                const newPrice = data.shippingCost ? parseFloat(data.shippingCost) : 0;
                
                if (newPrice <= 0) {
                    setError("Cette option de livraison est indisponible pour votre colis.");
                }

                // Mise à jour du coût au niveau du composant parent
                setShippingPrice(newPrice);

            } catch (err: any) {
                console.error("Erreur de calcul de tarif:", err);
                setShippingPrice(0);
                setError(err.message || "Erreur lors du calcul des frais de port.");
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();

    }, [totalWeight, setShippingPrice]);


    // --- LOGIQUE DU WIDGET MONDIAL RELAY (PUDO) ---
    const handlePudoSelection = useCallback((pudoData: any) => {
        const pudoInfo: PUDOInfo = {
            id: pudoData.ID,
            name: pudoData.Nom.trim(),
            address: (pudoData.Adresse1 + ' ' + pudoData.Adresse2).trim(),
            postalCode: pudoData.CP,
            city: pudoData.Ville.trim(),
            country: pudoData.Pays,
        };

        setLocalPudo(pudoInfo);
        setSelectedPudo(pudoInfo); 
    }, [setSelectedPudo]);

    useEffect(() => {
        (window as any).handlePudoSelection = handlePudoSelection;

        // Note: Le script externe du widget Mondial Relay doit être chargé ici ou dans _document.tsx

        return () => {
            delete (window as any).handlePudoSelection;
        };
    }, [handlePudoSelection]);
    
        const isPudoSelected = localPudo !== null;
    const isDisabled = loadingPrice || currentPrice <= 0 || !!error;

    return (
        <div className='mondial-relay-handler'>
            <p className="mt-2 text-sm text-gray-700">
                Frais de port : {loadingPrice ? 'Calcul en cours...' : `${currentPrice.toFixed(2)} €`}
            </p>
            
            {error && <div className="mt-2 p-2 text-red-700 bg-red-100 rounded text-sm">{error}</div>}

            <div className="mt-4 p-4 border border-dashed rounded bg-yellow-50">
                {isDisabled ? (
                     <p className="text-sm font-medium text-red-700 mb-2">
                        Veuillez résoudre les problèmes de prix ou de poids avant de sélectionner le Point Relais.
                     </p>
                ) : isPudoSelected ? (
                    <p className="text-sm font-medium text-green-700 mb-2">
                        ✅ Point Relais sélectionné : {localPudo?.name} ({localPudo?.postalCode})
                    </p>
                ) : (
                    <p className="text-sm text-gray-700 mb-2">
                        Veuillez sélectionner votre point de retrait.
                    </p>
                )}

                {/* Conteneur pour le widget Mondial Relay (visible si non isDisabled) */}
                <div 
                    id="Zone_Widget" 
                    className={`mt-2 h-96 border border-gray-300 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <p className="text-gray-400 text-center pt-8">
                        Chargement du widget de sélection de point relais... (Dépend d'un script externe)
                    </p>
                </div>

            </div>
        </div>
    );
};

export default MondialRelayHandler;