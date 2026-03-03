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
        backgroundImage="/bandeau-urban-wear.webp"
        scrollTargetId="subCategoriesFirst"
      />

      {/* Eighty One */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Eighty One"
        categorySlug="eighty-one"
        description="Décliné principalement autour du logo du shop, nous vous proposons des vêtements de qualité, sérigraphiés à la main dans Lyon et aux alentours. En collaboration ou non, les vêtements Eightyone sont identifiables et appréciés depuis de nombreuses années... Rejoins le club !"
        buttonLabel="Voir plus"
        buttonHref="/urban-wear/eighty-one"
      />

      {/* Montana Cans */}
      <SubCategoriesSection
        id="subCategoriesSecond"
        title="Montana Cans"
        categorySlug="montana-cans"
        description="La gamme wear de Montana propose des vêtements simples mais très qualitatifs ou des collaborations régulières avec les meilleurs artistes / graffeurs européens et mondiaux."
        buttonLabel="Voir plus"
        buttonHref="/urban-wear/montana-cans"
      />

      <InstagramFeed />
    </div>
  );
}
