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
    // Infos livraison
    email: string;
    company: string; // <-- NOUVEAU
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    instructions: string;
    
    // Toggle facturation
    isBillingDifferent: boolean;
    
    // Infos facturation
    billingCompany: string; // <-- NOUVEAU
    billingFirstName: string;
    billingLastName: string;
    billingAddress: string;
    billingPostalCode: string;
    billingCity: string;
    billingCountry: string;
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
        email: '', company: '', firstName: '', lastName: '', address: '',
        postalCode: '', city: '', country: '', phone: '', instructions: '',
        isBillingDifferent: false,
        billingCompany: '', billingFirstName: '', billingLastName: '', billingAddress: '',
        billingPostalCode: '', billingCity: '', billingCountry: 'FR'
    });
    
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const currentMethod = shippingMethod || '';
    const requiresPudo = currentMethod.includes('_pr') || currentMethod.includes('_relais');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        const nameKey = name === 'first_name' ? 'firstName' :
            name === 'last_name' ? 'lastName' :
            name === 'postal_code' ? 'postalCode' :
            name === 'billing_first_name' ? 'billingFirstName' :
            name === 'billing_last_name' ? 'billingLastName' :
            name === 'billing_postal_code' ? 'billingPostalCode' :
            name === 'billing_company' ? 'billingCompany' :
            name as keyof FormData;

        setFormData(prev => ({ ...prev, [nameKey]: value }));

        if (formErrors[nameKey]) {
            setFormErrors(prev => ({ ...prev, [nameKey]: undefined }));
        }
    };

    const validateForm = (data: FormData): FormErrors => {
        const errors: FormErrors = {};
        const isBlank = (val: string) => val === undefined || val.trim() === '';

        // --- VALIDATION LIVRAISON / CONTACT ---
        if (isBlank(data.firstName)) errors.firstName = "Le prénom est obligatoire.";
        if (isBlank(data.lastName)) errors.lastName = "Le nom est obligatoire.";
        if (!requiresPudo && isBlank(data.address)) errors.address = "L'adresse est obligatoire.";
        if (isBlank(data.city)) errors.city = "La ville est obligatoire.";
        if (isBlank(data.country)) errors.country = "Le pays est obligatoire.";
        if (isBlank(data.postalCode)) errors.postalCode = "Le code postal est obligatoire.";
        if (isBlank(data.email)) errors.email = "L'e-mail est obligatoire.";

        if (!isBlank(data.email) && !REGEX_EMAIL.test(data.email)) {
            errors.email = "Format d'e-mail invalide.";
        }
        if (!isBlank(data.postalCode) && !REGEX_POSTAL_CODE.test(data.postalCode)) {
            errors.postalCode = "Format de code postal invalide.";
        }
        if (isBlank(data.phone)) {
            errors.phone = "Le numéro de téléphone est obligatoire.";
        } else if (!REGEX_PHONE.test(data.phone)) {
            errors.phone = "Format de téléphone invalide.";
        }

        if (data.address.length > 255) errors.address = "L'adresse est trop longue.";
        if (data.company && data.company.length > 255) errors.company = "Le nom de l'entreprise est trop long.";
        if (data.instructions && data.instructions.length > 1000) {
            errors.instructions = "Les instructions sont trop longues (max 1000 caractères).";
        }

        // --- VALIDATION FACTURATION ---
        if (data.isBillingDifferent) {
            if (isBlank(data.billingFirstName)) errors.billingFirstName = "Le prénom de facturation est obligatoire.";
            if (isBlank(data.billingLastName)) errors.billingLastName = "Le nom de facturation est obligatoire.";
            if (isBlank(data.billingAddress)) errors.billingAddress = "L'adresse de facturation est obligatoire.";
            if (isBlank(data.billingCity)) errors.billingCity = "La ville de facturation est obligatoire.";
            if (isBlank(data.billingCountry)) errors.billingCountry = "Le pays de facturation est obligatoire.";
            if (isBlank(data.billingPostalCode)) errors.billingPostalCode = "Le code postal de facturation est obligatoire.";
            
            if (!isBlank(data.billingPostalCode) && !REGEX_POSTAL_CODE.test(data.billingPostalCode)) {
                errors.billingPostalCode = "Format de code postal invalide.";
            }
            if (data.billingCompany && data.billingCompany.length > 255) errors.billingCompany = "Le nom de l'entreprise est trop long.";
        }

        return errors;
    };

    const submitForm = async () => {
        if (!orderId) return false;

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

        const payload = {
            // Infos Contact / Livraison
            email: formData.email,
            company: formData.company, // <-- NOUVEAU
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country,
            phone: formData.phone,
            instructions: formData.instructions,

            shippingMethod: shippingMethod,
            shippingCost: shippingCost.toFixed(2),

            // Infos Facturation
            billingCompany: formData.isBillingDifferent ? formData.billingCompany : formData.company, // <-- NOUVEAU
            billingFirstName: formData.isBillingDifferent ? formData.billingFirstName : formData.firstName,
            billingLastName: formData.isBillingDifferent ? formData.billingLastName : formData.lastName,
            billingAddress: formData.isBillingDifferent ? formData.billingAddress : formData.address,
            billingPostalCode: formData.isBillingDifferent ? formData.billingPostalCode : formData.postalCode,
            billingCity: formData.isBillingDifferent ? formData.billingCity : formData.city,
            billingCountry: formData.isBillingDifferent ? formData.billingCountry : formData.country,

            // PUDO
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
            
            if(res.ok) {
                setStatus('success');
                return true;
            } else {
                setStatus('error');
                return false;
            }
        } catch (error) {
            setStatus('error');
            return false;
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm: submitForm,
    }));

    // Ajout de isRequired = true par défaut
    const renderInput = (name: keyof FormData, label: string, type: string = 'text', gridClasses: string, isRequired: boolean = true) => {
        const inputName = name === 'firstName' ? 'first_name' :
            name === 'lastName' ? 'last_name' :
            name === 'postalCode' ? 'postal_code' :
            name === 'billingFirstName' ? 'billing_first_name' :
            name === 'billingLastName' ? 'billing_last_name' :
            name === 'billingPostalCode' ? 'billing_postal_code' :
            name === 'billingCompany' ? 'billing_company' :
            name;

        const error = formErrors[name];

        return (
            <div className={`${gridClasses} mb-2`}>
                <Input
                    type={type}
                    name={inputName}
                    label={label}
                    required={isRequired} // Utilisation du paramètre dynamique
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={error ? 'border-red-500' : ''}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    };

    return (
        <form className='shipping-address-form'>
            {status === 'success' && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">Adresse enregistrée !</div>}
            {status === 'error' && Object.keys(formErrors).length === 0 && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">Erreur lors de la sauvegarde.</div>
            )}

            {/* --- SECTION LIVRAISON --- */}
            <h2 className='mb-4 text-2xl font-semibold'>Informations de livraison / retrait</h2>
            
            <div className="grid grid-cols-6 gap-x-4 p-4 bg-gray-50 rounded-md">
                {renderInput('email', 'E-mail *', 'email', 'col-span-6')}
                {/* NOUVEAU CHAMP ENTREPRISE (non requis) */}
                {renderInput('company', 'Entreprise (Optionnel)', 'text', 'col-span-6', false)}
                {renderInput('firstName', 'Prénom *', 'text', 'col-span-6 md:col-span-3')}
                {renderInput('lastName', 'Nom *', 'text', 'col-span-6 md:col-span-3')}
                {renderInput('address', `Adresse *`, 'text', 'col-span-6')}
                {renderInput('postalCode', 'Code postal *', 'text', 'col-span-6 md:col-span-2')}
                {renderInput('city', 'Ville *', 'text', 'col-span-6 md:col-span-2')}
                {renderInput('country', 'Pays *', 'text', 'col-span-6 md:col-span-2')}
                {renderInput('phone', 'Téléphone *', 'tel', 'col-span-6 md:col-span-3')}
                
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
                    {formErrors.instructions && <p className="text-red-500 text-sm">{formErrors.instructions}</p>}
                </div>
            </div>

            {requiresPudo && selectedPudo && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-semibold text-sm">Livraison au point relais sélectionné :</p>
                    <p className="text-sm">{selectedPudo.name}</p>
                    <p className="text-xs">{selectedPudo.address}, {selectedPudo.postalCode} {selectedPudo.city}</p>
                </div>
            )}

            {/* --- TOGGLE FACTURATION --- */}
            <div className="mt-8 mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="isBillingDifferent"
                    name="isBillingDifferent"
                    checked={formData.isBillingDifferent}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2 cursor-pointer"
                />
                <label htmlFor="isBillingDifferent" className="font-medium text-gray-700 cursor-pointer">
                    Utiliser une adresse de facturation différente
                </label>
            </div>

            {/* --- SECTION FACTURATION --- */}
            {formData.isBillingDifferent && (
                <div className="grid grid-cols-6 gap-x-4 p-4 border border-gray-200 rounded-md bg-white">
                    <h3 className="col-span-6 mb-3 text-lg font-medium text-gray-800">Adresse de facturation</h3>
                    {/* NOUVEAU CHAMP ENTREPRISE FACTURATION (non requis) */}
                    {renderInput('billingCompany', 'Entreprise (Optionnel)', 'text', 'col-span-6', false)}
                    {renderInput('billingFirstName', 'Prénom de facturation *', 'text', 'col-span-6 md:col-span-3')}
                    {renderInput('billingLastName', 'Nom de facturation *', 'text', 'col-span-6 md:col-span-3')}
                    {renderInput('billingAddress', `Adresse *`, 'text', 'col-span-6')}
                    {renderInput('billingPostalCode', 'Code postal *', 'text', 'col-span-6 md:col-span-2')}
                    {renderInput('billingCity', 'Ville *', 'text', 'col-span-6 md:col-span-2')}
                    {renderInput('billingCountry', 'Pays *', 'text', 'col-span-6 md:col-span-2')}
                </div>
            )}

        </form>
    );
});

export default ShippingAddressForm as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ShippingAddressFormProps> & React.RefAttributes<ShippingFormRef>
>;