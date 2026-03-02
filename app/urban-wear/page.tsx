import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";

export const metadata = {
  title: "Urban Wear & Streetwear : Eighty One, Jacker | Eightyone Store",
  description: "Découvrez notre sélection Urban Wear. Retrouvez les collections Jacker et Eighty One : T-shirts, hoodies, etc.. inspirés par la culture skate et graffiti."
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
        description="Plongez dans notre univers textile. Une sélection rigoureuse de vêtements streetwear alliant confort et style, pensée pour les passionnés de glisse, d'art urbain et de culture underground."
        backgroundImage="/bandeau-encres.png"
        scrollTargetId="subCategoriesFirst"
      />

      {/* Eighty One */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Eighty One"
        categorySlug="eighty-one"
        description="Notre propre ligne de vêtements. Des basiques de qualité aux pièces plus graphiques, portez les valeurs de notre shop au quotidien."
        buttonLabel="Voir plus"
        buttonHref="/urban-wear/eighty-one"
      />

      {/* Montana Cans */}
      <SubCategoriesSection
        id="subCategoriesSecond"
        title="Montana Cans"
        categorySlug="montana-cans"
        description="Notre propre ligne de vêtements. Des basiques de qualité aux pièces plus graphiques, portez les valeurs de notre shop au quotidien."
        buttonLabel="Voir plus"
        buttonHref="/urban-wear/montana-cans"
      />

      <InstagramFeed />
    </div>
  );
}
