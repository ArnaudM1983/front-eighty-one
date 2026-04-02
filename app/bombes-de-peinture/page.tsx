import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  // 1. TITRE : Mots-clés importants + Nom de marque
  title: "Bombes de peinture & Spray Graffiti | Eightyone Store",
  
  // 2. DESCRIPTION : ~150-160 caractères. 
  description: "Achetez vos bombes de peinture en ligne. Large choix de sprays acryliques, solvantés, techniques et caps pour le graffiti et les beaux-arts. Livraison rapide.",
  
};

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Bombes de peinture" }
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto pt-8 px-6">
        {/* Utilisation de la balise <nav> avec aria-label pour l'accessibilité du fil d'Ariane */}
        <nav aria-label="Fil d'Ariane">
          <Breadcrumbs crumbs={crumbs} />
        </nav>
      </div>

      <main>
        <CategoryHero
          title="Bombes de peinture"
          description="Eightyone Store propose un large choix de bombes de peinture, allant des incontournables à solvant aux bombes acryliques. Nous proposons aussi une large gamme de bombes techniques (vernis, apprêts) ainsi que des bombes à effets pour diversifier vos rendus!"
          backgroundImage="/bandeau-spray-global.webp"
          scrollTargetId="subCategoriesFirst"
        />

      {/* Bombes classiques */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Les Classiques"
        categorySlug="classiques"
        description="Bombes de peinture originales, les classiques sont des sprays au solvant offrant un très large choix de couleurs. Proposant un fort pouvoir couvrant et une grande durabilité, elles sont idéales pour les applications extérieures/intérieures sur tout types de surfaces."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/classiques"
      />


      {/* Bombes acryliques */}
      <SubCategoriesSection
        title="Les Acryliques"
        categorySlug="acryliques"
        description="Bombes de peinture sans solvant et à base d’eau, les bombes de peinture acryliques sont idéales pour un usage intérieur ou ludique, du fait de son absence d’odeur. Sa couvrance et sa résistance sont équivalentes aux bombes de peinture classiques !"
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/acryliques"
      />

      {/* Bombes techniques */}
      <SubCategoriesSection
        title="Les Techniques"
        categorySlug="techniques"
        description="Indispensable pour la finition ou la préparation, les bombes techniques offrent une qualité de travail incomparable et un rendu optimal."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/techniques"
      />

      {/* Bombes effets */}
      <SubCategoriesSection
        title="Les Effets"
        categorySlug="effets"
        description="Les gammes Effets offrent des rendus originaux et novateurs dans la pratique des arts graphiques."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/effets"
      />

      {/* Caps */}
      <SubCategoriesSection
        title="Les Caps"
        categorySlug="caps"
        description="Des plus petits aux plus diffus, le choix des caps est important dans la technique,  et vous aidera à obtenir une plus grande précision d’exécution."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/caps"
      />

      {/* Collector */}
      <SubCategoriesSection
        title="Les Collectors - Editions limitées"
        categorySlug="collector-editions-limitees"
        description="Des plus petits aux plus diffus, le choix des caps est important dans la technique,  et vous aidera à obtenir une plus grande précision d’exécution."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/collector"
      />

      <InstagramFeed />
      </main>
    </>
  );
}
