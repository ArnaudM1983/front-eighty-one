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
              Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre la société 
              <strong> EIGHTYONE (Eightyone Store)</strong> et toute personne effectuant un achat sur le site. Toute commande implique 
              l'adhésion pleine et entière aux présentes CGV. Aucune condition particulière ne peut, sauf acceptation formelle écrite de notre part, prévaloir contre nos CGV.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">2. Produits et Prix</h2>
            <p>
              Les produits proposés sont ceux qui figurent dans le catalogue publié sur le site, dans la limite des stocks disponibles. 
              Les prix sont indiqués en Euros TTC hors frais de port. Eightyone Store se réserve le droit de modifier ses prix à tout moment, 
              étant toutefois entendu que le prix figurant au catalogue le jour de la validation de la commande sera le seul applicable à l’acheteur.
            </p>
            <p className="text-sm italic">Les produits demeurent la propriété de Eightyone Store jusqu’au complet paiement du prix.</p>
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
                <strong>Cartes Bancaires</strong> (via Stripe : Visa, MasterCard, CB)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#01B0F0] rounded-full"></span>
                <strong>PayPal</strong> (avec supplément éventuel de frais de gestion)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">4. Livraison</h2>
            <p>
              Les livraisons sont faites à l’adresse indiquée lors de la commande. Les risques sont transférés à l'acquéreur 
              au moment où il (ou un tiers désigné) prend physiquement possession des produits. 
            </p>
            <p className="text-sm bg-slate-50 p-4 rounded-xl border-l-4 border-[#01B0F0]">
              En cas de retard d'expédition, un mail vous sera adressé. En cas de non-réception du colis 48h après la notification d'expédition, veuillez contacter notre service client.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">5. Rétractation et Retours</h2>
            <p>
              Conformément à la loi, vous disposez d’un délai de <strong>14 jours</strong> à compter de la réception 
              de votre commande pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité, à l'exception des frais de retour.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl">
                <p className="mb-2 font-bold text-slate-800">Adresse de retour :</p>
                <address className="not-italic">
                    Eightyone Store<br/>
                    21, rue des Capucins<br/>
                    69001 LYON, France
                </address>
            </div>
            <p className="italic text-sm text-red-500">
                Attention : Les produits doivent être retournés dans leur état d'origine et complets (bombes de peinture non percutées/utilisées, accessoires intacts) permettant leur recommercialisation à l’état neuf.
            </p>
          </section>

          {/* AJOUT CRITIQUE POUR TON ACTIVITÉ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">6. Législation spécifique (Graffiti)</h2>
            <p>
              <strong>Eightyone Store n’incite pas au vandalisme</strong> et ne saurait être tenu responsable des dégradations commises avec les produits commercialisés sur le site.
            </p>
            <p className="text-sm text-slate-500">
              Nous rappelons que la destruction, la dégradation ou la détérioration d’un bien appartenant à autrui est punie par la loi (Articles 322-1 et suivants du Code pénal). Le fait de tracer des inscriptions, des signes ou des dessins, sans autorisation préalable, sur les façades, les véhicules, les voies publiques ou le mobilier urbain est strictement interdit et passible de lourdes amendes et de peines d'emprisonnement.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">7. Droit applicable et Litiges</h2>
            <p>
              Le présent contrat est soumis à la loi française. En cas de litige, le consommateur peut saisir soit l’une des juridictions territorialement compétentes en vertu du code de procédure civile, soit la juridiction du lieu où il demeurait au moment de la conclusion du contrat.
            </p>
            <p>
              Médiation : Conformément au Code de la consommation, en cas de litige non résolu à l'amiable avec le service client, le consommateur peut recourir à un service de médiation.
            </p>
          </section>

          <footer className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10">
            Dernière mise à jour — Eightyone Store Lyon
          </footer>
        </div>
      </main>
    </div>
  );
}