import { CategoryCard } from "./CategoryCard"

const categories = [
  { name: "Bombes de peinture", href: "/bombes-de-peinture", image: "/home-spray.webp" },
  { name: "Posca & Uni Paint", href: "/marqueurs-encres/posca-uni-paint", image: "/bandeau-posca-unipaint.webp" },
  { name: "Marqueurs & squeezers", href: "/marqueurs-encres/marqueurs-squeezers", image: "/home-marker.webp" },
  { name: "Caps", href: "/bombes-de-peinture/caps", image: "/home-caps.webp" },
  { name: "Encres", href: "/marqueurs-encres/encres", image: "/bandeau-encres.webp" },
  { name: "Accessoires & équipements", href: "/accessoires-equipements", image: "/accessoires.webp" },
]

export const Categories = () => (
  <section className=" px-4 py-16 bg-(--background-secondary)">
    <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
      {categories.map((cat) => (
        <CategoryCard key={cat.name} {...cat} />
      ))}
    </div>
  </section>
)
