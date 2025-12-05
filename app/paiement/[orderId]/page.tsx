"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Paiement de la commande #{orderId}</h1>
      <p>Total à payer : {order.total} €</p>

      {/* Ici tu pourras intégrer Stripe, Apple Pay, Google Pay, etc. */}
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md">
        Payer maintenant
      </button>
    </div>
  );
}
