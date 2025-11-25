import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";

export const metadata = {
  title: "Urban Wear - Eightyone Store",
  description: "Découvrez notre large sélection de vêtements"
};

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Urban Wear" }
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <CategoryHero
        title="Urban Wear"
        description="Large choix disponible, du marqueur au squeezer, qu’il soit plein ou vide, de différentes tailles et diamètres . Vous trouverez aussi les encres adaptées au remplissage, toutes testées par nos soins et approuvées pour leur résistance et leurs qualités !"
        backgroundImage="/bandeau-encres.png"
        scrollTargetId="subCategoriesFirst"
      />

      {/* Eighty One */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Eighty One"
        categorySlug="streetwear"
        description="De la pratique des arts graphiques à la pratique du tag pur et dur, notre selection d’encre vous offres ce qu’il y a de meilleurs sur le marché actuel. En êtant nous même passionés, nous testons et selectionnons seulement le meilleur et le plus efficace pour vous."
        buttonLabel="Voir plus"
        buttonHref="/streetwear"
      />

      <InstagramFeed />
    </div>
  );
}
