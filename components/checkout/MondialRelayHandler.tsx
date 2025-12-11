// src/components/checkout/MondialRelayHandler.tsx

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
    
    // 💡 searchPostalCode s'initialise avec l'adresse du client
    const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode || '75001');
    // 💡 searchTrigger DOIT rester à 0 pour ne pas lancer la recherche au chargement
    const [searchTrigger, setSearchTrigger] = useState(0); 
    
    // NOUVEL ÉTAT : GESTION DE LA MODALE
    const [isModalOpen, setIsModalOpen] = useState(false);

    const effectiveCountryCode = customerCountryCode || 'FR'; 
    

    // 0. Initialisation : S'assure que le parent est au courant du mode de livraison
    useEffect(() => {
        setShippingMethod(MODE_ID);
        setSelectedPudo(null);
        setLocalPudo(null); 
    }, [setShippingMethod, setSelectedPudo]);


    // --- 1. LOGIQUE D'APPEL API POUR CALCULER LE PRIX (Non modifiée, ne dépend pas du CP de recherche) ---
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
                        countryCode: effectiveCountryCode,
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

    }, [totalWeight, setShippingPrice, effectiveCountryCode]);


    // --- 2. LOGIQUE: RECHERCHE DES PUDOS POUR LA CARTE (Déclenchée UNIQUEMENT par searchTrigger > 0) ---
    useEffect(() => {
        if (loadingPrice || currentPrice <= 0 || !!error || !searchPostalCode || searchPostalCode.length !== 5) {
             setPudosList([]);
             return;
        }
        
        // La recherche ne se lance que si searchTrigger est > 0 (clic sur Rechercher)
        if (searchTrigger === 0) return; 

        setLoadingPudos(true);
        
        const fetchPudos = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/pudo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postalCode: searchPostalCode, // UTILISATION DU CP SAISI
                        countryCode: effectiveCountryCode, 
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

    }, [currentPrice, loadingPrice, error, totalWeight, searchPostalCode, effectiveCountryCode, searchTrigger]); 


    // --- 3. GESTION DE LA SÉLECTION SUR LA CARTE ---
    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData); // Mise à jour de l'état maître
        setIsModalOpen(false); // FERMER LA MODALE APRÈS LA SÉLECTION
    }, [setSelectedPudo]);


    // Handler pour le champ de saisie (maintenant dans la modale)
    const handleSearchCPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.substring(0, 5);
        setSearchPostalCode(value);
        setSelectedPudo(null); 
        setLocalPudo(null);
    }
    
    // Handler du bouton de recherche (maintenant dans la modale)
    const handleSearchClick = () => {
        if (searchPostalCode.length === 5) {
            setSearchTrigger(prev => prev + 1); // Déclenche le useEffect de recherche
        }
    }

    // Handler pour l'ouverture de la modale
    const handleOpenModal = () => {
        setIsModalOpen(true);
        // Si aucune recherche n'a été faite, lancez-la immédiatement avec le CP par défaut
        if (searchTrigger === 0 && searchPostalCode.length === 5) {
            setSearchTrigger(1);
        }
    };

    // Rendu
    const isPudoSelected = localPudo !== null;
    const isDisabled = loadingPrice || currentPrice <= 0 || !!error;
    
    // Détermine le texte du bouton de la modale
    let buttonText = "Choisir un point de retrait";
    if (isPudoSelected) {
        buttonText = `Modifier le point de retrait`;
    }

    // Message sous le CP dans la modale
    let modalPudoMessage = null;
    if (loadingPudos) {
        modalPudoMessage = `Recherche en cours près de ${searchPostalCode}...`;
    } else if (pudosList.length > 0) {
        modalPudoMessage = `${pudosList.length} Points Relais trouvés. Sélectionnez sur la carte.`;
    } else if (searchTrigger > 0 && searchPostalCode.length === 5) {
        modalPudoMessage = `Aucun Point Relais disponible près de ${searchPostalCode}.`;
    }


    return (
        <div className='mondial-relay-handler'>
            <p className="mt-2 text-sm font-semibold text-gray-700">
                Frais de port : {loadingPrice ? '...' : `${currentPrice.toFixed(2)} €`}
            </p>
            
            {error && 
                <div className={`mt-2 p-2 rounded text-sm text-red-700 bg-red-100`}>
                    {error}
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
                
                {/* 💡 BOUTON D'OUVERTURE DE LA MODALE */}
                <button
                    onClick={handleOpenModal}
                    disabled={isDisabled}
                    className="w-full p-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
            
            {/* MODALE POUR LA CARTE */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    // Permet de fermer en cliquant à l'extérieur
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl p-4 m-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold">Localiser votre Point Relais</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">
                                &times;
                            </button>
                        </div>

                        {/* 💡 CHAMP DE SAISIE DU CODE POSTAL ET BOUTON DE RECHERCHE (DANS LA MODALE) */}
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                            <label htmlFor="modalSearchPostalCode" className="text-sm font-medium text-gray-700 shrink-0">
                                Code Postal :
                            </label>
                            <input
                                type="text"
                                id="modalSearchPostalCode"
                                value={searchPostalCode}
                                onChange={handleSearchCPChange}
                                maxLength={5}
                                placeholder="Ex: 75001"
                                className="w-full sm:max-w-[120px] p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                            />
                            <button
                                onClick={handleSearchClick}
                                disabled={searchPostalCode.length !== 5 || loadingPudos}
                                className='px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50 transition-colors'
                            >
                                {loadingPudos ? 'Recherche...' : 'Rechercher'}
                            </button>
                        </div>
                        
                        {/* Message d'état de la recherche PUDO */}
                        {modalPudoMessage && (
                            <div className={`mt-2 p-2 rounded text-sm ${pudosList.length > 0 ? 'text-blue-700 bg-blue-100' : 'text-red-700 bg-red-100'}`}>
                                {modalPudoMessage}
                            </div>
                        )}

                        {/* Contenu de la carte */}
                        <div className='pudo-map-container mt-4'>
                            {pudosList.length > 0 ? (
                                <PudoMap 
                                    pudos={pudosList}
                                    onPudoSelect={handleMapPudoSelect}
                                    initialLocationCP={searchPostalCode} 
                                    isDisabled={isDisabled}
                                    selectedPudoId={localPudo?.id || null}
                                />
                            ) : (
                                <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded">
                                     <p className="text-gray-600 font-semibold">
                                         {searchTrigger === 0 ? "Saisissez un Code Postal et cliquez sur 'Rechercher' pour afficher les points de retrait." : modalPudoMessage}
                                     </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
                                Fermer (Annuler la sélection)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MondialRelayHandler;