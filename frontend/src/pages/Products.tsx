import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categoriesApi, productsApi } from "../lib/endpoints";
import { useFetch } from "../hooks/useFetch";
import type {  Product } from "../types";
import ProductCard from "../components/store/ProductCard";
import { ProductCardSkeleton } from "../components/ui";
import Breadcrumb from "../components/ui/Breadcrumb";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { useSearchParams } from "react-router";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data: productsData, loading } = useFetch(productsApi.list);
  const { data: categoryData } = useFetch(categoriesApi.list);

  const [priceValue, setPriceValue] = useState<number>(5000);
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("allItems");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const products = useMemo(() => productsData ?? [], [productsData]);
  const categories = useMemo(() => categoryData ?? [], [categoryData])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset pagination when filters change
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategories,
    priceValue,
    selectedAvailability,
    sortOrder,
  ]);

  useEffect(() => {
    if (categoryId != null) {
      const category = categories.find(
        (category) => category.id === categoryId,
      );

      if (category) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCategories([category.title]);
      }
    }
  }, [categoryId, categories]);

  const dynamicCategories = Array.from(
    new Set(
      products
        .map((p) => p.categories?.title)
        .filter((title): title is string => Boolean(title)),
    ),
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleToggle = (id: string) => {
    setSelectedAvailability((prev) => (prev === id ? "allItems" : id));
  };

  const filteredProducts = products.filter((product) => {
    if (product.stock_status === "inactive") return false;

    const categoryName = product.categories?.title || "";
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(categoryName);

    const matchesPrice = Number(product.price) <= priceValue;

    const matchesAvailability =
      selectedAvailability === "allItems" ||
      (selectedAvailability === "inStock" &&
        (product.stock_status === "in_stock" || (product.quantity ?? 0) > 0));

    return (
      matchesSearch && matchesCategory && matchesPrice && matchesAvailability
    );
  });

  const orderedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-asc") return Number(a.price) - Number(b.price);
    if (sortOrder === "price-desc") return Number(b.price) - Number(a.price);
    return 0;
  });

  const totalPages = Math.ceil(orderedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currProducts = orderedProducts.slice(startIndex, endIndex);

  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-7xl py-20 px-4 flex flex-col md:flex-row">
        <div className="py-1 w-full md:w-1/4 px-4 space-y-6">
          <div>
            <p className="text-xl font-semibold mb-4">Filters</p>
            <p className="text-sm tracking-wider font-semibold text-gray-600 mb-2">
              Categories
            </p>
            <div className="space-y-1.5 text-sm">
              {[
                { title: "All Categories" },
                ...dynamicCategories.map((t) => ({ title: t })),
              ].map((cat) => (
                <div key={cat.title} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={cat.title}
                    checked={
                      cat.title === "All Categories"
                        ? selectedCategories.length === 0
                        : selectedCategories.includes(cat.title)
                    }
                    onChange={() =>
                      cat.title === "All Categories"
                        ? setSelectedCategories([])
                        : handleCategoryChange(cat.title)
                    }
                    className="cursor-pointer rounded"
                  />
                  <label
                    htmlFor={cat.title}
                    className="cursor-pointer text-gray-700"
                  >
                    {cat.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                PRICE RANGE
              </p>
              <span className="text-sm font-bold text-blue-700">
                ${priceValue}
              </span>
            </div>

            <div>
              <input
                id="slider"
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceValue}
                onChange={(e) => setPriceValue(Number(e.target.value))}
                className="w-full h-1 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
              <div className="flex justify-between text-[11px] font-semibold text-gray-500 mt-1">
                <span>$0</span>
                <span>$5,000+</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm tracking-wider font-semibold text-gray-600 mb-2">
              Availability
            </p>
            <div className="space-y-1">
              {[
                { id: "inStock", label: "In Stock" },
                { id: "allItems", label: "All Items" },
              ].map((option) => (
                <div
                  key={option.id}
                  className="space-x-2 text-sm flex items-center"
                >
                  <input
                    type="radio"
                    name="filterGroup"
                    id={option.id}
                    checked={selectedAvailability === option.id}
                    onChange={() => handleToggle(option.id)}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={option.id}
                    className="cursor-pointer text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <Breadcrumb items={[{ label: "Products" }]} />

          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-150"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-sm font-medium text-gray-500 self-start sm:self-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length > 0 ? startIndex + 1 : 0} -{" "}
                {Math.min(endIndex, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              results
            </p>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {currProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No products found"
              description={`Try adjusting your search term "${searchTerm}" or clearing the filters.`}
              className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl"
              action={
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-blue-50 text-primary font-semibold text-xs rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
