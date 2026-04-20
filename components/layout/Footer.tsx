import { Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {}

const Footer = (props: Props) => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        
        {/* Grille principale */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src="/logo-81-nb.png"
                alt="Logo Eightyone Store"
                width={60} 
                height={60}
                className="object-contain"
              />
            </Link>

            <p className="mt-4 max-w-[200px] text-[13px] leading-relaxed text-gray-500 italic">
              Le shop de référence graffiti et urban wear à Lyon depuis plus de 20 ans.
            </p>

            <Link
              href="https://www.instagram.com/81store/?hl=fr"
              target="_blank"             
              rel="noopener noreferrer"    
              aria-label="Suivre Eightyone Store sur Instagram" 
              className="mt-4 inline-block text-gray-400 hover:text-(--primary) transition-colors"
            >
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Sections de navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-6">
            
            {/* 1. Bombes de peinture */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Bombes</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/bombes-de-peinture/classiques" className="text-gray-600 transition hover:text-(--primary)">Classiques</Link></li>
                <li><Link href="/bombes-de-peinture/acryliques" className="text-gray-600 transition hover:text-(--primary)">Acryliques</Link></li>
                <li><Link href="/bombes-de-peinture/techniques" className="text-gray-600 transition hover:text-(--primary)">Techniques</Link></li>
                <li><Link href="/bombes-de-peinture/effets" className="text-gray-600 transition hover:text-(--primary)">Effets</Link></li>
                <li><Link href="/bombes-de-peinture/collector" className="text-gray-600 transition hover:text-(--primary)">Collectors</Link></li>
              </ul>
            </div>

            {/* 2. Marqueurs & encres */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Marqueurs</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/marqueurs-et-encres/encres" className="text-gray-600 transition hover:text-(--primary)">Encres</Link></li>
                <li><Link href="/marqueurs-et-encres/marqueurs" className="text-gray-600 transition hover:text-(--primary)">Marqueurs</Link></li>
                <li><Link href="/marqueurs-et-encres/squeezers" className="text-gray-600 transition hover:text-(--primary)">Squeezers</Link></li>
                <li><Link href="/marqueurs-et-encres/posca-uni-paint" className="text-gray-600 transition hover:text-(--primary)">Posca</Link></li>
              </ul>
            </div>

            {/* 3. Accessoires */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Accessoires</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/accessoires-equipements/protections-equipements" className="text-gray-600 transition hover:text-(--primary)">Protections</Link></li>
                <li><Link href="/accessoires-equipements/stickers-books" className="text-gray-600 transition hover:text-(--primary)">Stickers</Link></li>
                <li><Link href="/accessoires-equipements/books" className="text-gray-600 transition hover:text-(--primary)">Books</Link></li>
              </ul>
            </div>

            {/* 4. Urban Wear */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Urban Wear</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/urban-wear/eighty-one" className="text-gray-600 transition hover:text-(--primary)">Eighty One</Link></li>
                <li><Link href="/urban-wear/montana-cans" className="text-gray-600 transition hover:text-(--primary)">Montana</Link></li>
              </ul>
            </div>

            {/* 5. Le Shop & Guides */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Découvrir</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/shop" className="text-gray-600 transition hover:text-(--primary)">Le Shop</Link></li>
                <li><Link href="/guides" className="text-gray-600 transition hover:text-(--primary)">Guides & Tutos</Link></li>
              </ul>
            </div>

            {/* 6. Infos Shop */}
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Infos</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>
                  <a href="tel:+33478911852" className="hover:text-black transition">04 78 91 18 52</a>
                </li>
                <li>
                  <a href="mailto:eightyone@hotmail.fr" className="hover:text-black transition text-[11px] break-all">
                    eightyone@hotmail.fr
                  </a>
                </li>
                <li className="text-[11px] leading-relaxed pt-1">
                  21 Rue des Capucins<br/>69001 LYON
                </li>
                <li className="text-[11px] pt-2 border-t border-gray-50 mt-2 flex flex-col">
                  <span>Lun : 14h-19h</span>
                  <span>Mar-Sam : 11h-19h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Copyright © 2026. Eightyone Store Lyon
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black transition">Mentions</Link>
            <Link href="/cgv" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black transition">CGV</Link>
            <Link href="/politique-de-confidentialite" className="text-[10px] uppercase tracking-tighter text-gray-500 hover:text-black transition">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer