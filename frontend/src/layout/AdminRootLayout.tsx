import { Outlet } from "react-router";
import { Suspense } from "react";
import { TableSkeleton } from "../components/ui";

const AdminRootLayout = () => {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="container mx-auto max-w-7xl p-6 space-y-6">
            <TableSkeleton rows={4} columns={5} />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AdminRootLayout;