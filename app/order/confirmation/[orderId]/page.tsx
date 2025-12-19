"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from "lucide-react";

export default function ConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params.orderId;
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const checkStatusAndClearCart = async () => {
            // 1. Récupération du statut Stripe dans l'URL
            const paymentIntentStatus = searchParams.get("redirect_status");

            if (paymentIntentStatus === "succeeded") {
                try {
                    // 2. Appel à votre API Symfony pour vider le panier en base de données
                    // Votre contrôleur supprimera les items et le cookie cart_token
                    await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/clear`, {
                        method: "DELETE",
                    });

                    // 3. Nettoyage manuel au cas où (LocalStorage / SessionStorage)
                    localStorage.removeItem('cart_token');
                    
                    setStatus("success");
                } catch (err) {
                    console.error("Erreur lors du nettoyage du panier:", err);
                    // On reste en success car le paiement est validé, même si le vidage a échoué
                    setStatus("success");
                }
            } else {
                setStatus("error");
            }
        };

        checkStatusAndClearCart();
    }, [searchParams]);

    // ÉCRAN DE CHARGEMENT
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-medium text-gray-700">Vérification de la transaction...</h2>
                <p className="text-gray-500 text-sm">Veuillez ne pas fermer cette page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            {status === "success" ? (
                /* --- CAS SUCCÈS --- */
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center transition-all">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Paiement validé !</h1>
                    
                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        Merci pour votre confiance. <br />
                        Votre commande <span className="font-bold text-black">#{orderId}</span> est confirmée et en cours de préparation.
                    </p>
                    
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-left border border-gray-100 inline-block w-full max-w-md mx-auto">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                            <ShoppingBag className="w-4 h-4" /> Prochaines étapes
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex gap-2">
                                <span className="text-green-500">●</span> Un mail de confirmation a été envoyé.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500">●</span> Vous recevrez un numéro de suivi dès l'expédition.
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/" 
                            className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            ) : (
                /* --- CAS ERREUR --- */
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
                        <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Une erreur est survenue</h1>
                    
                    <p className="text-gray-600 mt-4 text-lg">
                        Le paiement n'a pas pu être finalisé. Cela peut être dû à une annulation, un refus bancaire ou un délai d'attente dépassé.
                    </p>
                    
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <Link 
                            href={`/api/payment/stripe/create-intent/${orderId}`} // Redirige vers la page de paiement
                            className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" /> Réessayer le paiement
                        </Link>
                        <Link href="/contact" className="text-gray-400 hover:text-gray-600 text-sm underline">
                            Besoin d'aide ? Contactez notre support
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}