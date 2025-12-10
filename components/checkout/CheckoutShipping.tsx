// src/components/checkout/CheckoutShipping.tsx

"use client";
import React, { useState, useEffect } from 'react';
// Assurez-vous que PUDOInfo est importé ou défini correctement
type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;


type ShippingOption = {
    id: string;
    label: string;
    modeCode: string;
    requiresPUDO: boolean;
    price: number;
};

// Liste des options de base, incluant les options Colissimo
const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
    { id: 'pickup', label: 'Commande à venir retirer en boutique', modeCode: 'pickup', requiresPUDO: false, price: 0.00 },
    { id: 'mondial_relay_pr', label: 'Mondial Relay Point Relais', modeCode: 'pr', requiresPUDO: true, price: 0.00 },
    { id: 'colissimo_domicile', label: 'Colissimo Domicile', modeCode: 'standard_colissimo', requiresPUDO: false, price: 0.00 },
];

type CheckoutShippingProps = {
    setShippingPrice: (price: number) => void;
    setSelectedOptionId: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    totalWeight: number; // Poids total en KG (CORRIGÉ PAR LE PARENT)
    orderId: string;
    currentPrice: number; // Prix actuel pour l'affichage
}

const CheckoutShipping = ({
    setShippingPrice,
    setSelectedOptionId,
    setSelectedPudo,
    totalWeight, // Doit être en KG ici
    currentPrice
}: CheckoutShippingProps) => {

    const defaultOption = INITIAL_SHIPPING_OPTIONS[0];

    const [options, setOptions] = useState<ShippingOption[]>(INITIAL_SHIPPING_OPTIONS);
    const [selectedId, setSelectedId] = useState<string>(defaultOption.id);
    const [loadingPrice, setLoadingPrice] = useState(false);

    // État local du PUDO pour l'affichage
    const [localPudo, setLocalPudo] = useState<PUDOInfo>(null);

    // --- LOGIQUE D'APPEL API POUR CALCULER LE PRIX ---
    useEffect(() => {
        const selectedOption = options.find(opt => opt.id === selectedId);
        // Si totalWeight est 0 (ex: panier vide), pas besoin d'appeler l'API
        if (!selectedOption || totalWeight <= 0) {
             // S'assurer que le poids est en KG ici (totalWeight=1.78)
            setShippingPrice(0);
            return;
        }
        
        const calculatePrice = async () => {
            if (selectedOption.modeCode === 'pickup') {
                setShippingPrice(0);
                setSelectedOptionId(selectedId);
                return;
            }

            setLoadingPrice(true);
            try {
                // Utilisation de la route symfony conventionnelle (ex: /api/shipping/calculate)
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // totalWeight DOIT ÊTRE EN KG (ex: 1.78) ici
                        totalWeight: totalWeight, 
                        modeCode: selectedOption.modeCode,
                        countryCode: 'FR',
                    }),
                });

                if (!res.ok) {
                    // Log plus détaillé en cas d'erreur API
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    console.error("API Error during tariff calculation:", res.status, errorData);
                    throw new Error("API call failed.");
                }

                const data = await res.json();
                const newPrice = data.shippingCost ? parseFloat(data.shippingCost) : 0;

                // 1. Mise à jour de l'état des options pour afficher le prix
                setOptions(prev => prev.map(opt =>
                    opt.id === selectedOption.id ? { ...opt, price: newPrice } : opt
                ));

                // 2. Mise à jour des états remontés au parent
                setShippingPrice(newPrice);
                setSelectedOptionId(selectedOption.id);

            } catch (error) {
                console.error("Erreur de calcul de tarif:", error);
                setShippingPrice(0);
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();

    }, [selectedId, totalWeight, setShippingPrice, setSelectedOptionId]); // Retirer 'options' si non nécessaire pour éviter des boucles

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptionId = event.target.value;
        setSelectedId(newOptionId);

        // Réinitialiser le PUDO si l'on quitte un mode Relais
        const oldOption = options.find(opt => opt.id === selectedId);
        if (oldOption?.requiresPUDO) {
            setSelectedPudo(null);
            setLocalPudo(null);
        }
    };

    const selectedOption = options.find(opt => opt.id === selectedId);
    const requiresPudo = selectedOption?.requiresPUDO;
    const isPudoSelected = requiresPudo && localPudo;

    // --- LOGIQUE DU WIDGET MONDIAL RELAY ---
    const handlePudoSelection = (pudoData: any) => {
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
    };

    // Exposer la fonction handlePudoSelection globalement
    useEffect(() => {
        (window as any).handlePudoSelection = handlePudoSelection;

        return () => {
            delete (window as any).handlePudoSelection;
        };
    }, []);

    // --- RENDU ---
    return (
        <div className='checkout-shipping mt-8'>
            <p className='font-semibold mb-4'>Options de livraison</p>

            <div className='space-y-3'>
                {options.map((option) => (
                    <label
                        key={option.id}
                        htmlFor={option.id}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${selectedId === option.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <input
                            type="radio"
                            id={option.id}
                            name="shippingOption"
                            value={option.id}
                            checked={selectedId === option.id}
                            onChange={handleOptionChange}
                            className='form-radio h-4 w-4 text-blue-500 focus:ring-blue-500'
                        />
                        <span className='ml-3 text-sm font-medium text-gray-700 flex-1'>
                            {option.label}
                            {loadingPrice && selectedId === option.id ? ' (calcul...)' : ` (${option.price.toFixed(2)} €)`}
                        </span>
                    </label>
                ))}
            </div>

            {/* --- ZONE D'AFFICHAGE DU POINT RELAIS --- */}
            {requiresPudo && (
                <div className="mt-4 p-4 border border-dashed rounded bg-yellow-50">
                    {isPudoSelected ? (
                        <p className="text-sm font-medium text-green-700 mb-2">
                            ✅ Point Relais sélectionné : {localPudo?.name} ({localPudo?.postalCode})
                        </p>
                    ) : (
                        <p className="text-sm text-gray-700 mb-2">
                            Veuillez sélectionner votre point de retrait.
                        </p>
                    )}

                    {/* Conteneur pour le widget Mondial Relay */}
                    <div id="Zone_Widget" className="mt-2 h-96 border border-gray-300">
                        <p className="text-gray-400 text-center pt-8">Chargement du widget de sélection de point relais...</p>
                    </div>

                </div>
            )}

        </div>
    );
};

export default CheckoutShipping;