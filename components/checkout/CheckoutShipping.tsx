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
    setSelectedPudo: (pudo: PUDOInfo | null) => void; 
    totalWeight: number; // Poids total en KG
    orderId: string;
    currentPrice: number; // Prix actuel des frais de port (mis à jour par le parent/MRHandler)
    
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
}: CheckoutShippingProps) => { 

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
                
                // Si Mondial Relay est sélectionné, on utilise son prix actuel dans l'état (ou 0)
                if (selectedOption.requiresPUDO) {
                    setShippingPrice(selectedOption.price);
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
            // Réinitialise le point relais sélectionné si l'utilisateur change d'option
            setSelectedPudo(null); 
        }
        
        setSelectedId(newOptionId);
    };

    const selectedOption = options.find(opt => opt.id === selectedId);


    // --- RENDU ---
    return (
        <div className='checkout-shipping mt-8'>
            <p className='font-semibold mb-4'>Options de livraison</p>

            <div className='space-y-3'>
                {options.map((option) => {
                    
                    let priceToDisplay = option.price;
                    let isCurrentOption = selectedId === option.id;
                    
                    // Si c'est l'option Mondial Relay (requiresPUDO) ET qu'elle est sélectionnée,
                    // on utilise le currentPrice qui est mis à jour par le MondialRelayHandler.
                    if (option.requiresPUDO && isCurrentOption) {
                        // On utilise currentPrice si elle est positive
                        if (currentPrice > 0 || option.price !== 0) { 
                             priceToDisplay = currentPrice;
                        }
                    }
                    
                    // --- LOGIQUE MODIFIÉE POUR MASQUER 0,00 € ET GÉRER LE LIBELLÉ ---
                    let priceLabel = '';

                    // Cas 1 : Prix en cours de calcul (pour Colissimo, géré par le useEffect principal)
                    if (loadingPrice && isCurrentOption && !option.requiresPUDO) {
                        priceLabel = ' (calcul...)';
                    } 
                    // Cas 2 : Le prix est 0,00 € et ce n'est PAS la livraison en boutique (pickup)
                    else if (priceToDisplay === 0 && option.modeCode !== 'pickup') {
                        // Affiche un tiret tant que le prix n'a pas été trouvé pour les options payantes
                        priceLabel = ' (-)'; 
                    } 
                    // Cas 3 : Prix calculé ou option Pickup (gratuit)
                    else {
                        priceLabel = ` (${priceToDisplay.toFixed(2)} €)`;
                    }
                    // ------------------------------------------


                    return (
                        <React.Fragment key={option.id}>
                            {/* 1. La balise LABEL/INPUT pour l'option */}
                            <label
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
                                    checked={isCurrentOption}
                                    onChange={handleOptionChange}
                                    className='form-radio h-4 w-4 text-blue-500 focus:ring-blue-500'
                                />
                                <span className='ml-3 text-sm font-medium text-gray-700 flex-1'>
                                    {option.label}
                                    {priceLabel}
                                </span>
                            </label>

                            {/* 2. Affichage du GESTIONNAIRE MONDIAL RELAY si l'option est sélectionnée (juste en dessous) */}
                            {option.id === 'mondial_relay_pr' && selectedId === option.id && (
                                <div className="mt-2 p-3 border border-dashed border-blue-200 rounded-md bg-white">
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
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Le bloc de prix final (optionnel, affichant le prix actuel du frais de port sélectionné) */}
            {selectedOption && (
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