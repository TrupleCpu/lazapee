import { Link } from "react-router";
import { categoriesApi } from "../lib/endpoints";
import { useFetch } from "../hooks/useFetch";
import type { Category } from "../types";
import Breadcrumb from "../components/ui/Breadcrumb";
import { CategoryCardSkeleton } from "../components/ui";

const Categories = () => {
  const { data: categories, loading } = useFetch(categoriesApi.list);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb items={[{ label: "Categories" }]} />

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shop by Category
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl">
            Explore our curated selection of high-performance technology across
            specialized categories designed for your digital lifestyle.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(categories ?? []).map((category: Category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="h-56 w-full bg-gray-100 overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                      {category.title}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {category.title}
                      </h2>
                      {category.productsCount !== undefined && (
                        <span className="bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {category.productsCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;