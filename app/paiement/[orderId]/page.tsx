"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";

export default function PaiementPage() {
    const params = useParams();
    const orderId = params.orderId;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/${orderId}`);
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <p>Chargement de la commande...</p>;
    if (!order) return <p>Commande introuvable</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 mt-8">

            {/* Titre centré */}
            <h2 className="text-3xl font-bold text-center mb-10">
                Paiement
            </h2>

            {/* Contenu en 2 colonnes */}
            <div className="flex flex-col lg:flex-row gap-12">

                {/* Colonne gauche = Formulaire (2/3) */}
                <div className="w-full lg:w-2/3">
                    <ShippingAddressForm />
                </div>

                {/* Colonne droite = Résumé panier (1/3) */}
                <div className="w-full lg:w-1/3">
                    Panier
                </div>

            </div>
        </div>
    );
}
