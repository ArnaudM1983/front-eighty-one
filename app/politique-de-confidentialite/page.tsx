import Breadcrumbs from "@/components/ui/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Eightyone Store",
  description: "Découvrez comment Eightyone Store protège vos données personnelles et respecte votre vie privée (RGPD).",
};

export default function PrivacyPolicy() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Politique de confidentialité" }
  ];

  return (
    <div className="bg-white pb-20">
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-8 leading-none">
          Politique de <span className="text-[#01B0F0]">Confidentialité</span>
        </h1>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">1. Préambule</h2>
            <p>
              La présente politique de confidentialité a pour but d'exposer aux utilisateurs du site <strong>Eightyone Store</strong> la manière dont sont collectées et traitées leurs données à caractère personnel.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">2. Données collectées</h2>
            <p>Dans le cadre de votre commande, nous collectons :</p>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Informations de commande :</strong> Nom, prénom, adresse de livraison et de facturation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Contact :</strong> Adresse e-mail et numéro de téléphone pour le suivi de livraison.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Paiement :</strong> Vos données bancaires sont traitées exclusivement par nos prestataires Stripe ou PayPal. Nous n'y avons jamais accès.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">3. Finalité du traitement</h2>
            <p>
              Le traitement de ces données est nécessaire pour la gestion de vos achats, la livraison de vos produits via nos transporteurs (Mondial Relay, Colissimo) et la gestion de notre service après-vente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">4. Conservation et Sécurité</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire à la gestion de la relation commerciale. Elles sont stockées sur des serveurs sécurisés pour empêcher tout accès non autorisé.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">5. Vos Droits (RGPD)</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez-nous à l'adresse : 
              <strong className="text-slate-900 ml-1">contact@81store.fr</strong>
            </p>
          </section>

          <footer className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10">
            Dernière mise à jour : 04/02/2026
          </footer>
        </div>
      </main>
    </div>
  );
}