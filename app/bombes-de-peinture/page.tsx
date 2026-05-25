import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  // 1. TITRE : Mots-clés importants + Nom de marque
  title: "Bombes de Peinture Graffiti & Déco au Meilleur Prix | Eightyone Store Lyon",
  
  // 2. DESCRIPTION : ~150-160 caractères. 
  description: "Large choix de bombes de peinture : Montana Black, Double-A et NBQ au meilleur prix. Matériel graffiti, beaux-arts et déco. Livraison 24/48h ou retrait shop à Lyon !",
  
};

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Bombes de peinture & pots" }
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
          title="Bombes de peinture & Pots"
          description="Eightyone Store propose un large choix de bombes de peinture, allant des incontournables à solvant aux bombes acryliques. Nous proposons aussi une large gamme de bombes techniques (vernis, apprêts), des bombes à effets pour diversifier vos rendus, des bombes collector et des pots de peinture !"
          backgroundImage="/bandeau-spray-global.webp"
          scrollTargetId="subCategoriesFirst"
        />

      {/* Bombes classiques */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Les Classiques"
        categorySlug="classiques"
        description="Référence du milieu graffiti, nos bombes de peinture classiques au solvant offrent un choix de couleurs inégalé. Que ce soit pour une utilisation artistique, du bricolage ou de la décoration, ces sprays haute pression garantissent un fort pouvoir couvrant sur tous supports (métal, béton, bois)."
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
        description="Préparez vos supports et protégez vos créations avec nos bombes de peinture techniques. Que vous cherchiez un vernis mat ou brillant pour fixer vos couleurs, un apprêt (primer) pour une meilleure adhérence, ou de l'acétone pour nettoyer vos caps, Eightyone Store a sélectionné le meilleur du matériel pro."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/techniques"
      />

      {/* Bombes effets */}
      <SubCategoriesSection
        title="Les Effets"
        categorySlug="effets"
        description="Les gammes Effets offrent des rendus originaux et novateurs dans la pratique des arts graphiques (effets chromes, métallisés, pailletés ou phosphorescents)."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/effets"
      />

      {/* Caps */}
      <SubCategoriesSection
        title="Les Caps"
        categorySlug="caps"
        description="Du Skinny cap pour les détails fins au Fat cap pour les lignes larges, le choix de vos diffuseurs est capital pour obtenir une plus grande précision d’exécution."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/caps"
      />

      {/* Pots de peinture */}
      <SubCategoriesSection
        title="Les Pots de peinture"
        categorySlug="pots-de-peinture"
        description="Conçus par et pour les artistes urbains, découvrez nos pots de peinture au latex haute viscosité. Idéaux pour réaliser des fonds de fresques et blockbusters massifs au rouleau, ces pots offrent un pouvoir opacifiant extrême pour bloquer les murs et préparer vos supports avant le passage des bombes."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/pots-de-peinture"
      />

      {/* Collector */}
      <SubCategoriesSection
        title="Les Collectors - Editions limitées"
        categorySlug="collector-editions-limitees"
        description="Découvrez nos séries limitées et collaborations exclusives. Véritables objets de collection, ces bombes célèbrent l'art urbain à travers des designs uniques créés par des artistes de renommée internationale."
        buttonLabel="Voir plus"
        buttonHref="/bombes-de-peinture/collector"
      />

      <InstagramFeed />
      </main>
    </>
  );
}
