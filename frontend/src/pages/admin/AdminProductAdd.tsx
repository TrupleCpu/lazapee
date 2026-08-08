import { useMemo, useState } from "react";
import { ImagePlus, Info, X } from "lucide-react";
import { useNavigate } from "react-router";
import { categoriesApi, productsApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useObjectUrls } from "../../hooks/useObjectUrls";
import { slugify } from "../../lib/format";
import { Button, TextInput, TextArea, Select } from "../../components/ui";

type StockType = "inStock" | "lowStock" | "outOfStock";

interface ProductFormData {
  title: string;
  slug: string;
  subtitle: string;
  badge: string;
  category_id: string;
  price: string;
  quantity: string;
  description: string;
  stock_type: StockType;
  in_stock: boolean;
  stock_status: string;
  imageFiles: File[];
}

const STOCK_TYPE_OPTIONS: {
  value: StockType;
  label: string;
  caption: string;
  captionClass: string;
}[] = [
  {
    value: "inStock",
    label: "In Stock",
    caption: "AVAILABLE FOR PURCHASE",
    captionClass: "text-gray-400",
  },
  {
    value: "lowStock",
    label: "Low Stock",
    caption: "LIMITED INVENTORY",
    captionClass: "text-amber-500",
  },
  {
    value: "outOfStock",
    label: "Out of Stock",
    caption: "TEMPORARILY UNAVAILABLE",
    captionClass: "text-gray-400",
  },
];

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useFetch(categoriesApi.list);
  const { isPending, run } = useAsyncAction();

  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    subtitle: "",
    badge: "",
    category_id: "",
    price: "",
    quantity: "0",
    description: "",
    stock_type: "outOfStock",
    in_stock: false,
    stock_status: "Out of Stock",
    imageFiles: [],
  });

  const { previews: imagePreviews, removePreview } = useObjectUrls(
    formData.imageFiles,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "title") {
        updated.slug = slugify(value);
      }

      if (name === "quantity") {
        const qty = parseInt(value, 10) || 0;
        if (qty <= 0) {
          updated.stock_type = "outOfStock";
          updated.stock_status = "Out of Stock";
          updated.in_stock = false;
        } else if (qty <= 5) {
          updated.stock_type = "lowStock";
          updated.stock_status = "Low Stock";
          updated.in_stock = true;
        } else {
          updated.stock_type = "inStock";
          updated.stock_status = "In Stock";
          updated.in_stock = true;
        }
      }

      return updated;
    });
  };

  const handleStockTypeChange = (stock_type: StockType) => {
    let stock_status = "In Stock";
    let in_stock = true;
    let quantity = formData.quantity;

    if (stock_type === "lowStock") {
      stock_status = "Low Stock";
      in_stock = true;
      if (parseInt(quantity, 10) <= 0 || parseInt(quantity, 10) > 5) {
        quantity = "5";
      }
    } else if (stock_type === "outOfStock") {
      stock_status = "Out of Stock";
      in_stock = false;
      quantity = "0";
    } else if (stock_type === "inStock") {
      if (parseInt(quantity, 10) <= 5) {
        quantity = "10";
      }
    }

    setFormData((prev) => ({
      ...prev,
      stock_type,
      stock_status,
      in_stock,
      quantity,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...fileArray],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, idx) => idx !== indexToRemove),
    }));
    removePreview(indexToRemove);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = new FormData();
    bodyData.append("title", formData.title);
    bodyData.append("slug", formData.slug);
    if (formData.subtitle) bodyData.append("subtitle", formData.subtitle);
    if (formData.badge) bodyData.append("badge", formData.badge);
    bodyData.append("category_id", formData.category_id);
    bodyData.append("price", (parseFloat(formData.price) || 0).toString());
    bodyData.append(
      "quantity",
      (parseInt(formData.quantity, 10) || 0).toString(),
    );
    if (formData.description)
      bodyData.append("description", formData.description);
    bodyData.append("stock_type", formData.stock_type);
    bodyData.append("in_stock", String(formData.in_stock));
    bodyData.append("stock_status", formData.stock_status);

    formData.imageFiles.forEach((file) => bodyData.append("imageFiles", file));

    const result = await run(() => productsApi.create(bodyData));
    if (result == null) return;

    navigate("/admin/products");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Set up a new item in your digital catalog.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200/80 transition-all shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/60 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-6">
                General Information
              </h2>

              <div className="space-y-5">
                <TextInput
                  label="Product Title *"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Quantum Cube Pro"
                />

                <TextInput
                  label="URL Slug *"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="quantum-cube-pro"
                  className="font-mono"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextInput
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="e.g. Next-Gen Computing Power"
                  />
                  <TextInput
                    label="Badge Label"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="e.g. Best Seller, New"
                  />
                </div>

                <TextArea
                  label="Description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the product features and specifications..."
                />
              </div>
            </div>

            {/* Pricing & Inventory Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/60 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-6">
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextInput
                  label="Price (USD) *"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                <TextInput
                  label="Quantity Available *"
                  name="quantity"
                  type="number"
                  min="0"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Media Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/60 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Product Media
              </h2>

              <label className="border-2 border-dashed border-gray-200 hover:border-primary/50 bg-[#f8fafc] rounded-2xl p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-white rounded-xl shadow-2xs border border-gray-100 flex items-center justify-center mb-3 text-gray-400 group-hover:text-primary transition-colors">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Click to upload or drag image here
                </p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  SVG, PNG, JPG (MAX. 800x800px)
                </p>
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imagePreviews.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
                    >
                      <img
                        src={img}
                        alt={`Product Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-start space-x-2 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  <span className="font-bold">Recommended size:</span> 1:1
                  aspect ratio.
                </p>
              </div>
            </div>

            {/* Organization Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/60 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-6">
                Organization
              </h2>

              <div className="space-y-6">
                <Select
                  label="Category *"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select Category" },
                    ...(categories.map((cat) => ({
                      value: cat.id,
                      label: cat.title,
                    }))),
                  ]}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">
                    Stock Availability Status
                  </label>
                  <div className="space-y-2.5">
                    {STOCK_TYPE_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleStockTypeChange(option.value)}
                        className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.stock_type === option.value
                            ? "border-primary bg-blue-50/20"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="mt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              formData.stock_type === option.value
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.stock_type === option.value && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            {option.label}
                          </div>
                          <div
                            className={`text-[10px] uppercase font-bold mt-0.5 tracking-wider ${option.captionClass}`}
                          >
                            {option.caption}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdminProductAdd;