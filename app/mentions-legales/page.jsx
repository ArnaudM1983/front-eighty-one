import Breadcrumbs from "@/components/ui/Breadcrumb";

export default function MentionsLegales() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Mentions Légales" }
  ];

  return (
    <div className="bg-white pb-20">
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-8 leading-none">
          Mentions <span className="text-[#01B0F0]">Légales</span>
        </h1>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          
          {/* ÉDITEUR DU SITE */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">1. Édition du site</h2>
            <p>
              Le site internet <strong>81store.fr</strong> est édité par la société 
              <strong> [NOM DE TA SOCIÉTÉ OU AUTO-ENTREPRISE]</strong>, au capital de [MONTANT] €, 
              immatriculée au Registre du Commerce et des Sociétés (RCS) de Lyon sous le numéro 
              <strong> [NUMÉRO SIRET]</strong>.
            </p>
            <ul className="list-none space-y-1">
              <li><strong>Siège social :</strong> 21 rue des Capucins, 69001 Lyon</li>
              <li><strong>Directeur de la publication :</strong> [NOM DU RESPONSABLE]</li>
              <li><strong>Contact :</strong> contact@81store.fr | 04 78 91 18 52</li>
            </ul>
          </section>

          {/* HÉBERGEMENT */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">2. Hébergement</h2>
            <p>
              Le site est hébergé par la société <strong>[NOM DE L'HÉBERGEUR, ex: Vercel / OVH]</strong>, 
              dont le siège social est situé à [ADRESSE DE L'HÉBERGEUR].
            </p>
          </section>

          {/* PROPRIÉTÉ INTELLECTUELLE */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant ce site (textes, graphismes, logos, photos, vidéos) est la propriété exclusive de 
              <strong> Eightyone Store</strong>, sauf mention contraire. Toute reproduction, représentation, modification ou 
              adaptation de tout ou partie des éléments du site est strictement interdite sans autorisation écrite préalable.
            </p>
          </section>

          {/* LIMITATION DE RESPONSABILITÉ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">4. Responsabilité</h2>
            <p>
              Eightyone Store s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, nous ne pouvons 
              garantir l'exhaustivité ou l'absence d'erreurs. Eightyone Store ne pourra être tenu responsable des dommages directs 
              ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
            </p>
          </section>

          {/* DROIT APPLICABLE */}
          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">5. Droit applicable</h2>
            <p>
              Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut d'accord amiable, 
              le tribunal de Lyon sera seul compétent.
            </p>
          </section>

          <footer className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10">
            Mise à jour le 04/02/2026
          </footer>
        </div>
      </main>
    </div>
  );
}