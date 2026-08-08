import { Link } from "react-router";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-500 font-medium"
      aria-label="Breadcrumb"
    >
      <Link to="/" className="hover:text-blue-600 transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center space-x-2">
            <span>&gt;</span>
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary font-semibold" : ""}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;