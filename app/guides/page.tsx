import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import { Metadata } from "next";
import GuidesList from "@/components/sections/GuidesList"; 

async function getGuides() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/guides`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export const metadata: Metadata = {
  title: "Guides & Tutos Peinture de Précision | Eightyone Store Lyon",
  description: "Apprenez à peindre comme un pro avec les guides Eightyone. Matériel technique, astuces sans coulures et alternatives économiques.",
};

export default async function GuidesPage() {
  // On récupère les données côté serveur
  const guides = await getGuides();

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Guides & Tutos" }
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <nav aria-label="Fil d'Ariane">
          <Breadcrumbs crumbs={crumbs} />
        </nav>
      </div>

      <main>
        <CategoryHero
          title="Guides d'expertise"
          description="Choisir le bon outil est la moitié du travail, savoir s'en servir est l'autre. De la préparation des supports à la gestion de la pression, l'équipe Eightyone décortique pour vous le matériel pro."
          backgroundImage="/bandeau-guides.webp"
          scrollTargetId="guidesStart"
        />

        <section id="guidesStart" className="px-8 pt-16 pb-24 bg-(--background-secondary)">
          <div className="max-w-6xl mx-auto">

            <div className="mb-12">
              <h2 className="text-3xl font-extrabold uppercase tracking-tighter">Tous nos guides</h2>
            </div>

            <GuidesList initialGuides={guides} />

          </div>
        </section>
      </main>
    </>
  );
}