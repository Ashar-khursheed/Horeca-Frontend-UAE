import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface Crumb {
  label: string;
  href: string | null;
}

function Breadcrumb({ crumbs = [] }: { crumbs?: Crumb[] }) {

  return (
    <nav className="xl:bg-white bg-gray-100 border-b border-gray-100">
      <div className="global-container mx-auto px-4 sm:px-6">
        <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
          {crumbs.map((crumb, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && (
                <ChevronRight size={12} className="mx-1.5 text-gray-300" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-gray-400 hover:text-[#186737] transition-colors flex items-center gap-1"
                >
                  {i === 0 && <Home size={11} />}
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#186737] font-semibold">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      {/* <div className="h-[2px] bg-gray-100">
        <div className="h-full w-full bg-[#186737] rounded-r-full" />
      </div> */}
    </nav>
  );
}

export default Breadcrumb;