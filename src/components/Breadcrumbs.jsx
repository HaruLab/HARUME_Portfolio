
import { ChevronRight } from 'lucide-react';
import { withBase } from '../utils/paths';

const Breadcrumbs = ({ replacements = {} }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const base = import.meta.env.BASE_URL || '/';
  // Remove base from pathname to get the actual path segments
  const pathWithoutBase = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const pathSegments = pathWithoutBase.split('/').filter(segment => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const href = withBase(path);
    const isLast = index === pathSegments.length - 1;
    
    let title = replacements[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1));

    return (
      <div key={href} className="flex items-center">
        <a href={href} className={`hover:opacity-60 transition-opacity font-display ${isLast ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/60'}`}>
            {title.toUpperCase()}
        </a>
        {!isLast && <ChevronRight size={14} className="mx-2 text-[var(--border-color)]" />}
      </div>
    );
  });

  return (
    <nav className="flex items-center text-[10px] font-bold tracking-[0.2em] whitespace-nowrap font-display">
      <div className="flex items-center">
        <a href={withBase('/')} className="text-[var(--text-secondary)]/60 hover:opacity-60 transition-opacity font-display">
          HOME
        </a>
        {pathSegments.length > 0 && <ChevronRight size={14} className="mx-2 text-[var(--border-color)]" />}
      </div>
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumbs;