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

    useEffect(() => {
        setShippingMethod(MODE_ID);
    }, [setShippingMethod]);

    // 1. Calcul du prix via le PROXY
    useEffect(() => {
        const calculatePrice = async () => {
            setLoadingPrice(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include", // Important pour la session
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

    // 2. Recherche des points de retrait via le PROXY
    useEffect(() => {
        if (searchTrigger === 0) return;

        const fetchPudosWithRetry = async (attempt = 1) => {
            setLoadingPudos(true);
            setError(null);
            const MAX_RETRIES = 3;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/order/pudo/colissimo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include", // Indispensable pour Safari
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
                    hours: p.hours 
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
                <div 
                    className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" 
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] sm:h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-50">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black uppercase text-gray-800 tracking-tight leading-none">
                                    Points Colissimo
                                </h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 hidden sm:block">
                                    Sélectionnez votre point de retrait sur la carte
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
                            >
                                <span className="text-2xl -mt-0.5">&times;</span>
                            </button>
                        </div>

                        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="col-span-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">CP *</label>
                                    <input 
                                        type="text" 
                                        value={searchPostalCode} 
                                        onChange={e => setSearchPostalCode(e.target.value)} 
                                        maxLength={5} 
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
                                        placeholder="69002" 
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Ville *</label>
                                    <input 
                                        type="text" 
                                        value={searchCity} 
                                        onChange={e => setSearchCity(e.target.value)} 
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
                                        placeholder="LYON" 
                                    />
                                </div>
                                <div className="hidden sm:block sm:col-span-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Adresse</label>
                                    <input 
                                        type="text" 
                                        value={searchAddress} 
                                        onChange={e => setSearchAddress(e.target.value)} 
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
                                        placeholder="Optionnel" 
                                    />
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button 
                                        onClick={handleSearchClick} 
                                        disabled={loadingPudos} 
                                        className="w-full h-[45px] sm:h-[42px] bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:bg-blue-300 uppercase"
                                    >
                                        {loadingPudos ? "..." : "OK"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative bg-slate-50">
                            {error && (
                                <div className="absolute top-4 left-4 right-4 z-1000 p-3 rounded-xl text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 shadow-xl">
                                    ⚠️ {error}
                                </div>
                            )}

                            {pudosList.length > 0 ? (
                                <div className="h-full w-full">
                                    <PudoMap 
                                        key={mapKey}
                                        pudos={pudosList}
                                        onPudoSelect={handleMapPudoSelect}
                                        initialLocationCP={searchPostalCode}
                                        selectedPudoId={localPudo?.id || null}
                                        isDisabled={false}
                                    />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-3xl">📍</span>
                                    </div>
                                    <p className="text-sm font-black text-gray-600 uppercase tracking-widest">Lancez une recherche</p>
                                    <p className="text-[11px] max-w-[200px] mt-2 font-medium leading-relaxed">
                                        Entrez votre code postal et votre ville pour voir les points de retrait.
                                    </p>
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