import Link from "next/link";

type Crumb = {
  label: string;
  href?: string; 
};

type Props = {
  crumbs: Crumb[];
};

const Breadcrumbs = ({ crumbs }: Props) => {
  return (<nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb"> <ol className="flex flex-wrap gap-1">
    {crumbs.map((crumb, index) => {
      const isLast = index === crumbs.length - 1;
      return (<li key={index} className="flex items-center">
        {!isLast && crumb.href ? (
          <> <Link href={crumb.href} className="hover:underline">
            {crumb.label} </Link> <span className="mx-2">/</span>
          </>
        ) : (<span className="font-medium text-gray-800">{crumb.label}</span>
        )} </li>
      );
    })} </ol> </nav>
  );
};

export default Breadcrumbs;
