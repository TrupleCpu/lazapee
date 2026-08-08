import { Outlet } from "react-router";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RootLayout = () => {
  {/* App Container */}
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
         {/* Child routes render here */}
        <Suspense
          fallback={
            <div className="container mx-auto max-w-7xl py-20 px-4 space-y-6">
              <Skeleton width={140} height={14} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-3"
                  >
                    <Skeleton height={160} />
                    <Skeleton width="70%" height={20} />
                    <Skeleton width={120} height={18} />
                  </div>
                ))}
              </div>
            </div>
          }
        >
           <Outlet />
         </Suspense>
      </main>
      <Footer />
    </div>
  )
}


export default RootLayout;
