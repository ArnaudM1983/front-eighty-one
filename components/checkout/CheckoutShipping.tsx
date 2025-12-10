// src/components/checkout/CheckoutShipping.tsx
<<<<<<< Updated upstream

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Définition du type pour l'information du Point Relais (PUDO)
type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;

// Définition de la structure de l'option de livraison (sans prix statique)
type ShippingOption = {
    id: string; // Utilisé pour les radios (ex: 'mondial_relay_pr')
    label: string;
    modeCode: string; // Code pour le TariffCalculator (ex: 'pr', 'standard_colissimo')
    requiresPUDO: boolean; // Nécessite l'ouverture du widget
    price: number; // Prix calculé dynamiquement
};

// Liste des options de base
const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
    { id: 'pickup', label: 'Commande à venir retirer en boutique', modeCode: 'pickup', requiresPUDO: false, price: 0.00 },
    { id: 'mondial_relay_pr', label: 'Mondial Relay Point Relais', modeCode: 'pr', requiresPUDO: true, price: 0.00 },
];

type CheckoutShippingProps = {
    setShippingPrice: (price: number) => void;
    setSelectedOptionId: (method: string) => void;
    setSelectedPudo: (pudo: PUDOInfo) => void;
    totalWeight: number; // Poids total en KG (pour le calcul)
    orderId: string;
    currentPrice: number; // Prix actuel pour l'affichage
}

const CheckoutShipping = ({
    setShippingPrice,
    setSelectedOptionId,
    setSelectedPudo,
    totalWeight,
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
        if (!selectedOption || totalWeight <= 0) return;

        const calculatePrice = async () => {
            if (selectedOption.modeCode === 'pickup') {
                setShippingPrice(0);
                setSelectedOptionId(selectedId);
                return;
            }

            setLoadingPrice(true);
            try {
                // Appel à l'API Symfony pour obtenir le coût TTC
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight,
                        modeCode: selectedOption.modeCode,
                        countryCode: 'FR', // Utiliser le pays de l'adresse utilisateur à terme
                    }),
                });

                const data = await res.json();
                const newPrice = res.ok && data.shippingCost ? parseFloat(data.shippingCost) : 0;

                // 1. Mise à jour de l'état des options pour afficher le prix
                setOptions(prev => prev.map(opt =>
=======

"use client";
import React, { useState, useEffect } from 'react';
// Note: Assurez-vous que PUDOInfo est disponible (via l'import dans PaiementPage)

type PUDOInfo = { id: string, name: string, address: string, postalCode: string, city: string, country: string } | null;

type ShippingOption = {
  id: string; 
  label: string;
  modeCode: string; 
  requiresPUDO: boolean;
  price: number;
};

const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pickup', label: 'Commande à venir retirer en boutique', modeCode: 'pickup', requiresPUDO: false, price: 0.00 },
  { id: 'mondial_relay_pr', label: 'Mondial Relay Point Relais', modeCode: 'pr', requiresPUDO: true, price: 0.00 },
  { id: 'colissimo_domicile', label: 'Colissimo Domicile', modeCode: 'standard_colissimo', requiresPUDO: false, price: 0.00 }, 
  // Ajoutez 'colissimo_relais' si vous avez une API de widget pour cela
];

type CheckoutShippingProps = {
  setShippingPrice: (price: number) => void;
  setSelectedOptionId: (method: string) => void;
  setSelectedPudo: (pudo: PUDOInfo) => void; 
  totalWeight: number;
  orderId: string;
  currentPrice: number; 
}

const CheckoutShipping = ({ 
    setShippingPrice, 
    setSelectedOptionId, 
    setSelectedPudo, 
    totalWeight, 
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
        if (!selectedOption || totalWeight <= 0) return;

        const calculatePrice = async () => {
            if (selectedOption.modeCode === 'pickup') {
                setShippingPrice(0);
                setSelectedOptionId(selectedId);
                return;
            }

            setLoadingPrice(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/shipping/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalWeight: totalWeight,
                        modeCode: selectedOption.modeCode,
                        countryCode: 'FR',
                    }),
                });

                const data = await res.json();
                const newPrice = res.ok && data.shippingCost ? parseFloat(data.shippingCost) : 0;
                
                // 1. Mise à jour de l'état des options pour afficher le prix
                setOptions(prev => prev.map(opt => 
>>>>>>> Stashed changes
                    opt.id === selectedOption.id ? { ...opt, price: newPrice } : opt
                ));

                // 2. Mise à jour des états remontés au parent
                setShippingPrice(newPrice);
<<<<<<< Updated upstream
                setSelectedOptionId(selectedOption.id);

            } catch (error) {
                console.error("API Error during tariff calculation:", error);
                setShippingPrice(0);
=======
                setSelectedOptionId(selectedOption.id); 

            } catch (error) {
                console.error("API Error during tariff calculation:", error);
                setShippingPrice(0); 
>>>>>>> Stashed changes
            } finally {
                setLoadingPrice(false);
            }
        };

        calculatePrice();

