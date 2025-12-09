import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Input from '../ui/Input';
import { useParams } from "next/navigation";

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

// Expressions régulières basiques (correspondance avec Symfony)
const REGEX_POSTAL_CODE = /^[0-9A-Za-z\s-]{3,10}$/;
const REGEX_PHONE = /^[\d\s-]{5,20}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ShippingAddressForm: React.FC = forwardRef<ShippingFormRef, {}>(({ }, ref) => {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

    const [formData, setFormData] = useState<FormData>({
        email: '', firstName: '', lastName: '', address: '',
        postalCode: '', city: '', country: '', phone: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const nameKey = e.target.name === 'first_name' ? 'firstName' :
            e.target.name === 'last_name' ? 'lastName' :
                e.target.name === 'postal_code' ? 'postalCode' :
                    e.target.name === 'city' ? 'city' :
                        e.target.name === 'country' ? 'country' :
                            e.target.name === 'phone' ? 'phone' :
                                e.target.name as keyof FormData;

        setFormData(prev => ({ ...prev, [nameKey]: value }));

        // Efface l'erreur dès que l'utilisateur commence à taper 
        if (formErrors[nameKey]) {
            setFormErrors(prev => ({ ...prev, [nameKey]: undefined }));
        }
    };

    // Fonction de validation
    const validateForm = (data: FormData): FormErrors => {
        const errors: FormErrors = {};

        const isBlank = (val: string) => val.trim() === '';

        // Valider les champs obligatoires
        if (isBlank(data.firstName)) errors.firstName = "Le prénom est obligatoire.";
        if (isBlank(data.lastName)) errors.lastName = "Le nom est obligatoire.";
        if (isBlank(data.address)) errors.address = "L'adresse est obligatoire.";
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

        // Validation CLIENT
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setStatus('error');
            console.error("Erreur de validation client.");
            return false; 
        }

        // Validation client réussie, on passe au backend
        setFormErrors({}); // Effacer toutes les erreurs
        setStatus('loading');

        const { email, ...shippingData } = formData;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}/shipping`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(shippingData),
                }
            );

            const responseData = await res.json();

            if (!res.ok) {
                // Si le backend renvoie des erreurs de validation (statut 400)
                if (responseData.details) {
                    // Mettre à jour les erreurs avec les détails du backend
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

    // Fonction utilitaire pour le rendu des champs
    const renderInput = (name: keyof FormData, label: string, type: string = 'text', colSpan: number = 6) => {
        // Déterminer le nom de l'attribut 'name' pour le rendu 
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

                {renderInput('address', 'Adresse (numéro et nom de la rue) *', 'text', 6)}

                {renderInput('postalCode', 'Code postal *', 'text', 2)}
                {renderInput('city', 'Ville *', 'text', 2)}
                {renderInput('country', 'Pays *', 'text', 2)}

                {renderInput('phone', 'Téléphone', 'tel', 3)}

                <div className="col-span-3 mb-2"></div>
            </div>
        </form>
    );
});

export default ShippingAddressForm as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<{}> & React.RefAttributes<ShippingFormRef>
>;