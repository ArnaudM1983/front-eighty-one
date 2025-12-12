/**
 * COMPOSANT : MondialRelayHandler (Frontend - React/Leaflet)
 * * RÔLE :
 * 1. Fournir l'interface utilisateur pour la recherche et la sélection d'un Point Relais (PUDO).
 * 2. Gérer le champ de saisie du Code Postal (CP) pour la recherche de points.
 * 3. Contrôler l'état de la Modale qui contient la carte.
 * 4. Déclencher l'appel API vers Symfony ('api/order/pudo/search') lorsque l'utilisateur clique sur "Rechercher".
 * 5. IMPLÉMENTER LA LOGIQUE DE RÉESSAI (RETRY) pour gérer l'instabilité de l'API externe.
 * 6. Recevoir la liste des PUDOs et la passer au composant de carte (PudoMap).
 * 7. Mettre à jour le Point Relais sélectionné (`setSelectedPudo`) et fermer la modale après sélection.
 * * DÉPENDANCES CLÉS :
 * - PudoMap (dynamic import): La carte Leaflet pour l'affichage visuel.
 * - API Symfony: Point de terminaison '/api/order/pudo/search' pour les données des points.
 */
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
    
    currentPrice: number; 
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
    
    // searchPostalCode s'initialise avec l'adresse du client ou 69001 (Lyon)
    const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode || '69001');
    // searchTrigger DOIT rester à 0 pour ne pas lancer la recherche au chargement
    const [searchTrigger, setSearchTrigger] = useState(0); 
    
    // NOUVEL ÉTAT : GESTION DE LA MODALE
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 💡 NOUVEL ÉTAT : Clé pour forcer le re-rendu/remontage de la carte
    const [mapKey, setMapKey] = useState(0); 

    const effectiveCountryCode = customerCountryCode || 'FR'; 
    
    // Helper pour vérifier si un PUDO a des coordonnées valides
    const hasValidCoords = (p: PUDOInfo): p is PUDOInfo => {
        return (
            p !== null && 
            typeof p.latitude === 'number' && 
            typeof p.longitude === 'number' &&
            p.latitude !== 0 && 
            p.longitude !== 0
        );
    };

    // Initialisation : S'assure que le parent est au courant du mode de livraison
    useEffect(() => {
        setShippingMethod(MODE_ID);
        setSelectedPudo(null);
        setLocalPudo(null); 
    }, [setShippingMethod, setSelectedPudo]);


    // --- LOGIQUE D'APPEL API POUR CALCULER LE PRIX (inchangée) ---
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


    // --- RECHERCHE DES PUDOS AVEC MÉCANISME DE RÉESSAI ---
    useEffect(() => {
        if (loadingPrice || currentPrice <= 0 || !!error || !searchPostalCode || searchPostalCode.length !== 5) {
             setPudosList([]);
             return;
        }
        
        if (searchTrigger === 0) return; 

        setLoadingPudos(true);
        setError(null); 

        const MAX_RETRIES = 10;
        
        const fetchPudosWithRetry = async (attempt = 1) => {
            
            console.log(`📡 Tentative de recherche PUDO #${attempt} pour CP: ${searchPostalCode}`);
            
            let pudos: PUDOInfo[] = [];

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/pudo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postalCode: searchPostalCode, 
                        countryCode: effectiveCountryCode, 
                        totalWeight: totalWeight,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    throw new Error(errorData.message || `Erreur HTTP serveur API (Tentative ${attempt})`);
                }

                const data = await res.json();
                pudos = data.pudos || [];
                
                // 💡 VÉRIFICATION CRITIQUE : Y a-t-il au moins 1 PUDO avec des coordonnées valides ?
                const validPudos = pudos.filter(hasValidCoords);
                
                if (pudos.length > 0 && validPudos.length === 0) {
                     // L'API a répondu 200, mais les coordonnées sont tronquées/invalides (ex: 45/4)
                     throw new Error(`Coordonnées invalides reçues pour ${searchPostalCode}.`);
                }
                
                if (pudos.length === 0) {
                    // Aucun point trouvé du tout.
                    throw new Error(`Aucun Point Relais disponible (Tentative ${attempt}).`);
                }

                // SUCCÈS : Données valides reçues
                setPudosList(pudos);
                setMapKey(prev => prev + 1); // Forcer le remontage de la carte
                setLoadingPudos(false);
                return; // Sortie réussie

            } catch (err: any) {
                console.warn(`Tentative ${attempt} échouée:`, err.message);

                if (attempt < MAX_RETRIES) {
                    // Réessayer après un délai
                    await new Promise(resolve => setTimeout(resolve, 500 + 500 * attempt));
                    return fetchPudosWithRetry(attempt + 1);
                }

                // ÉCHEC FINAL après toutes les tentatives
                console.error("Échec définitif de la recherche PUDO après réessais.");
                
                const finalError = err.message.includes('Coordonnées invalides') 
                    ? `Erreur de données pour ${searchPostalCode}. Veuillez réessayer.` 
                    : err.message;
                
                setError(`[Échec après réessais] ${finalError}`);
                setPudosList([]);
                setLoadingPudos(false);
            }
        };

        fetchPudosWithRetry();

    }, [currentPrice, loadingPrice, totalWeight, searchPostalCode, effectiveCountryCode, searchTrigger]); 


    // --- GESTION DE LA SÉLECTION SUR LA CARTE ---
    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData); 
        setIsModalOpen(false); // Ferme la modale après sélection
    }, [setSelectedPudo]);


    // Handler pour le champ de saisie (dans la modale)
    const handleSearchCPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.substring(0, 5);
        setSearchPostalCode(value);
        setSelectedPudo(null); 
        setLocalPudo(null);
    }
    
    // Handler du bouton de recherche (dans la modale)
    const handleSearchClick = () => {
        if (searchPostalCode.length === 5) {
            setSearchTrigger(prev => prev + 1); 
        }
    }

    // Handler pour l'ouverture de la modale
    const handleOpenModal = () => {
        setIsModalOpen(true);
        // Déclencher une recherche si c'est la première ouverture avec un CP valide
        if (searchTrigger === 0 && searchPostalCode.length === 5) {
            setSearchTrigger(1);
        }
    };

    const isPudoSelected = localPudo !== null;
    const isDisabled = loadingPrice || currentPrice <= 0 || !!error;
    
    let buttonText = "Choisir un point de retrait";
    if (isPudoSelected) {
        buttonText = `Modifier le point de retrait`;
    }

    let modalPudoMessage = null;
    const searchHasRun = searchTrigger > 0 && searchPostalCode.length === 5;
    
    if (loadingPudos) {
        modalPudoMessage = `Recherche en cours près de ${searchPostalCode}...`;
    } else if (pudosList.length > 0) {
        modalPudoMessage = `${pudosList.length} Points Relais trouvés. Sélectionnez sur la carte.`;
    } else if (searchHasRun) {
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
                
                {isPudoSelected && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                        <p className="font-semibold text-sm">✅ Point Relais sélectionné :</p>
                        <p className="text-sm">{localPudo?.name}</p>
                        <p className="text-xs">{localPudo?.address}, {localPudo?.postalCode} {localPudo?.city}</p>
                    </div>
                )}
                
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

                        {/* CHAMP DE SAISIE DU CODE POSTAL ET BOUTON DE RECHERCHE (DANS LA MODALE) */}
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
                                    key={mapKey} // 💡 CLÉ DE REMONTAGE POUR LA STABILITÉ DE LEAFLET
                                    pudos={pudosList}
                                    onPudoSelect={handleMapPudoSelect}
                                    initialLocationCP={searchPostalCode} 
                                    isDisabled={isDisabled}
                                    selectedPudoId={localPudo?.id || null}
                                />
                            ) : (
                                <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded">
                                     <p className="text-gray-600 font-semibold">
                                         {searchHasRun ? modalPudoMessage : "Saisissez un Code Postal et cliquez sur 'Rechercher' pour afficher les points de retrait."}
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