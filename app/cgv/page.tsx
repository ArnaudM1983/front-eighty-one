import Breadcrumbs from "@/components/ui/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente (CGV) | Eightyone Store",
  description: "Consultez les conditions générales de vente de Eightyone Store : commande, paiement, livraison et droit de rétractation.",
};

export default function CGV() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Conditions Générales de Vente" }
  ];

  return (
    <div className="bg-white pb-20">
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-8 leading-none">
          Conditions Générales <br/> de <span className="text-[#01B0F0]">Vente</span>
        </h1>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">1. Objet</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre la boutique 
              <strong> Eightyone Store</strong> et toute personne effectuant un achat sur le site. Toute commande implique 
              l'adhésion pleine et entière aux présentes CGV.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">2. Produits et Prix</h2>
            <p>
              Les produits proposés sont ceux qui figurent dans le catalogue publié sur le site, dans la limite des stocks disponibles. 
              Les prix sont indiqués en Euros TTC. Eightyone Store se réserve le droit de modifier ses prix à tout moment, 
              étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable à l’acheteur.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">3. Commande et Paiement</h2>
            <p>
              Le client valide sa commande après avoir vérifié son panier et accepté les présentes CGV. 
              Le paiement est exigible immédiatement au moment de la commande. Nous acceptons :
            </p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#01B0F0] rounded-full"></span>
                <strong>Cartes Bancaires</strong> (via Stripe)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#01B0F0] rounded-full"></span>
                <strong>PayPal</strong>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">4. Livraison</h2>
            <p>
              Les livraisons sont faites à l’adresse indiquée lors de la commande. Les risques sont à la charge de l'acquéreur 
              à compter du moment où les produits ont quitté les locaux de Eightyone Store. 
              Les délais de livraison ne sont donnés qu’à titre indicatif.
            </p>
            <p className="text-sm bg-slate-50 p-4 rounded-xl border-l-4 border-[#01B0F0]">
              Modes de livraison disponibles : <strong>Colissimo</strong> (domicile) et <strong>Mondial Relay</strong> (point retrait).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">5. Rétractation et Retours</h2>
            <p>
              Conformément à la loi, les acheteurs disposent d’un délai de <strong>14 jours ouvrables</strong> à compter de la livraison 
              de leur commande pour exercer leur droit de rétractation et retourner le produit au vendeur pour échange ou remboursement 
              sans pénalité, à l’exception des frais de retour. 
            </p>
            <p className="italic text-sm">Les produits doivent être retournés dans leur emballage d'origine et ne pas avoir été utilisés (bombes de peinture non percutées, vêtements non portés).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">6. Responsabilité</h2>
            <p>
              Le vendeur, dans le processus de vente en ligne, n’est tenu que par une obligation de moyens ; sa responsabilité 
              ne pourra être engagée pour un dommage résultant de l’utilisation du réseau Internet tel que perte de données, 
              intrusion, virus, rupture du service, ou autres problèmes involontaires.
            </p>
          </section>

          <footer className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10 border-t border-slate-100">
            Édité le 04/02/2026 — Eightyone Store Lyon
          </footer>
        </div>
      </main>
    </div>
  );
}