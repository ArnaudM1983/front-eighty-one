import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";

export const metadata = {
  title: "Marqueurs Graffiti, Squeezers & Encres : Posca, Uni Paint | Eightyone Store",
  description: "Large choix de marqueurs graffiti, squeezers et encres. Retrouvez les gammes Posca, Uni Paint, Montana, On The Run pour le tag et le dessin."
};

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Marqueurs & encres" }
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
          title="Marqueurs & encres"
          description="Large choix disponible, du marqueur au squeezer, qu’il soit plein ou vide, de différentes tailles et diamètres . Vous trouverez aussi les encres adaptées au remplissage, toutes testées par nos soins et approuvées pour leur résistance et leurs qualités !"
          backgroundImage="/bandeau-encres.png"
          scrollTargetId="subCategoriesFirst"
        />

      {/* Les encres */}
      <SubCategoriesSection
        id="subCategoriesFirst"
        title="Les Encres"
        categorySlug="encres"
        description="De la pratique des arts graphiques à la pratique du tag pur et dur, notre selection d’encre vous offres ce qu’il y a de meilleurs sur le marché actuel. En êtant nous même passionés, nous testons et selectionnons seulement le meilleur et le plus efficace pour vous."
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/encres"
      />


      {/* Les squeezers */}
      <SubCategoriesSection
        title="Les Squeezers"
        categorySlug="squeezers"
        description="Permettant de faire des tags ou des traçés rond et coulant, le squeezer est vite passé de l’effet de mode à un incontournable pour tout les graffeurs du monde entier."
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/squeezers"
      />

      {/* Les marqueurs */}
      <SubCategoriesSection
        title="Les Marqueurs"
        categorySlug="marqueurs"
        description="Cette selection de marqueurs déjà remplies vous permettra de traçer, écrire et plus sur tout types de surfaces, quelques soit vos besoins."
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/marqueurs"
      />

      {/* Les mines de rechange */}
      <SubCategoriesSection
        title="Les Mines de rechange"
        categorySlug="mines-de-rechange"
        description="Indispensables pour assurer une plus grande durée de vie à son marqueur ou squeezer préferé, vous trouverez ici toutes les tailles de mines de rechanges pour repartir avec un marqueur comme neuf !"
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/mines-de-rechange"
      />

      {/* Les marqueurs & squeezers vides */}
      <SubCategoriesSection
        title="Les marqueurs & squeezers vides"
        categorySlug="marqueurs-squeezers-vides"
        description="Faciles à remplir et de très bonne qualité, notre séléction de squeezers vides vous offres ce qu’il se fait de mieux sur le marché."
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/marqueurs-squeezers-vides"
      />

      {/* Les Posca & Uni Paint */}
      <SubCategoriesSection
        title="Les Posca & Uni Paint"
        categorySlug="posca-uni-paint"
        description="Faciles à remplir et de très bonne qualité, notre séléction de squeezers vides vous offres ce qu’il se fait de mieux sur le marché."
        buttonLabel="Voir plus"
        buttonHref="/marqueurs-et-encres/posca-uni-paint"
      />

      <InstagramFeed />
      </main>
    </>
  );
}
