// src/components/checkout/CheckoutShipping.tsx (Complet)

"use client";
import React, { useState, useEffect } from 'react';
// Import du composant spécifique pour le mode Point Relais (et le type PUDOInfo)
import MondialRelayHandler, { PUDOInfo } from './MondialRelayHandler'; 

type ShippingOption = {
    id: string;
    label: string;
    modeCode: string;
    requiresPUDO: boolean;
    price: number;
};

// Liste des options de base
const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
    { id: 'pickup', label: 'Commande à venir retirer en boutique', modeCode: 'pickup', requiresPUDO: false, price: 0.00 },
    { id: 'mondial_relay_pr', label: 'Mondial Relay Point Relais', modeCode: 'pr', requiresPUDO: true, price: 0.00 },
    { id: 'colissimo_domicile', label: 'Colissimo Domicile', modeCode: 'standard_colissimo', requiresPUDO: false, price: 0.00 },
];

type CheckoutShippingProps = {
    setShippingPrice: (price: number) => void;
    setSelectedOptionId: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    totalWeight: number; // Poids total en KG
    orderId: string;
    currentPrice: number; // Prix actuel (affiché dans le récapitulatif)
    
    // PROPRIÉTÉS CLIENT REQUISES
    customerPostalCode: string; 
    customerCountryCode: string;
}

const CheckoutShipping = ({
    setShippingPrice,
    setSelectedOptionId,
    setSelectedPudo,
    totalWeight,
    orderId,
    currentPrice,
    customerPostalCode, 
    customerCountryCode 
}: CheckoutShippingProps) => { // <-- Le type CheckoutShippingProps est maintenant satisfait

    const defaultOption = INITIAL_SHIPPING_OPTIONS[0];

    const [options, setOptions] = useState<ShippingOption[]>(INITIAL_SHIPPING_OPTIONS);
    const [selectedId, setSelectedId] = useState<string>(defaultOption.id);
    const [loadingPrice, setLoadingPrice] = useState(false);


    // --- LOGIQUE D'APPEL API POUR CALCULER LE PRIX (NON-PUDO) ---
    useEffect(() => {
        const selectedOption = options.find(opt => opt.id === selectedId);
        
        if (!selectedOption || totalWeight <= 0) {
            setShippingPrice(0);
            return;
        }
        
        const calculatePrice = async () => {
            // Mondial Relay est géré par MondialRelayHandler; Pickup est 0.
            if (selectedOption.modeCode === 'pickup' || selectedOption.requiresPUDO) {
                if (selectedOption.modeCode === 'pickup') {
                    setShippingPrice(0);
                }
                setSelectedOptionId(selectedId);
                return;
            }

            setLoadingPrice(true);
            try {
                // Ce bloc gère les modes non-PUDO (ex: Colissimo Domicile)
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight, 
                        modeCode: selectedOption.modeCode,
                        countryCode: customerCountryCode, 
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    console.error("API Error during tariff calculation:", res.status, errorData);
                    throw new Error("API call failed.");
                }

                const data = await res.json();
                const newPrice = data.shippingCost ? parseFloat(data.shippingCost) : 0;

                setOptions(prev => prev.map(opt =>
                    opt.id === selectedOption.id ? { ...opt, price: newPrice } : opt
                ));
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

    }, [selectedId, totalWeight, setShippingPrice, setSelectedOptionId, options, customerCountryCode]);


    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptionId = event.target.value;
        
        const oldOption = options.find(opt => opt.id === selectedId);
        if (oldOption?.requiresPUDO && newOptionId !== oldOption.id) {
            setSelectedPudo(null);
        }
        
        setSelectedId(newOptionId);
    };

    const selectedOption = options.find(opt => opt.id === selectedId);
    const requiresPudo = selectedOption?.requiresPUDO;


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
                            {loadingPrice && selectedId === option.id && !requiresPudo ? ' (calcul...)' : ` (${option.price.toFixed(2)} €)`}
                        </span>
                    </label>
                ))}
            </div>

            {/* Rendu du GESTIONNAIRE MONDIAL RELAY si l'option est sélectionnée */}
            {selectedId === 'mondial_relay_pr' && (
                <div className="mt-4">
                    <MondialRelayHandler
                        totalWeight={totalWeight}
                        orderId={orderId}
                        setShippingPrice={setShippingPrice}
                        setSelectedPudo={setSelectedPudo}
                        setShippingMethod={setSelectedOptionId}
                        currentPrice={currentPrice}
                        customerPostalCode={customerPostalCode} 
                        customerCountryCode={customerCountryCode} 
                    />
                </div>
            )}
            
            {/* Affichage du prix final pour les options non gérées par MondialRelayHandler */}
            {selectedId !== 'mondial_relay_pr' && selectedOption && (
                 <p className="mt-4 text-sm text-right text-gray-600">
                    Frais de port :
                    <span className="font-semibold ml-1">
                        {currentPrice.toFixed(2)} €
                    </span>
                </p>
            )}

        </div>
    );
};

export default CheckoutShipping;