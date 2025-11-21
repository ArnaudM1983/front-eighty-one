import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bombes de peinture - Eightyone Store",
  description:
    "Découvrez notre large sélection de bombes de peinture pour graffiti et arts graphiques : acryliques, à solvant, vernis, apprêts et bombes à effets pour tous vos projets créatifs à Lyon.",
};

import CategoryHero from '@/components/sections/CategoryHero'
import Breadcrumbs from '@/components/ui/Breadcrumb';

type Props = {}

const Page = (props: Props) => {

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Bombes de peinture" }
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <CategoryHero
        title="Bombes de peinture"
        description="Eightyone Store propose un large choix de bombes de peinture, allant des incontournables à solvant aux bombes acryliques. Nous proposons aussi une large gamme de bombes techniques (vernis, apprêts) ainsi que des bombes à effets pour diversifier vos rendus!"
        backgroundImage="/bandeau-spray-global.webp"
      />
    </div>
  )
}

export default Page