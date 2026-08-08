import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Radio,
} from "lucide-react";
import { Link } from "react-router";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#eff3ff] text-gray-600 border-t border-blue-100/50">
      <div className="container mx-auto max-w-7xl pt-16 pb-8 px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#002b9a]">
              Laza<span className="text-red-500">pee</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Providing cutting-edge hardware solutions and enterprise
              technology since 2024. Reliability, precision, and technological
              sophistication in every product.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 bg-blue-100/60 hover:bg-blue-200/70 text-blue-900 rounded-full transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 bg-blue-100/60 hover:bg-blue-200/70 text-blue-900 rounded-full transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2.5 bg-blue-100/60 hover:bg-blue-200/70 text-blue-900 rounded-full transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2.5 bg-blue-100/60 hover:bg-blue-200/70 text-blue-900 rounded-full transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Shop</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 space-x-2 text-sm text-gray-600 md:space-y-2">
              <Link to="/" className="hover:underline">
                Laptops
              </Link>
              <Link to="/" className="hover:underline">
                Smartphones
              </Link>
              <li>
                <Link to="/" className="hover:underline">
                  Peripherals
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  Smart Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Support</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 space-x-2 text-sm text-gray-600 md:space-y-2">
              <Link to="/" className="hover:underline">
                About Us
              </Link>
              <Link to="/" className="hover:underline">
                Contact
              </Link>
              <Link to="/" className="hover:underline">
                Shipping Policy
              </Link>
              <Link to="/" className="hover:underline">
                Privacy
              </Link>
            </ul>
          </div>

          {/* Contact Us Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Contact Us</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 space-x-2 text-sm text-gray-600 md:space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a href="mailto:hello@lazapee.io" className="hover:underline">
                  hello@lazapee.io
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>+1 (800) LAZA-PEE</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span>
                  100 Innovation Way
                  <br />
                  Silicon Valley, CA 94025
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="border-t border-gray-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2024 Lazapee. All rights reserved.</p>

          {/* Payment Method Icons */}
          <div className="flex items-center gap-3 text-gray-400">
            <CreditCard className="w-5 h-5 hover:text-gray-600 transition-colors" />
            <Wallet className="w-5 h-5 hover:text-gray-600 transition-colors" />
            <Radio className="w-5 h-5 hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
