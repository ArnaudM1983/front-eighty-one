import React, { useState, useEffect } from 'react';

// Définition du type pour une option de livraison
type ShippingOption = {
  id: string;
  label: string;
  price: number; // Stockage du prix
};

// Liste des options de livraison
const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pickup', label: 'Commande à venir retirer en boutique (Gratuit)', price: 0.00 },
  { id: 'mondial_relay', label: 'Mondial Relay (5.90 €)', price: 5.90 },
  { id: 'colissimo_standard', label: 'Colissimo sans signature (7.50 €)', price: 7.50 },
  { id: 'colissimo_relais', label: 'Colissimo relais (6.90 €)', price: 6.90 },
];

// Définition des Props pour remonter le prix de la livraison au parent
type CheckoutShippingProps = {
  setShippingPrice: (price: number) => void;
}

const CheckoutShipping = ({ setShippingPrice }: CheckoutShippingProps) => {
  const defaultOption = SHIPPING_OPTIONS[0];
  // État local pour stocker l'ID de l'option de livraison sélectionnée
  const [selectedOptionId, setSelectedOptionId] = useState<string>(defaultOption.id);

  // Mettre à jour l'état des frais de port dans le composant parent
  useEffect(() => {
    const selected = SHIPPING_OPTIONS.find(opt => opt.id === selectedOptionId);
    if (selected) {
      setShippingPrice(selected.price);
    }
  }, [selectedOptionId, setShippingPrice]); // Se déclenche quand l'option change ou à l'initialisation

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionId(event.target.value);
  };
  
  const selectedOption = SHIPPING_OPTIONS.find(opt => opt.id === selectedOptionId);

  return (
    <div className='checkout-shipping mt-8'>
      <p className='font-semibold mb-4'>Options de livraison</p>
      
      <div className='space-y-3'>
        {SHIPPING_OPTIONS.map((option) => (
          <label 
            key={option.id} 
            htmlFor={option.id} 
            className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOptionId === option.id 
                ? 'border-blue-500 bg-blue-50' // Style pour sélectionné
                : 'border-gray-200 hover:border-gray-400' // Style par défaut
            }`}
          >
            <input
              type="radio"
              id={option.id}
              name="shippingOption"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={handleOptionChange}
              className='form-radio h-4 w-4 text-blue-500 focus:ring-blue-500' // Simuler le style Tailwind pour radio
            />
            <span className='ml-3 text-sm font-medium text-gray-700 flex-1'>
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {/* Affichage du prix de l'option sélectionnée */}
      {selectedOption && (
        <p className="mt-4 text-sm text-right text-gray-600">
            Frais de port : 
            <span className="font-semibold ml-1">
                {selectedOption.price.toFixed(2)} €
            </span>
        </p>
      )}
    </div>
  );
};

export default CheckoutShipping;