import { Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {}

const Footer = (props: Props) => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo et description */}
          <div>
            <div className="text-teal-600">
              <Link href="/">
                <Image
                  src="/logo-81.png"
                  alt="Logo Eightyone Store"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </Link>
            </div>

            <p className="mt-4 max-w-xs text-sm text-gray-500 italic">
              Le shop de référence graffiti et urban wear à Lyon depuis plus de 20 ans.
            </p>

            <Link
              href="https://www.instagram.com/81store/?hl=fr"
              target="_blank"             
              rel="noopener noreferrer"    
              aria-label="Suivre Eightyone Store sur Instagram" 
              className="mt-6 inline-block"
            >
              <Instagram
                className="h-6 w-6 hover:text-(--primary) transition-colors"
                strokeWidth={1}
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Sections dynamiques basées sur la Navbar */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-5">
            <div>
              <Link href="/bombes-de-peinture" className="font-bold text-gray-900 uppercase text-xs tracking-widest">
                Bombes de peinture
              </Link>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/bombes-de-peinture/classiques" className="text-gray-600 transition hover:text-(--primary)">Classiques</Link></li>
                <li><Link href="/bombes-de-peinture/acryliques" className="text-gray-600 transition hover:text-(--primary)">Acryliques</Link></li>
                <li><Link href="/bombes-de-peinture/techniques" className="text-gray-600 transition hover:text-(--primary)">Techniques</Link></li>
                <li><Link href="/bombes-de-peinture/effets" className="text-gray-600 transition hover:text-(--primary)">Effets</Link></li>
                <li><Link href="/bombes-de-peinture/caps" className="text-gray-600 transition hover:text-(--primary)">Caps</Link></li>
                <li><Link href="/bombes-de-peinture/collector" className="text-gray-600 transition hover:text-(--primary)">Collectors</Link></li>
              </ul>
            </div>

            <div>
              <Link href="/marqueurs-et-encres" className="font-bold text-gray-900 uppercase text-xs tracking-widest">
                Marqueurs & encres
              </Link>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/marqueurs-et-encres/encres" className="text-gray-600 transition hover:text-(--primary)">Encres</Link></li>
                <li><Link href="/marqueurs-et-encres/marqueurs" className="text-gray-600 transition hover:text-(--primary)">Marqueurs</Link></li>
                <li><Link href="/marqueurs-et-encres/squeezers" className="text-gray-600 transition hover:text-(--primary)">Squeezers</Link></li>
                <li><Link href="/marqueurs-et-encres/marqueurs-squeezers-vides" className="text-gray-600 transition hover:text-(--primary)">Marqueurs & Squeezers vides</Link></li>
                <li><Link href="/marqueurs-et-encres/mines-de-rechange" className="text-gray-600 transition hover:text-(--primary)">Mines de rechange</Link></li>
                <li><Link href="/marqueurs-et-encres/posca-uni-paint" className="text-gray-600 transition hover:text-(--primary)">Posca & Uni Paint</Link></li>
              </ul>
            </div>

            <div>
              <Link href="/accessoires-equipements" className="font-bold text-gray-900 uppercase text-xs tracking-widest">
                Accessoires
              </Link>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/accessoires-equipements/protections-equipements" className="text-gray-600 transition hover:text-(--primary)">Protections & équipements</Link></li>
                <li><Link href="/accessoires-equipements/stickers-books" className="text-gray-600 transition hover:text-(--primary)">Stickers</Link></li>
                <li><Link href="/accessoires-equipements/books" className="text-gray-600 transition hover:text-(--primary)">Books</Link></li>
                <li><Link href="/guides" className="text-gray-900 font-bold transition hover:text-(--primary) pt-2 block uppercase text-[10px]">Guides & Tutos</Link></li>
              </ul>
            </div>

            <div>
              <Link href="/urban-wear" className="font-bold text-gray-900 uppercase text-xs tracking-widest">
                Urban wear
              </Link>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/urban-wear/eighty-one" className="text-gray-600 transition hover:text-(--primary)">Eighty One</Link></li>
                <li><Link href="/urban-wear/montana-cans" className="text-gray-600 transition hover:text-(--primary)">Montana Cans</Link></li>
                <li><Link href="/shop" className="text-gray-900 font-bold transition hover:text-(--primary) pt-2 block uppercase text-[10px]">Le Shop</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-900 uppercase text-xs tracking-widest">Infos Shop</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=21+Rue+des+Capucins+69001+LYON"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-black transition"
                  >
                    21 Rue des Capucins, 69001 LYON
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+33478911852"
                    className="text-gray-600 hover:text-black transition"
                  >
                    04 78 91 18 52
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:eightyone@hotmail.fr"
                    className="text-gray-600 hover:text-black transition"
                  >
                    eightyone@hotmail.fr
                  </a>
                </li>
                <li className="text-gray-500 text-xs">
                  <span className="font-bold text-gray-700">Lundi :</span> 14h-19h
                  <br />
                  <span className="font-bold text-gray-700">Mardi au Samedi :</span> 11h-19h
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pt-8 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Copyright © 2026. Eightyone Store Lyon</p>
          </div>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black">Mentions légales</Link>
            <Link href="/cgv" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black">CGV</Link>
            <Link href="/politique-de-confidentialite" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer