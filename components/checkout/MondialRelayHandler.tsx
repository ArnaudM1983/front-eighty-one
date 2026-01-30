"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const PudoMap = dynamic(() => import('./PudoMap'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded"><p className="text-gray-500">Chargement de la carte...</p></div>,
});

export interface PUDOHours {
    am_start: string;
    am_end: string;
    pm_start: string;
    pm_end: string;
}

export type PUDOHoursByDay = {
    Lundi: PUDOHours;
    Mardi: PUDOHours;
    Mercredi: PUDOHours;
    Jeudi: PUDOHours;
    Vendredi: PUDOHours;
    Samedi: PUDOHours;
    Dimanche: PUDOHours;
}

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
    hours?: PUDOHoursByDay;
} | null;

interface MondialRelayHandlerProps {
    totalWeight: number;
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

/**
 * Formate le temps HHmm en HH:mm (ex: 0900 -> 09:00)
 */
const formatTime = (t: string | undefined | null) => {
    if (!t) return "";
    return `${t.substring(0, 2)}:${t.substring(2, 4)}`;
};

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

    const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode || '69001');
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const effectiveCountryCode = customerCountryCode || 'FR';

    const hasValidCoords = (p: PUDOInfo): p is PUDOInfo => {
        return (
            p !== null &&
            typeof p.latitude === 'number' &&
            typeof p.longitude === 'number' &&
            p.latitude !== 0 &&
            p.longitude !== 0
        );
    };

    useEffect(() => {
        setShippingMethod(MODE_ID);
    }, [setShippingMethod]);

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
                        totalWeight,
                        modeCode: MODE_CODE,
                        countryCode: effectiveCountryCode,
                    }),
                });
                const data = await res.json();
                setShippingPrice(data.shippingCost ? parseFloat(data.shippingCost) : 0);
            } catch (err: any) {
                setError("Erreur de calcul tarifaire.");
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();
    }, [totalWeight, effectiveCountryCode, setShippingPrice]);

    useEffect(() => {
        if (loadingPrice || currentPrice <= 0 || searchTrigger === 0) return;

        const fetchPudosWithRetry = async (attempt = 1) => {
            setLoadingPudos(true);
            setError(null);
            const MAX_RETRIES = 5;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/pudo/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postalCode: searchPostalCode,
                        countryCode: effectiveCountryCode,
                        totalWeight,
                    }),
                });

                const data = await res.json();
                const pudos = data.pudos || [];

                if (pudos.length > 0 && pudos.filter(hasValidCoords).length === 0) {
                    throw new Error(`Coordonnées invalides reçues.`);
                }

                if (pudos.length === 0) {
                    throw new Error(`Aucun Point Relais disponible.`);
                }

                setPudosList(pudos);
                setMapKey(prev => prev + 1);
                setLoadingPudos(false);

            } catch (err: any) {
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 500 + 500 * attempt));
                    return fetchPudosWithRetry(attempt + 1);
                }
                setError(err.message);
                setLoadingPudos(false);
            }
        };

        fetchPudosWithRetry();
    }, [searchTrigger, currentPrice, loadingPrice]);

    const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
        setLocalPudo(pudoData);
        setSelectedPudo(pudoData);
        setIsModalOpen(false);
    }, [setSelectedPudo]);

    const handleSearchClick = () => {
        if (searchPostalCode.length === 5) {
            setSearchTrigger(prev => prev + 1);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        if (searchTrigger === 0 && searchPostalCode.length === 5) {
            setSearchTrigger(1);
        }
    };

    const isDisabled = loadingPrice || currentPrice <= 0;

    return (
        <div className='mondial-relay-handler'>
            <div className="p-4 rounded border border-blue-100 bg-blue-50/30">

                {localPudo && (
                    <div className="mb-4 p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                        <div>
                            <p className="font-bold text-sm text-blue-600 uppercase tracking-tight">Point Relais sélectionné</p>
                            <p className="text-base font-semibold mt-1">{localPudo.name}</p>
                            <p className="text-sm text-gray-500">{localPudo.address}, {localPudo.postalCode} {localPudo.city}</p>
                        </div>

                        {/* AFFICHAGE DES HORAIRES (STYLE COLLISSIMO) */}
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
                                                <span className="text-gray-500 text-right">
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
                    onClick={handleOpenModal}
                    disabled={isDisabled}
                    className="w-full p-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md tracking-wide cursor-pointer"
                >
                    {localPudo ? "Changer de Point Relais" : "Sélectionner un point de retrait"}
                </button>
            </div>

            {/* MODALE REFAITE AVEC STYLE FLOU ET MODERNE */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER COMPACT */}
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-50">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black uppercase text-gray-800 tracking-tight leading-none">
                                    Points Mondial Relay
                                </h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 hidden sm:block">
                                    Trouvez le point de retrait le plus proche
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
                            >
                                <span className="text-2xl mt-[-2px]">&times;</span>
                            </button>
                        </div>

                        {/* BARRE DE RECHERCHE OPTIMISÉE (Côte à côte sur mobile) */}
                        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100">
                            <div className="flex flex-row items-end gap-2 max-w-2xl mx-auto">
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">
                                        Code Postal
                                    </label>
                                    <input
                                        type="text"
                                        value={searchPostalCode}
                                        onChange={(e) => setSearchPostalCode(e.target.value.substring(0, 5))}
                                        maxLength={5}
                                        placeholder="75001"
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSearchClick}
                                    disabled={searchPostalCode.length !== 5 || loadingPudos}
                                    className='px-6 h-[46px] sm:h-[42px] bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:bg-blue-300 uppercase'
                                >
                                    {loadingPudos ? '...' : 'OK'}
                                </button>
                            </div>
                        </div>

                        {/* ZONE DE CARTE / ERROR */}
                        <div className='flex-1 relative bg-slate-50'>
                            {error && (
                                <div className="absolute top-4 left-4 right-4 z-[1000] p-3 rounded-xl text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 shadow-xl">
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
                                        isDisabled={isDisabled}
                                        selectedPudoId={localPudo?.id || null}
                                    />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-3xl">🏠</span>
                                    </div>
                                    <p className="text-sm font-black text-gray-600 uppercase tracking-widest">
                                        {loadingPudos ? 'Recherche...' : 'Où livrer votre colis ?'}
                                    </p>
                                    <p className="text-[11px] max-w-[200px] mt-2 font-medium leading-relaxed">
                                        {loadingPudos
                                            ? "Nous interrogeons Mondial Relay..."
                                            : "Entrez votre code postal pour afficher les points relais disponibles."
                                        }
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

export default MondialRelayHandler;