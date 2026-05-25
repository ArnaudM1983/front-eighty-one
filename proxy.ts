import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsData from './redirects.json';

const redirectsMap = new Map(
  redirectsData.map((r) => [r.source, r.destination])
);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('Middleware check pour :', pathname);

  if (pathname.match(/^\/wp-.*\.php$/)) {
    console.log(`Sécurité WP déclenchée : ${pathname} -> /`);
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  const destination = redirectsMap.get(pathname) || redirectsMap.get(`${pathname}/`);

  if (destination) {
    console.log(`Redirection trouvée : ${pathname} -> ${destination}`);
    
    if (destination.startsWith('http')) {
      return NextResponse.redirect(destination, 301);
    }

    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/produit/:path*',
    '/categorie-produit/:path*',
    '/marques/:path*',
    '/test-seo',
    '/page-daccueil/:path*', 
    '/wp-content/:path*',    
    '/mentions-legales/:path*',
    '/marqueurs-encres',
    '/marqueurs-encres/:path*',
    '/le-shop',  
    '/le-shop/:path*',
    '/classiques',               
    '/classiques/:path*',
    '/marqueurs-squeezers-vides',         
    '/marqueurs-squeezers-vides/:path*',
    '/caps',                             
    '/caps/:path*',
    '/:file.php' 
  ],
};