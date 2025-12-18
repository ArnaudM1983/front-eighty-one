"use client";
import React, { useState, useEffect, useRef } from 'react';
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
}) => {
    const [loading, setLoading] = useState(false);
    const [isPluginReallyReady, setIsPluginReallyReady] = useState(false);
    const [localPudo, setLocalPudo] = useState<PUDOInfo | null>(null);
    const initializationRef = useRef(false);

    useEffect(() => {
        const win = window as any;

        const checkFn = () => {
            const jq = win.jQuery || win.$;
            if (jq && typeof jq.fn?.frameColissimo === 'function') {
                setIsPluginReallyReady(true);
                return true;
            }
            return false;
        };

        const loadPlugin = async () => {
            if (initializationRef.current || checkFn()) return;
            initializationRef.current = true;

            try {
                // On s'assure que jQuery est bien là avant de fetch
                const jq = win.jQuery || win.$;
                if (!jq) {
                    console.warn("jQuery absent, nouvelle tentative dans 500ms");
                    initializationRef.current = false;
                    setTimeout(loadPlugin, 500);
                    return;
                }

                console.log("🛠️ Récupération du plugin Colissimo...");
                const response = await fetch("https://ws.colissimo.fr/widget-colissimo/js/jquery.plugin.colissimo.min.js");
                const scriptText = await response.text();

                // On injecte jQuery explicitement dans le scope de la fonction
                const executePlugin = new Function('jQuery', '$', scriptText);
                executePlugin(jq, jq);

                // Vérification avec petit délai pour laisser le temps à l'objet fn de se mettre à jour
                setTimeout(() => {
                    if (checkFn()) {
                        console.log("✅ Widget Colissimo prêt et lié à jQuery");
                    } else {
                        console.error("❌ Échec de liaison fn.frameColissimo");
                    }
                }, 200);

            } catch (err) {
                console.error("Erreur chargement plugin:", err);
            }
        };

        // On lance le processus
        loadPlugin();
    }, []);

    // ... (useEffect du prix inchangé)

    const handleOpenWidget = async () => {
        const win = window as any;
        const jq = win.jQuery || win.$;
        
        if (!isPluginReallyReady) {
            console.error("Plugin non prêt");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/colissimo/widget-token`);
            const data = await res.json();

            if (!data.token) throw new Error("Pas de token");

            jq("#colissimo-container").frameColissimo({
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
                    jq("#colissimo-container").empty();
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border rounded-xl bg-blue-50/20 shadow-sm">
            <link rel="stylesheet" href="https://ws.colissimo.fr/widget-colissimo/css/colissimo_widget.css" />
            {!localPudo ? (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleOpenWidget}
                        disabled={!isPluginReallyReady || loading}
                        className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                            isPluginReallyReady 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {loading ? "Ouverture..." : isPluginReallyReady ? "Choisir mon Point Retrait" : "Préparation carte..."}
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-200">
                    <div className="text-left">
                        <p className="font-bold text-gray-900 leading-tight">{localPudo.name}</p>
                        <p className="text-sm text-gray-500">{localPudo.address}, {localPudo.city}</p>
                    </div>
                    <button type="button" onClick={() => { setLocalPudo(null); setSelectedPudo(null); }} className="text-blue-600 text-sm font-semibold">Modifier</button>
                </div>
            )}
            <div id="colissimo-container" className="mt-4 overflow-hidden rounded-lg min-h-[500px]"></div>
        </div>
    );
};

export default ColissimoHandler;