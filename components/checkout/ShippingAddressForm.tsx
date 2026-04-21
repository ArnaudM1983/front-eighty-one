import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

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
    instructions: string;
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
        postalCode: '', city: '', country: '', phone: '', instructions: ''
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

    // La fonction validateForm reste inchangée
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
        if (isBlank(data.phone)) {
            errors.phone = "Le numéro de téléphone est obligatoire.";
        } else if (!REGEX_PHONE.test(data.phone)) {
            errors.phone = "Format de téléphone invalide (chiffres, espaces, tirets).";
        }

        // Valider les longueurs 
        if (data.address.length > 255) errors.address = "L'adresse est trop longue.";

        if (data.instructions && data.instructions.length > 1000) {
            errors.instructions = "Les instructions sont trop longues (max 1000 caractères).";
        }

        return errors;
    };


    // La fonction submitForm reste inchangée
    const submitForm = async () => {
        if (!orderId) {
            setStatus('error');
            return false;
        }

        const validationErrors = validateForm(formData);
        if (requiresPudo && !selectedPudo) {
            alert("Veuillez sélectionner un Point Relais.");
            return false;
        }

        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return false;
        }

        setStatus('loading');

        // Préparation du Payload
        const payload = {
            // Adresse du client (Facturation)
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
            instructions: formData.instructions,

            shippingMethod: shippingMethod,
            shippingCost: shippingCost.toFixed(2),

            // INFOS POINT RELAIS (On utilise les nouveaux noms de champs)
            ...(selectedPudo && {
                pudoId: selectedPudo.id,
                pudoName: selectedPudo.name,
                pudoAddress: selectedPudo.address,
                pudoPostalCode: selectedPudo.postalCode,
                pudoCity: selectedPudo.city,
                pudoCountry: selectedPudo.country
            })
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/order/${orderId}/shipping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            // ... (reste de la gestion de réponse)
            return res.ok;
        } catch (error) {
            return false;
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm: submitForm,
    }));

    const isError = status === 'error';
    const isSuccess = status === 'success';

    // Fonction pour le rendu des champs, utilisant des classes Tailwind pour la grille
    const renderInput = (name: keyof FormData, label: string, type: string = 'text', gridClasses: string) => {
        const inputName = name === 'firstName' ? 'first_name' :
            name === 'lastName' ? 'last_name' :
                name === 'postalCode' ? 'postal_code' :
                    name;

        const error = formErrors[name];

        return (
            <div className={`${gridClasses} mb-2`}>
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
            <h2 className='mb-4 text-2xl font-semibold'>Adresse de facturation</h2>

            {/* Messages de statut généraux */}
            {isSuccess && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">Adresse enregistrée !</div>}
            {isError && Object.keys(formErrors).length === 0 && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">Erreur: Veuillez vérifier les champs marqués.</div>
            )}

            {/* Conteneur principal de la grille: grid, 6 colonnes, gap-4 pour les colonnes */}
            <div className="grid grid-cols-6 gap-x-4 p-4">

                {/* Ligne 1: E-mail - Reste en col-6 */}
                {renderInput('email', 'E-mail *', 'mail', 'col-span-6')}

                {/* Ligne 2: Prénom - col-6 sur mobile, col-3 à partir de md */}
                {renderInput('firstName', 'Prénom *', 'text', 'col-span-6 md:col-span-3')}

                {/* Ligne 2: Nom - col-6 sur mobile, col-3 à partir de md */}
                {renderInput('lastName', 'Nom *', 'text', 'col-span-6 md:col-span-3')}

                {/* Ligne 3: Adresse - col-6 */}
                {renderInput('address', `Adresse *`, 'text', 'col-span-6')}

                {/* Ligne 4: Code postal, Ville, Pays - col-6 sur mobile, col-2 sur md */}
                {renderInput('postalCode', 'Code postal *', 'text', 'col-span-6 md:col-span-2')}
                {renderInput('city', 'Ville *', 'text', 'col-span-6 md:col-span-2')}
                {renderInput('country', 'Pays *', 'text', 'col-span-6 md:col-span-2')}

                {/* Ligne 5: Téléphone */}
                {renderInput('phone', 'Téléphone *', 'tel', 'col-span-6 md:col-span-3')}

                {/* Ligne 6: Instructions */}
                <div className="col-span-6 mt-2">
                    <Textarea
                        label="Instructions de livraison (optionnel)"
                        name="instructions"
                        placeholder="Code porte, étage, bâtiment..."
                        rows={3}
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        className={formErrors.instructions ? 'border-red-500' : ''}
                    />
                    <div className="flex justify-between px-1">
                        {formErrors.instructions && <p className="text-red-500 text-sm">{formErrors.instructions}</p>}
                        <p className="text-gray-400 text-xs ml-auto">
                            {formData.instructions.length} / 1000
                        </p>
                    </div>
                </div>
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