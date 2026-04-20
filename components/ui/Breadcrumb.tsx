import Link from "next/link";

type Crumb = {
  label: string;
  href?: string; 
};

type Props = {
  crumbs: Crumb[];
};

const Breadcrumbs = ({ crumbs }: Props) => {
  // Fonction pour nettoyer les entités HTML comme &amp;
  const decodeHtml = (html: string) => {
    return html.replace(/&amp;/g, '&')
               .replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'")
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>');
  };

  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb"> 
      <ol className="flex flex-wrap gap-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const cleanLabel = decodeHtml(crumb.label); 

          return (
            <li key={index} className="flex items-center">
              {!isLast && crumb.href ? (
                <> 
                  <Link href={crumb.href} className="hover:underline">
                    {cleanLabel} 
                  </Link> 
                  <span className="mx-2">/</span>
                </>
              ) : (
                <span className="font-medium text-gray-800">{cleanLabel}</span>
              )} 
            </li>
          );
        })} 
      </ol> 
    </nav>
  );
};

export default Breadcrumbs;