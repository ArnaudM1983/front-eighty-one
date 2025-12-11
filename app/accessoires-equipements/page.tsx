import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";

export const metadata = {
  title: "Accessoires & équipements - Eightyone Store",
  description: "Découvrez notre large sélection d'accessoires et d'équipements'"
};

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Accessoires & équipements" }
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <CategoryHero
        title="Accessoires & équipements"
        description="Des outils complémentaires et parfois indispensables à la bonne pratique de votre passion."
        backgroundImage="/accessoires.webp"
        scrollTargetId="subCategoriesFirst"
      />

      {/* Protections & équipements */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Protections & équipements"
        categorySlug="protections-equipements"
        description="De la pratique des arts graphiques à la pratique du tag pur et dur, notre selection d’encre vous offres ce qu’il y a de meilleurs sur le marché actuel. En êtant nous même passionés, nous testons et selectionnons seulement le meilleur et le plus efficace pour vous."
        buttonLabel="Voir plus"
        buttonHref="/protections-equipements"
      />

      {/* Stickers & books */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Stickers & book"
        categorySlug="stickers-book"
        description="Idéal pour gagner en visibilité, les stickers vous offrent un support adapté et durable pour l’utilisation des marqueurs. Les carnets, quant à eux, sont des indispensables, aussi bien pour l’entraînement (sketching) que pour récolter des dessins et œuvres de vos artistes préférés au fil des rencontres."
        buttonLabel="Voir plus"
        buttonHref="/stickers-book"
      />

      <InstagramFeed />
    </div>
  );
}
