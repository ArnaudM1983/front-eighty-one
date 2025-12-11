"use client";
import React, { useState, useEffect } from 'react';
import MondialRelayHandler from './MondialRelayHandler'; 
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
    totalWeight: number; // Poids total en KG 
    orderId: string;
    currentPrice: number; 
}

const CheckoutShipping = ({
    setShippingPrice,
    setSelectedOptionId,
    setSelectedPudo,
    totalWeight, 
    orderId,
    currentPrice
}: CheckoutShippingProps) => {

    const defaultOption = INITIAL_SHIPPING_OPTIONS[0];

    const [options, setOptions] = useState<ShippingOption[]>(INITIAL_SHIPPING_OPTIONS);
    const [selectedId, setSelectedId] = useState<string>(defaultOption.id);
    const [loadingPrice, setLoadingPrice] = useState(false);


    // --- LOGIQUE D'APPEL API POUR CALCULER LE PRIX (UNIQUEMENT POUR PICKUP/COLISSIMO) ---
    useEffect(() => {
        const selectedOption = options.find(opt => opt.id === selectedId);
        
        // Si Mondial Relay est sélectionné, la logique de prix est gérée par MondialRelayHandler
        if (!selectedOption || selectedOption.id === 'mondial_relay_pr' || totalWeight <= 0) {
            if (selectedOption?.id !== 'mondial_relay_pr') {
                 setShippingPrice(0);
                 setSelectedOptionId(selectedId);
            }
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight, 
                        modeCode: selectedOption.modeCode,
                        countryCode: 'FR',
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
                setSelectedOptionId(selectedId);

            } catch (error) {
                console.error("Erreur de calcul de tarif:", error);
                setShippingPrice(0);
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();

    }, [selectedId, totalWeight, setShippingPrice, setSelectedOptionId]);


    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptionId = event.target.value;
        setSelectedId(newOptionId);
        
        // Réinitialiser le PUDO si l'on quitte un mode Relais
        const oldOption = options.find(opt => opt.id === selectedId);
        if (oldOption?.requiresPUDO) {
            setSelectedPudo(null);
        }
        
        // Si la nouvelle option n'est pas Mondial Relay, on set la méthode directement
        if (newOptionId !== 'mondial_relay_pr') {
             setSelectedOptionId(newOptionId);
             // Réinitialiser le prix si on passe à un mode non Mondial Relay, l'useEffect ci-dessus le recalculera.
             setShippingPrice(0); 
        } 
    };

    const isMondialRelaySelected = selectedId === 'mondial_relay_pr';
    
    const getPriceDisplay = (option: ShippingOption) => {
        if (option.id === 'mondial_relay_pr') {
            return currentPrice;
        }
        return option.price;
    }

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
                            {loadingPrice && selectedId === option.id && !isMondialRelaySelected ? ' (calcul...)' : ` (${getPriceDisplay(option).toFixed(2)} €)`}
                        </span>
                    </label>
                ))}
            </div>

            {/* --- ZONE DÉDIÉE À MONDIAL RELAY --- */}
            {isMondialRelaySelected && (
                 <div className="mt-4">
                    <MondialRelayHandler 
                        totalWeight={totalWeight}
                        orderId={orderId}
                        setShippingPrice={setShippingPrice}
                        setSelectedPudo={setSelectedPudo}
                        setShippingMethod={setSelectedOptionId} 
                        currentPrice={currentPrice}
                    />
                 </div>
            )}

        </div>
    );
};

export default CheckoutShipping;