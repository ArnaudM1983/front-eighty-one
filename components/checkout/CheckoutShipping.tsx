"use client";
import React, { useState, useEffect } from 'react';
import MondialRelayHandler, { PUDOInfo } from './MondialRelayHandler'; 
import ColissimoHandler from './ColissimoHandler'; 

type ShippingOption = {
    id: string;
    label: string;
    modeCode: string;
    requiresPUDO: boolean;
    price: number;
};

const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
    { id: 'pickup', label: 'Commande à venir retirer en boutique', modeCode: 'pickup', requiresPUDO: false, price: 0.00 },
    { id: 'mondial_relay_pr', label: 'Mondial Relay Point Relais', modeCode: 'mondial_relay_pr', requiresPUDO: true, price: 0.00 },
    { id: 'colissimo_ss', label: 'Colissimo Domicile (Sans signature)', modeCode: 'colissimo_ss', requiresPUDO: false, price: 0.00 },
    { id: 'colissimo_as', label: 'Colissimo Domicile (Avec signature)', modeCode: 'colissimo_as', requiresPUDO: false, price: 0.00 },
    { id: 'colissimo_pr', label: 'Colissimo Point Retrait / Bureau de Poste', modeCode: 'colissimo_pr', requiresPUDO: true, price: 0.00 },
];

type CheckoutShippingProps = {
    setShippingPrice: (price: number) => void;
    setSelectedOptionId: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo | null) => void; 
    totalWeight: number; // Poids en KG
    orderId: string;
    currentPrice: number; 
    customerPostalCode: string; 
    customerCountryCode: string;
    customerAddress: string;
}

const CheckoutShipping = ({
    setShippingPrice,
    setSelectedOptionId,
    setSelectedPudo,
    totalWeight,
    orderId,
    currentPrice,
    customerPostalCode, 
    customerCountryCode,
    customerAddress 
}: CheckoutShippingProps) => { 

    const [options, setOptions] = useState<ShippingOption[]>(INITIAL_SHIPPING_OPTIONS);
    const [selectedId, setSelectedId] = useState<string>(INITIAL_SHIPPING_OPTIONS[0].id);
    const [loadingPrice, setLoadingPrice] = useState(false);

    useEffect(() => {
        const selectedOption = options.find(opt => opt.id === selectedId);
        
        if (!selectedOption || totalWeight <= 0) {
            setShippingPrice(0);
            return;
        }
        
        const calculatePrice = async () => {
            // 1. Cas Retrait Boutique
            if (selectedOption.modeCode === 'pickup') {
                setShippingPrice(0);
                setSelectedOptionId(selectedId);
                return;
            }
            
            // 2. Cas Points Relais (Mondial Relay ou Colissimo PR)
            // Le prix est géré par les composants Handlers respectifs
            if (selectedOption.requiresPUDO) {
                setSelectedOptionId(selectedId);
                // On ne force pas setShippingPrice ici pour laisser le Handler s'en charger
                return;
            }

            // 3. Cas Livraison Domicile (Colissimo ss et as)
            setLoadingPrice(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight, // S'assurer que c'est bien en KG (ex: 1.78)
                        modeCode: selectedOption.modeCode,
                        countryCode: customerCountryCode || 'FR', 
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erreur API");
                }

                const data = await res.json();
                const newPrice = data.shippingCost ? parseFloat(data.shippingCost) : 0;

                // Mise à jour de la liste locale pour l'affichage du prix à côté du label
                setOptions(prev => prev.map(opt =>
                    opt.id === selectedOption.id ? { ...opt, price: newPrice } : opt
                ));

                // Notification au parent
                setShippingPrice(newPrice);
                setSelectedOptionId(selectedOption.id);

            } catch (error) {
                console.error("Erreur de calcul de tarif domicile:", error);
                setShippingPrice(0);
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();

    // 💡 Correction: On ne dépend plus de 'currentPrice' ou 'options' pour éviter les boucles infinies
    }, [selectedId, totalWeight, customerCountryCode, setSelectedOptionId, setShippingPrice]);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptionId = event.target.value;
        const oldOption = options.find(opt => opt.id === selectedId);

        // Si on change de mode, on nettoie le point relais
        if (oldOption?.requiresPUDO && newOptionId !== oldOption.id) {
            setSelectedPudo(null); 
            setShippingPrice(0); 
        }
        
        setSelectedId(newOptionId);
    };

    return (
        <div className='checkout-shipping mt-8'>
            <p className='font-semibold mb-4 text-gray-800'>Options de livraison</p>

            <div className='space-y-3'>
                {options.map((option) => {
                    const isCurrentOption = selectedId === option.id;
                    
                    // Déterminer le prix à afficher
                    // Pour les PUDO, on utilise currentPrice (mis à jour par les handlers)
                    // Pour les autres, on utilise le prix stocké dans l'objet option
                    const priceToDisplay = (option.requiresPUDO && isCurrentOption) 
                        ? currentPrice 
                        : option.price;
                    
                    let priceLabel = '';
                    if (loadingPrice && isCurrentOption && !option.requiresPUDO) {
                        priceLabel = ' (calcul...)';
                    } else if (priceToDisplay === 0 && option.modeCode !== 'pickup') {
                        priceLabel = ' (-)'; 
                    } else {
                        priceLabel = ` (${priceToDisplay.toFixed(2)}\u00A0€)`;
                    }

                    return (
                        <React.Fragment key={option.id}>
                            <label
                                htmlFor={option.id}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                                    isCurrentOption
                                        ? 'border-[--primary] bg-blue-50/30 ring-1 ring-[--primary]'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    id={option.id}
                                    name="shippingOption"
                                    value={option.id}
                                    checked={isCurrentOption}
                                    onChange={handleOptionChange}
                                    className='form-radio h-4 w-4 text-[--primary] focus:ring-[--primary]'
                                />
                                <span className='ml-3 text-sm font-medium text-gray-700 flex-1'>
                                    {option.label}
                                    <span className="ml-1 text-gray-500 font-normal">{priceLabel}</span>
                                </span>
                            </label>

                            {/* Handler Mondial Relay */}
                            {option.id === 'mondial_relay_pr' && isCurrentOption && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-2">
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

                            {/* Handler Colissimo Point Retrait */}
                            {option.id === 'colissimo_pr' && isCurrentOption && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                    <ColissimoHandler
                                        totalWeight={totalWeight}
                                        orderId={orderId}
                                        setShippingPrice={setShippingPrice}
                                        setSelectedPudo={setSelectedPudo}
                                        setShippingMethod={setSelectedOptionId}
                                        currentPrice={currentPrice}
                                        customerPostalCode={customerPostalCode} 
                                        customerCountryCode={customerCountryCode} 
                                        customerAddress={customerAddress}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutShipping;