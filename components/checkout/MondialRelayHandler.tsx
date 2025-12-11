// src/components/checkout/MondialRelayHandler.tsx (Mise à jour)

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const PudoMap = dynamic(() => import('./PudoMap'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded"><p className="text-gray-500">Chargement de la carte...</p></div>,
});


export type PUDOInfo = { 
    id: string; 
    name: string; 
    address: string; 
    postalCode: string; 
    city: string; 
    country: string;
    latitude?: number; 
    longitude?: number;
    distance?: number;
} | null;

interface MondialRelayHandlerProps {
    totalWeight: number; // En KG
    orderId: string;
    
    setShippingPrice: (price: number) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    setShippingMethod: (method: string) => void; 
    
    currentPrice: number; // Prix actuel
    // Props client reçues, mais nous les statufions pour la recherche initiale
    customerPostalCode: string; 
    customerCountryCode: string;
}

const MODE_ID = 'mondial_relay_pr';
const MODE_CODE = 'pr';

const MondialRelayHandler: React.FC<MondialRelayHandlerProps> = ({
    totalWeight,
    orderId,
    setShippingPrice,
    setSelectedPudo,
    setShippingMethod,
    currentPrice,
    customerPostalCode, 
    customerCountryCode 
}) => {
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [loadingPudos, setLoadingPudos] = useState(false);
    const [localPudo, setLocalPudo] = useState<PUDOInfo>(null);
    const [error, setError] = useState<string | null>(null);
    const [pudosList, setPudosList] = useState<PUDOInfo[]>([]); 
    
    // CODE POSTAL STATIQUE/PAR DÉFAUT POUR L'ORIGINE DE LA RECHERCHE
    // Ceci permet d'initialiser la carte à un emplacement connu (ex: la ville du commerce ou un grand centre urbain)
    const searchCP = '75001'; 
    const searchCountry = 'FR';
    

    // 0. Initialisation : S'assure que le parent est au courant du mode de livraison
    useEffect(() => {
        setShippingMethod(MODE_ID);
        setSelectedPudo(null);
        setLocalPudo(null); 
    }, [setShippingMethod, setSelectedPudo]);


    // --- 1. LOGIQUE D'APPEL API POUR CALCULER LE PRIX ---
    useEffect(() => {
        if (totalWeight <= 0) {
            setShippingPrice(0);
            return;
        }
        
        const calculatePrice = async () => {
            setLoadingPrice(true);
            if (error) setError(null); 
            
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight, 
                        modeCode: MODE_CODE, 
                        countryCode: searchCountry, // Utilisation du pays de recherche statique
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    throw new Error(errorData.message || "Erreur de calcul de tarif.");
                }

                const data = await res.json();
                const newPrice = data.shippingCost ? parseFloat(data.shippingCost) : 0;
                
                if (newPrice <= 0) {
                    setError("Cette option de livraison est indisponible pour votre colis (prix nul).");
                }
                setShippingPrice(newPrice);
            } catch (err: any) {
                setShippingPrice(0);
                setError(err.message || "Erreur lors du calcul des frais de port.");
            } finally {
                setLoadingPrice(false);
            }
        };

        if (totalWeight > 0) {
            calculatePrice();
        } else {
             setShippingPrice(0);
        }

    }, [totalWeight, setShippingPrice]);


    // --- 2. LOGIQUE: RECHERCHE DES PUDOS POUR LA CARTE ---
    useEffect(() => {
        // Conditions pour NE PAS lancer la recherche
        if (loadingPrice || currentPrice <= 0 || !!error) {
             setPudosList([]);
             return;
        }

        setLoadingPudos(true);
        
        const fetchPudos = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/pudo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postalCode: searchCP, // UTILISATION DU CP STATIQUE
                        countryCode: searchCountry, // UTILISATION DU PAYS STATIQUE
                        totalWeight: totalWeight,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    throw new Error(errorData.message || "Impossible de charger les Points Relais.");
                }

                const data = await res.json();
                setPudosList(data.pudos || []);
                
            } catch (err: any) {
                console.error("Erreur de recherche PUDO:", err);
                setError(err.message);
                setPudosList([]);
            } finally {
                setLoadingPudos(false);
            }
        };

        fetchPudos();

    }, [currentPrice, loadingPrice, error, totalWeight]); 


    // --- 3. GESTION DE LA SÉLECTION SUR LA CARTE ---
    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData); // Mise à jour de l'état maître
    }, [setSelectedPudo]);


    // Rendu
    const isPudoSelected = localPudo !== null;
    const isDisabled = loadingPrice || currentPrice <= 0 || !!error;
    
    let displayMessage = null;
    if (error) {
        displayMessage = error;
    } else if (loadingPrice) {
        displayMessage = 'Calcul du prix en cours...';
    } else if (loadingPudos) {
        displayMessage = 'Recherche des Points Relais...';
    } else if (!loadingPudos && currentPrice > 0 && pudosList.length === 0) {
        displayMessage = `Aucun Point Relais disponible près de ${searchCP}.`;
    }

    return (
        <div className='mondial-relay-handler'>
            <p className="mt-2 text-sm font-semibold text-gray-700">
                Frais de port : {loadingPrice ? '...' : `${currentPrice.toFixed(2)} €`}
            </p>
            
            {displayMessage && 
                <div className={`mt-2 p-2 rounded text-sm ${error ? 'text-red-700 bg-red-100' : 'text-blue-700 bg-blue-100'}`}>
                    {displayMessage}
                </div>
            }

            <div className="mt-4 p-4 border border-dashed rounded bg-yellow-50">
                
                {/* 1. Affichage de la sélection */}
                {isPudoSelected && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                        <p className="font-semibold text-sm">✅ Point Relais sélectionné :</p>
                        <p className="text-sm">{localPudo?.name}</p>
                        <p className="text-xs">{localPudo?.address}, {localPudo?.postalCode} {localPudo?.city}</p>
                    </div>
                )}
                
                {/* 2. Affichage du composant Carte */}
                <div className='pudo-map-container'>
                    <PudoMap 
                        pudos={pudosList}
                        onPudoSelect={handleMapPudoSelect}
                        // Passe le CP statique pour l'affichage du message d'erreur
                        initialLocationCP={searchCP} 
                        isDisabled={isDisabled}
                        selectedPudoId={localPudo?.id || null}
                    />
                </div>
            </div>
        </div>
    );
};

export default MondialRelayHandler;