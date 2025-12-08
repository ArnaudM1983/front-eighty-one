import React from 'react';
import Input from '../ui/Input';

type Props = {};

const ShippingAddressForm = (props: Props) => {
    return (
        <div>
            <h2 className='mb-4'>Adresse de livraison</h2>
            <div className="grid grid-cols-6 grid-rows-5 gap-4 p-4">

                {/* Champs du formulaire */}
                <div className="col-span-6 row-span-1 mb-2">
                    <Input type="mail" name="email" label="E-mail *" required />
                </div>

                <div className="col-span-3 row-span-1 mb-2">
                    <Input type="text" name="first_name" label="Prénom *" required />
                </div>

                <div className="col-span-3 row-span-1 mb-2">
                    <Input type="text" name="last_name" label="Nom *" required />
                </div>

                <div className="col-span-6 row-span-1 mb-2">
                    <Input type="text" name="address" label="Adresse (numéro et nom de la rue) *" required />
                </div>

                <div className="col-span-2 row-span-1 mb-2">
                    <Input type="text" name="postal_code" label="Code postal *" required />
                </div>

                <div className="col-span-2 row-span-1 mb-2">
                    <Input type="text" name="city" label="Ville *" required />
                </div>

                <div className="col-span-2 row-span-1 mb-2">
                    <Input type="text" name="country" label="Pays *" required />
                </div>

                <div className="col-span-3 row-span-1 mb-2">
                    <Input type="tel" name="phone" label="Téléphone" />
                </div>

            </div>
        </div>
    );
};

export default ShippingAddressForm;
