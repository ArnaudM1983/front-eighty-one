
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Input from '../ui/Input';

export type PUDOInfo = { 
    id: string; 
    name: string; 
    address: string; 
    postalCode: string; 
    city: string; 
    country: string;
} | null;

type FormData = {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
};

type FormErrors = { [key in keyof FormData]?: string };

export type ShippingFormRef = {
    submitForm: () => Promise<boolean>;
};

export type ShippingAddressFormProps = {
    orderId: string;
    selectedPudo: PUDOInfo;
    shippingMethod: string; 
    shippingCost: number;   
};


const REGEX_POSTAL_CODE = /^[0-9A-Za-z\s-]{3,10}$/;
const REGEX_PHONE = /^[\d\s-]{5,20}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const ShippingAddressForm: React.FC<ShippingAddressFormProps> = forwardRef<ShippingFormRef, ShippingAddressFormProps>((props, ref) => {
    
    const { orderId, selectedPudo, shippingMethod, shippingCost } = props; 
    
    const [formData, setFormData] = useState<FormData>({
        email: '', firstName: '', lastName: '', address: '',
        postalCode: '', city: '', country: '', phone: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // --- Calcul pour le rendu et la validation ---
    const currentMethod = shippingMethod || ''; 
    const requiresPudo = currentMethod.includes('_pr') || currentMethod.includes('_relais');
    // ----------------------------------------------


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const nameKey = e.target.name === 'first_name' ? 'firstName' :
            e.target.name === 'last_name' ? 'lastName' :
                e.target.name === 'postal_code' ? 'postalCode' :
                    e.target.name as keyof FormData;

        setFormData(prev => ({ ...prev, [nameKey]: value }));

        if (formErrors[nameKey]) {
            setFormErrors(prev => ({ ...prev, [nameKey]: undefined }));
        }
    };

    // Fonction de validation
    const validateForm = (data: FormData): FormErrors => {
        const errors: FormErrors = {};
        const isBlank = (val: string) => val.trim() === '';

        // Valider les champs obligatoires (adresse de FACTURATION/LIVRAISON)
        if (isBlank(data.firstName)) errors.firstName = "Le prénom est obligatoire.";
        if (isBlank(data.lastName)) errors.lastName = "Le nom est obligatoire.";
        
        // Si ce n'est PAS un PUDO, l'adresse du client est obligatoire pour l'envoi.
        if (!requiresPudo && isBlank(data.address)) errors.address = "L'adresse est obligatoire.";
        
        if (isBlank(data.city)) errors.city = "La ville est obligatoire.";
        if (isBlank(data.country)) errors.country = "Le pays est obligatoire.";
        if (isBlank(data.postalCode)) errors.postalCode = "Le code postal est obligatoire.";
        if (isBlank(data.email)) errors.email = "L'e-mail est obligatoire.";

        // Valider les formats
        if (!isBlank(data.email) && !REGEX_EMAIL.test(data.email)) {
            errors.email = "Format d'e-mail invalide.";
        }
        if (!isBlank(data.postalCode) && !REGEX_POSTAL_CODE.test(data.postalCode)) {
            errors.postalCode = "Format de code postal invalide (3 à 10 caractères alphanumériques/tirets).";
        }
        if (!isBlank(data.phone) && !REGEX_PHONE.test(data.phone)) {
            errors.phone = "Format de téléphone invalide (chiffres, espaces, tirets).";
        }
        
        // Valider les longueurs 
        if (data.address.length > 255) errors.address = "L'adresse est trop longue.";

        return errors;
    };


    const submitForm = async () => {
        if (!orderId) {
            setStatus('error');
            return false;
        }

        // Validation de l'Adresse
        const validationErrors = validateForm(formData);
        
        // Validation Logique: Point Relais Requis
        if (requiresPudo && !selectedPudo) {
            alert("Veuillez sélectionner un Point Relais avant de continuer.");
            setStatus('error');
            return false;
        }
        
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setStatus('error');
            console.error("Erreur de validation client (adresse).");
            return false; 
        }

        setFormErrors({}); 
        setStatus('loading');

        const { email, ...shippingData } = formData;
        
        // Construction du Payload COMPLET pour Symfony
        const payload = {
            ...shippingData,
            
            // Champs de Commande (Order)
            shippingMethod: shippingMethod, 
            shippingCost: shippingCost.toFixed(2), 

            // Champs de Point Relais (ShippingInfo) 
            ...(selectedPudo && { 
                pudoId: selectedPudo.id,
                pudoName: selectedPudo.name,
                
                // Écraser les champs d'adresse par ceux du PUDO pour le colis (si PUDO choisi)
                address: selectedPudo.address, 
                postalCode: selectedPudo.postalCode, 
                city: selectedPudo.city, 
                country: selectedPudo.country 
            }),
            
            email: email // Toujours envoyer l'email pour le User/Facturation
        };
        
        console.log("Payload envoyé à Symfony:", payload);


        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}/shipping`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            const responseData = await res.json();

            if (!res.ok) {
                if (responseData.error && responseData.error.includes("Incohérence du prix")) {
                     alert("Erreur de sécurité: Les frais de port ont été modifiés. Veuillez recalculer le tarif.");
                } else if (responseData.details) {
                    setFormErrors(responseData.details as FormErrors);
                }
                throw new Error(responseData.error || "Erreur de sauvegarde de l'adresse.");
            }

            setStatus('success');
            return true;
        } catch (error) {
            setStatus('error');
            console.error("Erreur de soumission de l'adresse:", error);
            return false;
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm: submitForm,
    }));

    const isError = status === 'error';
    const isSuccess = status === 'success';

    // Fonction pour le rendu des champs
    const renderInput = (name: keyof FormData, label: string, type: string = 'text', colSpan: number = 6) => {
        const inputName = name === 'firstName' ? 'first_name' :
            name === 'lastName' ? 'last_name' :
                name === 'postalCode' ? 'postal_code' :
                    name;

        const error = formErrors[name];

        return (
            <div className={`col-span-${colSpan} mb-2`}>
                <Input
                    type={type}
                    name={inputName}
                    label={label}
                    required
                    value={formData[name]}
                    onChange={handleChange}
                    className={error ? 'border-red-500' : ''}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    };

    return (
        <form className='shipping-address-form'>
            <h2 className='mb-4 text-2xl font-semibold'>Adresse de livraison</h2>

            {/* Messages de statut généraux */}
            {isSuccess && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">Adresse enregistrée !</div>}
            {isError && Object.keys(formErrors).length === 0 && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">Erreur: Veuillez vérifier les champs marqués.</div>
            )}

            <div className="grid grid-cols-6 gap-4 p-4">
                {renderInput('email', 'E-mail *', 'mail', 6)}

                {renderInput('firstName', 'Prénom *', 'text', 3)}
                {renderInput('lastName', 'Nom *', 'text', 3)}

                {/* Condition: Si PUDO est requis et sélectionné, l'adresse de l'utilisateur n'est pas strictement l'adresse de livraison finale */}
                {renderInput('address', `Adresse (numéro et nom de la rue) *${requiresPudo ? " (Pour facturation)" : ""}`, 'text', 6)}

                {renderInput('postalCode', 'Code postal *', 'text', 2)}
                {renderInput('city', 'Ville *', 'text', 2)}
                {renderInput('country', 'Pays *', 'text', 2)}

                {renderInput('phone', 'Téléphone', 'tel', 3)}

                <div className="col-span-3 mb-2"></div>
            </div>
            
            {/* Rendu du Point Relais si sélectionné et requis */}
            {requiresPudo && selectedPudo && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-semibold text-sm">Livraison au point relais sélectionné :</p>
                    <p className="text-sm">{selectedPudo.name}</p>
                    <p className="text-xs">{selectedPudo.address}, {selectedPudo.postalCode} {selectedPudo.city}</p>
                </div>
            )}
        </form>
    );
});

export default ShippingAddressForm as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ShippingAddressFormProps> & React.RefAttributes<ShippingFormRef>
>;