<<<<<<< Updated upstream
    }, [selectedId, totalWeight, setShippingPrice, setSelectedOptionId, options]);
    // totalWeight dans les dépendances permet de recalculer si le client change le panier ou l'adresse (et donc le poids)

=======
    }, [selectedId, totalWeight, setShippingPrice, setSelectedOptionId, options]); // Ajout de 'options' aux dépendances
>>>>>>> Stashed changes

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptionId = event.target.value;
        setSelectedId(newOptionId);
<<<<<<< Updated upstream

        // Réinitialiser le PUDO si l'on quitte un mode Relais
=======
        
>>>>>>> Stashed changes
        const oldOption = options.find(opt => opt.id === selectedId);
        if (oldOption?.requiresPUDO) {
            setSelectedPudo(null);
            setLocalPudo(null);
        }
    };
<<<<<<< Updated upstream

=======
    
>>>>>>> Stashed changes
    const selectedOption = options.find(opt => opt.id === selectedId);
    const requiresPudo = selectedOption?.requiresPUDO;
    const isPudoSelected = requiresPudo && localPudo;

<<<<<<< Updated upstream
    // --- LOGIQUE DU WIDGET MONDIAL RELAY (pour le callback JQuery) ---
    const handlePudoSelection = (pudoData: any) => {
        // Cette fonction DOIT être appelée par le widget JQuery Mondial Relay
=======
    // --- LOGIQUE DU WIDGET MONDIAL RELAY ---
    const handlePudoSelection = (pudoData: any) => {
>>>>>>> Stashed changes
        const pudoInfo: PUDOInfo = {
            id: pudoData.ID,
            name: pudoData.Nom.trim(),
            address: (pudoData.Adresse1 + ' ' + pudoData.Adresse2).trim(),
            postalCode: pudoData.CP,
            city: pudoData.Ville.trim(),
            country: pudoData.Pays,
        };
<<<<<<< Updated upstream

        setLocalPudo(pudoInfo);
        setSelectedPudo(pudoInfo);
    };

    // Exposer la fonction handlePudoSelection globalement (pour que le script JQuery externe puisse y accéder)
    useEffect(() => {
        (window as any).handlePudoSelection = handlePudoSelection;

        // Nettoyage
=======
        
        setLocalPudo(pudoInfo); 
        setSelectedPudo(pudoInfo); 
    };

    // Exposer la fonction handlePudoSelection globalement pour le script JQuery
    useEffect(() => {
        (window as any).handlePudoSelection = handlePudoSelection;
>>>>>>> Stashed changes
        return () => {
            delete (window as any).handlePudoSelection;
        };
    }, []);
<<<<<<< Updated upstream
    // ------------------------------------------------------------------
=======
>>>>>>> Stashed changes

    // --- RENDU ---
    return (
        <div className='checkout-shipping mt-8'>
            <p className='font-semibold mb-4'>Options de livraison</p>
<<<<<<< Updated upstream

            <div className='space-y-3'>
                {options.map((option) => (
                    <label
                        key={option.id}
                        htmlFor={option.id}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${selectedId === option.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
=======
            
            <div className='space-y-3'>
                {options.map((option) => (
                    <label 
                        key={option.id} 
                        htmlFor={option.id} 
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedId === option.id 
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                            {option.label}
=======
                            {option.label} 
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

                    {/* Conteneur pour le widget Mondial Relay */}
                    <div id="Zone_Widget" className="mt-2 h-96 border border-gray-300">
                        <p className="text-gray-400 text-center pt-8">Chargement du widget de sélection de point relais...</p>
=======
                    
                    {/* Conteneur pour le widget Mondial Relay */}
                    <div id="Zone_Widget" className="mt-2 h-96 border border-gray-300">
                         {/* Ceci est l'emplacement où le script externe doit injecter la carte */}
                         <p className="text-gray-400 text-center pt-8">Chargement du widget de sélection de point relais...</p>
>>>>>>> Stashed changes
                    </div>

                </div>
            )}

            {/* Affichage du prix de l'option sélectionnée */}
            {selectedOption && (
                <p className="mt-4 text-sm text-right text-gray-600">
<<<<<<< Updated upstream
                    Frais de port :
=======
                    Frais de port : 
>>>>>>> Stashed changes
                    <span className="font-semibold ml-1">
                        {currentPrice.toFixed(2)} €
                    </span>
                </p>
            )}
        </div>
    );
};

export default CheckoutShipping;