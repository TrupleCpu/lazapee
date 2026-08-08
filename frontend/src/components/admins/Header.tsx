import { Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-end items-center mb-8">

      <div className="flex items-center space-x-3">
        <button className="p-2.5 text-gray-500 hover:text-gray-800 bg-white border border-gray-200/80 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs">
          <Settings className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-2 pl-2">
          <span className="text-xs font-bold text-gray-700 hidden sm:inline-block">
            Alex Management
          </span>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
