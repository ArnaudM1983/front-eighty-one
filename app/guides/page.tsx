import { GUIDES } from '@/data/guides';
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import GuideCard from "@/components/ui/GuideCard"; // Import du nouveau composant
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & Tutos Peinture de Précision | Eightyone Store Lyon",
  description: "Apprenez à peindre comme un pro avec les guides Eightyone.",
};

export default async function GuidesPage() {
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
          title="Guides d'Expertise"
          description="Bienvenue dans le Lab Eightyone. On vous livre nos secrets de pros."
          backgroundImage="/bandeau-guides-expertise.webp" 
          scrollTargetId="guidesStart"
        />

        <section id="guidesStart" className="px-8 pt-16 pb-24 bg-(--background-secondary)">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold uppercase tracking-tighter">Tous nos guides</h2>
            </div>

            {/* Liste */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {GUIDES.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}