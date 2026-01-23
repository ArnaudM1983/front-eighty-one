"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag, Store, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params.orderId;
    const { clearCart } = useCart();
    
    // Ajout d'un état pour distinguer le mode de paiement
    const [status, setStatus] = useState<"loading" | "success" | "cod_success" | "error">("loading");

    useEffect(() => {
        const handleOrderFinalization = async () => {
            const paymentIntentStatus = searchParams.get("redirect_status");
            const isCOD = searchParams.get("payment") === "cod";

            // CAS 1 : Paiement en boutique (COD)
            if (isCOD) {
                await finalizeOrderClearing();
                setStatus("cod_success");
                return;
            }

            // CAS 2 : Succès Stripe
            if (paymentIntentStatus === "succeeded") {
                await finalizeOrderClearing();
                setStatus("success");
            } else {
                setStatus("error");
            }
        };

        const finalizeOrderClearing = async () => {
            try {
                // Nettoyage BDD (via Cookie)
                await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/clear`, {
                    method: "DELETE",
                    credentials: "include",
                });
                // Nettoyage Local
                localStorage.removeItem('cart_token');
                clearCart();
            } catch (err) {
                console.error("Erreur lors du nettoyage du panier:", err);
            }
        };

        handleOrderFinalization();
    }, [searchParams, clearCart]);

    // ÉCRAN DE CHARGEMENT
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="h-12 w-12 animate-spin text-(--primary) mb-4" />
                <h2 className="text-xl font-medium text-gray-700">Finalisation de votre commande...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            
            {/* --- CAS 1 : SUCCÈS STRIPE (Paiement validé) --- */}
            {status === "success" && (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Paiement validé !</h1>
                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        Merci pour votre confiance. <br />
                        Votre commande <span className="font-bold text-black">#{orderId}</span> est confirmée.
                    </p>
                    <SuccessSteps type="stripe" />
                    <HomeButton />
                </div>
            )}

            {/* --- CAS 2 : SUCCÈS PAIEMENT EN BOUTIQUE (Retrait) --- */}
            {status === "cod_success" && (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                        <Store className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Commande enregistrée !</h1>
                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        Votre demande de retrait pour la commande <span className="font-bold text-black">#{orderId}</span> a bien été prise en compte.
                    </p>
                    <SuccessSteps type="cod" />
                    <HomeButton />
                </div>
            )}

            {/* --- CAS 3 : ERREUR --- */}
            {status === "error" && (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
                        <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Une erreur est survenue</h1>
                    <p className="text-gray-600 mt-4 text-lg">Le paiement n'a pas pu être finalisé.</p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <Link href={`/order/payment/${orderId}`} className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" /> Réessayer le paiement
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sous-composant pour les étapes suivantes
function SuccessSteps({ type }: { type: "stripe" | "cod" }) {
    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-left border border-gray-100 inline-block w-full max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4" /> Prochaines étapes
            </h3>
            <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex gap-3">
                    <Mail className="w-4 h-4 text-green-500 shrink-0" />
                    Un mail de confirmation vient de vous être envoyé.
                </li>
                {type === "stripe" ? (
                    <li className="flex gap-3 font-medium text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        Vous recevrez une notification dès que votre colis sera expédié.
                    </li>
                ) : (
                    <li className="flex gap-3 font-medium text-blue-800">
                        <Store className="w-4 h-4 text-blue-500 shrink-0" />
                        Votre commande est mise de côté. Merci de préparer votre règlement pour le retrait en boutique.
                    </li>
                )}
            </ul>
        </div>
    );
}

function HomeButton() {
    return (
        <div className="mt-10 flex justify-center">
            <Link href="/" className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all w-full sm:w-auto">
                Continuer mes achats
            </Link>
        </div>
    );
}