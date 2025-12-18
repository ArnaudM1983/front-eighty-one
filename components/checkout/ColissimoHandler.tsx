"use client";
import React, { useState, useEffect } from 'react';
import { PUDOInfo } from './MondialRelayHandler';

interface ColissimoHandlerProps {
    totalWeight: number;
    orderId: string;
    setShippingPrice: (price: number) => void;
    setSelectedPudo: (pudo: PUDOInfo | null) => void;
    setShippingMethod: (method: string) => void;
    currentPrice: number;
    customerPostalCode: string;
    customerCountryCode: string;
    customerAddress: string;
}

const ColissimoHandler: React.FC<ColissimoHandlerProps> = ({
    totalWeight,
    setShippingPrice,
    setSelectedPudo,
    setShippingMethod,
    customerPostalCode,
    customerCountryCode,
    customerAddress
}) => {
    const [loading, setLoading] = useState(false);
    const [isPluginInitialized, setIsPluginInitialized] = useState(false);
    const [localPudo, setLocalPudo] = useState<PUDOInfo | null>(null);

    useEffect(() => {
        const loadScripts = async () => {
            const win = window as any;

            // 1. Charger jQuery si non présent
            if (!win.jQuery) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
                    script.async = false; // Désactive l'asynchronisme pour l'ordre
                    script.onload = () => {
                        win.jQuery = win.$;
                        resolve(true);
                    };
                    document.body.appendChild(script);
                });
            }

            // 2. Charger le Plugin Colissimo (seulement après jQuery)
            if (!win.jQuery.fn?.frameColissimo) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = "https://ws.colissimo.fr/widget-colissimo/js/jquery.plugin.colissimo.min.js";
                    script.async = false;
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            // 3. Vérification finale avec boucle de sécurité
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (win.jQuery?.fn?.frameColissimo) {
                    console.log("✅ Liaison Colissimo OK");
                    setIsPluginInitialized(true);
                    clearInterval(checkInterval);
                }
                if (attempts > 20) {
                    console.error("❌ Échec critique de liaison Colissimo");
                    clearInterval(checkInterval);
                }
            }, 200);
        };

        loadScripts();
    }, []);

    // Calcul du prix initial
    useEffect(() => {
        setShippingMethod('colissimo_pr');
        const fetchPrice = async () => {
            if (totalWeight <= 0) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight,
                        modeCode: 'colissimo_pr',
                        countryCode: customerCountryCode || 'FR',
                    }),
                });
                const data = await res.json();
                if (data.shippingCost) setShippingPrice(parseFloat(data.shippingCost));
            } catch (e) { console.error(e); }
        };
        fetchPrice();
    }, [totalWeight, customerCountryCode, setShippingMethod, setShippingPrice]);

    const openColissimoWidget = async () => {
        const win = window as any;
        const $ = win.jQuery;
        if (!isPluginInitialized || !$) return;

        setLoading(true);
        try {
            const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/colissimo/widget-token`);
            const data = await tokenRes.json();

            $("#colissimo-container").frameColissimo({
                token: data.token,
                ceCountryList: customerCountryCode || "FR",
                ceZipCode: customerPostalCode,
                weight: totalWeight,
                dyrk: 'true',
                callBackFrame: (pudo: any) => {
                    const formatted: PUDOInfo = {
                        id: pudo.identifiant,
                        name: pudo.nom,
                        address: pudo.adresse1 + (pudo.adresse2 ? " " + pudo.adresse2 : ""),
                        postalCode: pudo.codePostal,
                        city: pudo.localite,
                        country: pudo.codePays,
                    };
                    setLocalPudo(formatted);
                    setSelectedPudo(formatted);
                    $("#colissimo-container").empty();
                }
            });
        } catch (error) {
            console.error("Erreur Colissimo:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border rounded-xl bg-blue-50/20 shadow-sm transition-all duration-300">
            <link rel="stylesheet" href="https://ws.colissimo.fr/widget-colissimo/css/colissimo_widget.css" />
            
            {!localPudo ? (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={openColissimoWidget}
                        disabled={!isPluginInitialized || loading}
                        className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                            isPluginInitialized 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                            : 'bg-gray-200 text-gray-400 cursor-wait'
                        }`}
                    >
                        {!isPluginInitialized ? "Initialisation du widget..." : "Choisir mon Point Retrait"}
                    </button>
                    {!isPluginInitialized && (
                        <p className="text-[10px] text-orange-500 mt-2 italic animate-pulse font-medium">
                            Connexion sécurisée aux serveurs Colissimo en cours...
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-200 shadow-sm animate-in fade-in">
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Point sélectionné</p>
                        <p className="font-bold text-gray-900 leading-tight">{localPudo.name}</p>
                        <p className="text-sm text-gray-500">{localPudo.address}, {localPudo.city}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => { setLocalPudo(null); setSelectedPudo(null); }} 
                        className="text-xs font-semibold text-blue-600 hover:underline px-2"
                    >
                        Changer
                    </button>
                </div>
            )}
            <div id="colissimo-container" className="mt-4 overflow-hidden rounded-lg"></div>
        </div>
    );
};

export default ColissimoHandler;