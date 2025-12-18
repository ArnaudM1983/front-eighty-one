"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PUDOInfo } from './MondialRelayHandler';

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

/**
 * Formate le temps HHmm en HH:mm (ex: 0900 -> 09:00)
 */
const formatTime = (t: string | undefined | null) => {
    if (!t) return "";
    return `${t.substring(0, 2)}:${t.substring(2, 4)}`;
};

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
    
    const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode);
    const [searchCity, setSearchCity] = useState(""); 
    const [searchAddress, setSearchAddress] = useState(customerAddress);
    
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const effectiveCountryCode = customerCountryCode || 'FR';

    // 1. Initialisation du mode au montage
    useEffect(() => {
        setShippingMethod(MODE_ID);
    }, [setShippingMethod]);

    // 2. Calcul du prix (indépendant de la sélection du point)
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
                setError("Erreur calcul frais Colissimo.");
            } finally {
                setLoadingPrice(false);
            }
        };
        calculatePrice();
    }, [totalWeight, effectiveCountryCode, setShippingPrice]);

    // 3. Recherche PUDO : Uniquement quand searchTrigger > 0
    useEffect(() => {
        if (searchTrigger === 0) return;

        const fetchPudosWithRetry = async (attempt = 1) => {
            setLoadingPudos(true);
            setError(null);
            const MAX_RETRIES = 3;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/pudo/colissimo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        address: searchAddress,
                        postalCode: searchPostalCode,
                        city: searchCity.toUpperCase(),
                        countryCode: effectiveCountryCode,
                        totalWeight: totalWeight.toString()
                    }),
                });

                const data = await res.json();
                
                if (!res.ok || !data.success || !data.pudos || data.pudos.length === 0) {
                    throw new Error("Aucun point trouvé. Vérifiez le code postal et la ville.");
                }

                const formattedPudos = data.pudos.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    postalCode: p.zipCode,
                    city: p.city,
                    country: effectiveCountryCode,
                    latitude: parseFloat(p.latitude),
                    longitude: parseFloat(p.longitude),
                    distance: p.distance,
                    hours: p.hours // On récupère les horaires mappés par Symfony
                }));

                setPudosList(formattedPudos);
                setMapKey(prev => prev + 1);
                setLoadingPudos(false);

            } catch (err: any) {
                if (attempt < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, 800));
                    return fetchPudosWithRetry(attempt + 1);
                }
                setError(err.message);
                setLoadingPudos(false);
            }
        };

        fetchPudosWithRetry();
    }, [searchTrigger]);

    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData);
        setIsModalOpen(false);
    }, [setSelectedPudo]);

    const handleSearchClick = () => {
        if (!searchPostalCode || !searchCity) {
            alert("Le code postal et la ville sont obligatoires.");
            return;
        }
        setSearchTrigger(prev => prev + 1);
    };

    return (
        <div className='colissimo-handler'>
            <div className="p-4 rounded border border-blue-100 bg-blue-50/30">
                {localPudo && (
                    <div className="mb-4 p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm text-blue-600 uppercase tracking-tight">Point de retrait sélectionné</p>
                                <p className="text-base font-semibold mt-1">{localPudo.name}</p>
                                <p className="text-sm text-gray-500">{localPudo.address}, {localPudo.postalCode} {localPudo.city}</p>
                            </div>
                        </div>

                        {/* AFFICHAGE DES HORAIRES */}
                        {localPudo.hours && (
                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Horaires d'ouverture</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                                    {Object.entries(localPudo.hours).map(([day, h]: [string, any]) => {
                                        if (!h) return null;
                                        const am = h.am_start ? `${formatTime(h.am_start)} - ${formatTime(h.am_end)}` : "";
                                        const pm = h.pm_start ? `${formatTime(h.pm_start)} - ${formatTime(h.pm_end)}` : "";
                                        
                                        return (
                                            <div key={day} className="flex justify-between text-[11px] border-b border-gray-50 pb-1">
                                                <span className="font-medium text-gray-700 w-16">{day}</span>
                                                <span className="text-gray-500">
                                                    {am} {am && pm ? ' / ' : ''} {pm}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={loadingPrice || currentPrice <= 0}
                    className="w-full p-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                    {localPudo ? "Changer de point de retrait" : "Sélectionner un point de retrait"}
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 m-4 w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black uppercase text-gray-800 tracking-tight">Points de retrait Colissimo</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-black">&times;</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Code Postal *</label>
                                <input type="text" value={searchPostalCode} onChange={e => setSearchPostalCode(e.target.value)} maxLength={5} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 69002" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ville *</label>
                                <input type="text" value={searchCity} onChange={e => setSearchCity(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: LYON" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Adresse (optionnel)</label>
                                <input type="text" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 10 rue de la Paix" />
                            </div>
                            <div className="flex items-end">
                                <button onClick={handleSearchClick} disabled={loadingPudos} className="w-full bg-blue-600 text-white p-2.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 uppercase">
                                    {loadingPudos ? "RECHERCHE..." : "RECHERCHER"}
                                </button>
                            </div>
                        </div>

                        {error && <div className="mb-4 p-2 rounded text-xs text-red-700 bg-red-50 border border-red-100 font-medium">{error}</div>}

                        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                            {pudosList.length > 0 ? (
                                <PudoMap 
                                    key={mapKey}
                                    pudos={pudosList}
                                    onPudoSelect={handleMapPudoSelect}
                                    initialLocationCP={searchPostalCode}
                                    selectedPudoId={localPudo?.id || null}
                                    isDisabled={false}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <span className="text-4xl mb-4">📍</span>
                                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Lancez une recherche</p>
                                    <p className="text-xs max-w-xs mt-1">Saisissez votre code postal et votre ville pour afficher les points Colissimo disponibles.</p>
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