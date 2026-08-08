import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import heroLaptop from "../assets/hero-laptop.webp";
import { Link } from "react-router";
import { categoriesApi, productsApi } from "../lib/endpoints";
import type { Category, Product } from "../types";
import ProductCard from "../components/store/ProductCard";
import { ProductCardSkeleton, CategoryCardSkeleton } from "../components/ui";

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          categoriesApi.list(),
          productsApi.list(),
        ]);

        if (cancelled) return;
        setCategories((Array.isArray(categoriesData) ? categoriesData : []).slice(0, 4));
        setProducts(
          (Array.isArray(productsData) ? productsData : [])
            .filter(
              (p) =>
                p.stock_status !== "inactive" &&
                p.stock_status !== "out_of_stock",
            )
            .slice(0, 4),
        );
      } catch (error) {
        console.error("Failed to load store data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      {/* Hero Section */}
      <div className="bg-[#1E40AF]">
        <div className="container mx-auto max-w-7xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col">
              <div className="order-1 space-y-4 text-center lg:text-left sm:mb-5">
                <h1 className="text-white text-5xl font-bold">
                  Future-Proof Your Life with{" "}
                  <span className="text-blue-500">Laza</span>
                  <span className="text-red-500">pee</span>
                </h1>
                <p className="text-gray-300">
                  Shop the latest in tech. From quantum-grade laptops to
                  neuro-responsive smartphones, we engineer the tools for
                  tomorrow, today.
                </p>
              </div>

              <div className="order-2 lg:order-3 flex justify-center lg:hidden py-10">
                <img
                  src={heroLaptop}
                  alt="Hero Laptop"
                  className="w-72 h-60 md:w-90 md:h-75 border-4 border-white rounded-md rotate-3 shadow-2xl"
                />
              </div>
              <div className="order-3 mt-6 flex flex-col sm:flex-row gap-4 text-white lg:justify-start">
                <Link
                  to="/products"
                  className="bg-orange-400 px-4 py-4 flex items-center justify-center font-semibold rounded-md shadow-lg"
                >
                  Shop All Products <ArrowRight />
                </Link>
                <Link
                  to="/categories"
                  className="bg-[whitesmoke]/10 border border-gray-400/10 px-4 py-4 flex items-center justify-center font-semibold rounded-md shadow-lg"
                >
                  View Collections
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <img
                src={heroLaptop}
                alt="Hero Laptop"
                className="w-90 h-75 border-4 border-white rounded-md rotate-3 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl py-20">
          <h2 className="text-3xl font-semibold">Explore Categories</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">
              Browse our curated selection of elite technology across core
              ecosystems.
            </p>
            <Link
              to="/categories"
              className="flex items-center text-blue-900 font-semibold hover:text-blue-700"
            >
              View all categories <ArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
              {[1, 2, 3, 4].map((i) => (
                <CategoryCardSkeleton key={i} variant="tile" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-semibold">
              No categories available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories`}
                  className="group relative h-80 w-full overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                      {cat.title}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      {cat.title.slice(0, 7).toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Signature Series */}
      <div className="bg-[#e2e8fa]">
        <div className="container mx-auto max-w-7xl py-20">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold">
              The <span className="text-blue-500">Laza</span>
              <span className="text-red-500">pee </span>Signature Series
            </h3>
            <p className="text-gray-600 text-center">
              Precision-engineered hardware that defines the current
              technological frontier.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-12 py-14 text-center text-gray-500 font-semibold">
              No products available.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;