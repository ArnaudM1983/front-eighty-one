import { Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {}

const Footer = (props: Props) => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo et description */}
          <div>
            <div className="text-teal-600">
              <Link href="/">
                <Image
                  src="/logo-81.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </Link>
            </div>

            <Link href="https://www.instagram.com/81store/?hl=fr" target="blank">
              <div className="mt-4">
                <Instagram className="h-6 w-6 hover:text-(--primary)" strokeWidth={1} />
              </div>
            </Link>

          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-5">
            <div>
              <a href="/bombes-de-peinture">
                <p className="font-medium text-gray-900">Bombes de peinture</p>
              </a>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="/bombes-de-peinture/classiques" className="text-gray-700 transition hover:opacity-75">Classiques</a></li>
                <li><a href="/bombes-de-peinture/acryliques" className="text-gray-700 transition hover:opacity-75">Acryliques</a></li>
                <li><a href="/bombes-de-peinture/techniques" className="text-gray-700 transition hover:opacity-75">Techniques</a></li>
                <li><a href="/bombes-de-peinture/effets" className="text-gray-700 transition hover:opacity-75">Effets</a></li>
                <li><a href="/bombes-de-peinture/caps" className="text-gray-700 transition hover:opacity-75">Caps</a></li>
              </ul>
            </div>

            <div>
              <a href="/marqueurs-et-encres">
                <p className="font-medium text-gray-900">Marqueurs & encres</p>
              </a>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="/marqueurs-et-encres/encres" className="text-gray-700 transition hover:opacity-75">Encres</a></li>
                <li><a href="/marqueurs-et-encres/marqueurs" className="text-gray-700 transition hover:opacity-75">Marqueurs</a></li>
                <li><a href="/marqueurs-et-encres/squeezers" className="text-gray-700 transition hover:opacity-75">Squeezers</a></li>
                <li><a href="/marqueurs-et-encres/marqueurs-squeezers-vides" className="text-gray-700 transition hover:opacity-75">Marqueurs & Squeezers vides</a></li>
                <li><a href="/marqueurs-et-encres/mines-de-rechange" className="text-gray-700 transition hover:opacity-75">Mines de rechange</a></li>
                <li><a href="/marqueurs-et-encres/posca-uni-paint" className="text-gray-700 transition hover:opacity-75">Posca & Uni Paint</a></li>
              </ul>
            </div>

            <div>
              <a href="/accessoires-equipements">
                <p className="font-medium text-gray-900">Accessoires & équipements</p>
              </a>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="/accessoires-equipements/protections-equipements" className="text-gray-700 transition hover:opacity-75">Protections & équipements</a></li>
                <li><a href="/accessoires-equipements/stickers-books" className="text-gray-700 transition hover:opacity-75">Stickers & books</a></li>
              </ul>
            </div>

            <div>
              <a href="/urban-wear">
                <p className="font-medium text-gray-900">Urban wear</p>
              </a>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="/urban-wear/eighty-one" className="text-gray-700 transition hover:opacity-75">Eighty One</a></li>
              </ul>
            </div>

            <div>
              <a href="/">
                <p className="font-medium text-gray-900">Eighty One Store</p>
              </a>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="https://www.google.com/maps?q=21+Rue+des+Capucins+69001+LYON"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-700 hover:opacity-75 transition"
                  >
                    21 Rue des Capucins, 69001 LYON
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+33478911852"
                    className="text-gray-700 hover:opacity-75 transition"
                  >
                    04 78 91 18 52
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:eightyone@hotmail.fr"
                    className="text-gray-700 hover:opacity-75 transition"
                  >
                    eightyone@hotmail.fr
                  </a>
                </li>
                <li className="text-gray-700">
                  Lundi : 14h-19h
                  <br />
                  Mardi au Samedi : 11h-19h non stop
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <p className="text-xs text-gray-500">Copyright © 2025. Eightyone Store</p>
          </div>
          <div>
            <a href="/mentions-legales" className="text-xs text-gray-500 hover:text-black">Mentions légales -</a>
            <a href="/cgv" className="text-xs text-gray-500 hover:text-black"> CGV -</a>
            <a href="/politique-de-confidentialite" className="text-xs text-gray-500 hover:text-black"> Politiques de confidentialité</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer