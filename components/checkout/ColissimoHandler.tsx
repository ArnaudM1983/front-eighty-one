"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PUDOInfo } from './MondialRelayHandler'; // On réutilise les types existants

const PudoMap = dynamic(() => import('./PudoMap'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded"><p className="text-gray-500">Chargement de la carte Colissimo...</p></div>,
});

interface ColissimoHandlerProps {
    totalWeight: number;
    orderId: string;
    setShippingPrice: (price: number) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    setShippingMethod: (method: string) => void;
    currentPrice: number;
    customerPostalCode: string;
    customerAddress: string;
    customerCountryCode: string;
}

const MODE_ID = 'colissimo_pr';
const MODE_CODE = 'colissimo_pr';

const ColissimoHandler: React.FC<ColissimoHandlerProps> = ({
    totalWeight,
    setShippingPrice,
    setSelectedPudo,
    setShippingMethod,
    currentPrice,
    customerPostalCode,
    customerAddress,
    customerCountryCode
}) => {
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [loadingPudos, setLoadingPudos] = useState(false);
    const [localPudo, setLocalPudo] = useState<PUDOInfo>(null);
    const [error, setError] = useState<string | null>(null);
    const [pudosList, setPudosList] = useState<PUDOInfo[]>([]);
    
    // États de recherche synchronisés sur le parent au début
    const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode);
    const [searchAddress, setSearchAddress] = useState(customerAddress);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const effectiveCountryCode = customerCountryCode || 'FR';

    // 1. Initialisation du mode
    useEffect(() => {
        setShippingMethod(MODE_ID);
    }, [setShippingMethod]);

    // 2. Calcul du prix Colissimo
    useEffect(() => {
        const calculatePrice = async () => {
            setLoadingPrice(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight,
                        modeCode: MODE_CODE,
                        countryCode: effectiveCountryCode,
                    }),
                });
                const data = await res.json();
                setShippingPrice(data.shippingCost ? parseFloat(data.shippingCost) : 0);
            } catch (err) {
                setError("Impossible de calculer les frais Colissimo.");
            } finally {
                setLoadingPrice(false);
            }
        };
        calculatePrice();
    }, [totalWeight, effectiveCountryCode, setShippingPrice]);

    // 3. Recherche PUDO avec LOGIQUE RETRY (Idem Mondial Relay)
    useEffect(() => {
        if (loadingPrice || currentPrice <= 0 || searchTrigger === 0) return;

        const fetchPudosWithRetry = async (attempt = 1) => {
            setLoadingPudos(true);
            setError(null);
            const MAX_RETRIES = 5;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/pudo/colissimo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        address: searchAddress,
                        postalCode: searchPostalCode,
                        city: "", 
                        countryCode: effectiveCountryCode,
                        totalWeight: totalWeight.toString()
                    }),
                });

                const data = await res.json();
                
                if (!res.ok || !data.success || !data.pudos || data.pudos.length === 0) {
                    throw new Error("Données invalides ou aucun point trouvé.");
                }

                // Mapping des données Colissimo -> Format PUDOInfo
                const formattedPudos = data.pudos.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    postalCode: p.zipCode,
                    city: p.city,
                    country: effectiveCountryCode,
                    latitude: parseFloat(p.latitude),
                    longitude: parseFloat(p.longitude),
                    distance: p.distance
                }));

                setPudosList(formattedPudos);
                setMapKey(prev => prev + 1);
                setLoadingPudos(false);

            } catch (err: any) {
                if (attempt < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, 500 * attempt));
                    return fetchPudosWithRetry(attempt + 1);
                }
                setError(`Colissimo : ${err.message}`);
                setLoadingPudos(false);
            }
        };

        fetchPudosWithRetry();
    }, [searchTrigger, currentPrice, loadingPrice]);

    // 4. Handlers
    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData);
        setIsModalOpen(false);
    }, [setSelectedPudo]);

    const handleSearchClick = () => {
        setSearchTrigger(prev => prev + 1);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        if (searchTrigger === 0) setSearchTrigger(1);
    };

    const isDisabled = loadingPrice || currentPrice <= 0 || !!error;

    return (
        <div className='colissimo-handler'>
            {error && <div className="mt-2 p-2 rounded text-sm text-red-700 bg-red-100">{error}</div>}

            <div className="p-4 rounded border border-blue-100 bg-blue-50/30">
                {localPudo && (
                    <div className="mb-4 p-3 bg-white border border-blue-200 rounded-lg shadow-sm">
                        <p className="font-bold text-sm text-blue-600">📍 Point Colissimo sélectionné :</p>
                        <p className="text-sm font-medium">{localPudo.name}</p>
                        <p className="text-xs text-gray-500">{localPudo.address}, {localPudo.postalCode} {localPudo.city}</p>
                    </div>
                )}
                
                <button
                    onClick={handleOpenModal}
                    disabled={loadingPrice || currentPrice <= 0}
                    className="w-full p-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
                >
                    {localPudo ? "Modifier le point retrait" : "Trouver un point Colissimo"}
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 m-4 w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black uppercase text-gray-800 tracking-tight">Points de retrait Colissimo</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-black">&times;</button>
                        </div>

                        {/* DOUBLE RECHERCHE : ADRESSE + CP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Adresse</label>
                                <input type="text" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Code Postal</label>
                                <div className="flex gap-2">
                                    <input type="text" value={searchPostalCode} onChange={e => setSearchPostalCode(e.target.value)} maxLength={5} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                                    <button onClick={handleSearchClick} disabled={loadingPudos} className="bg-blue-600 text-white px-4 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                                        {loadingPudos ? "..." : "OK"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
                            {pudosList.length > 0 ? (
                                <PudoMap 
                                    key={mapKey}
                                    pudos={pudosList}
                                    onPudoSelect={handleMapPudoSelect}
                                    initialLocationCP={searchPostalCode}
                                    selectedPudoId={localPudo?.id || null}
                                    isDisabled={isDisabled}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                                    <span className="text-4xl mb-2">🔍</span>
                                    <p className="text-sm font-medium">{loadingPudos ? "Recherche des points Colissimo..." : "Aucun point trouvé pour cette adresse."}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColissimoHandler;