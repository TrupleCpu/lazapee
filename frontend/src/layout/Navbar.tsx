import { useState } from "react";
import { NavLink } from "react-router";
import { X, Menu } from "lucide-react";
import CartBadge from "../components/store/CartBadge";

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors duration-150 font-medium ${
    isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"
  }`;

const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `py-2 text-base font-medium transition-colors duration-150 ${
    isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"
  }`;

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <NavLink
    to="/"
    onClick={onClick}
    className="text-3xl font-bold tracking-tight"
  >
    <span className="text-blue-500">Laza</span>
    <span className="text-red-500">pee</span>
  </NavLink>
);

const DesktopNavbar = () => {
  return (
    <header className="hidden md:block bg-white border-b border-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center justify-center gap-10">
          <Logo />
          <nav className="text-base flex space-x-6">
            <NavLink to="/" className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={getNavLinkClass}>
              Products
            </NavLink>
            <NavLink to="/categories" className={getNavLinkClass}>
              Categories
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <CartBadge />
        </div>
      </div>
    </header>
  );
};

const MobileNavBar = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const closeMenu = () => setOpenMenu(false);

  return (
    <header className="block md:hidden bg-white border-b border-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo onClick={closeMenu} />

          <div className="flex items-center gap-3 text-gray-700">
            <CartBadge onClick={closeMenu} />

            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {!openMenu ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {openMenu && (
          <div className="pt-4 pb-2 border-t border-gray-100 mt-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" onClick={closeMenu} className={getMobileNavLinkClass}>
                Home
              </NavLink>
              <NavLink
                to="/products"
                onClick={closeMenu}
                className={getMobileNavLinkClass}
              >
                Products
              </NavLink>
              <NavLink
                to="/categories"
                onClick={closeMenu}
                className={getMobileNavLinkClass}
              >
                Categories
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavBar />
    </>
  );
};

export default Navbar;