import { Outlet } from "react-router";
import Sidebar from "../components/admins/Sidebar";
import Header from "../components/admins/Header";

const AdminLayout = () => {
  return (
    <div className="bg-[#f3f6fc] min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto min-w-0">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;