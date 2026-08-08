import { useState } from "react";
import { UploadCloud, AlertTriangle, Info, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router";
import { categoriesApi } from "../../lib/endpoints";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { slugify } from "../../lib/format";
import { Button, TextInput, TextArea, Select } from "../../components/ui";

type CategoryStatus = "Active" | "Inactive";

interface CategoryFormData {
  title: string;
  slug: string;
  description: string;
  imageFile: File | null;
  status: CategoryStatus;
}

const AdminCategoryAdd = () => {
  const navigate = useNavigate();
  const { isPending, run } = useAsyncAction();

  const [formData, setFormData] = useState<CategoryFormData>({
    title: "",
    slug: "",
    description: "",
    imageFile: null,
    status: "Active",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

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
      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setFormData((prev) => ({ ...prev, imageFile: file }));
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setFormData((prev) => ({ ...prev, imageFile: null }));
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = new FormData();
    bodyData.append("title", formData.title);
    bodyData.append("slug", formData.slug);
    bodyData.append("description", formData.description || "");
    bodyData.append("status", formData.status);

    if (formData.imageFile) {
      bodyData.append("image", formData.imageFile);
    }

    const result = await run(() => categoriesApi.create(bodyData));
    if (result == null) return;

    navigate("/admin/categories");
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-2">
        <span
          onClick={() => navigate("/admin/categories")}
          className="hover:text-gray-800 transition-colors cursor-pointer"
        >
          Categories
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-primary font-bold">Add Category</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Create New Category
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Define a new structural group for your product inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          {/* LEFT COLUMN: Inputs & Warnings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Form Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/60 shadow-2xs space-y-5">
              <TextInput
                label="Category Title *"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Computing"
              />

              <TextInput
                label="URL Slug *"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="computing"
                className="font-mono"
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />

              <TextArea
                label="Description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Laptops, Desktops, and Workstations for pros..."
              />
            </div>

            {/* Critical Restriction Alert */}
            <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200/80 flex items-start space-x-3.5">
              <div className="p-2 bg-rose-100/80 text-rose-600 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                  Critical Restriction
                </h4>
                <p className="text-[11px] text-rose-700/90 font-medium leading-relaxed mt-1">
                  Deleting a category with assigned products is restricted.
                  Ensure all items are remapped before attempted removal.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Image Upload & Actions */}
          <div className="space-y-6">
            {/* Category Visual Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
              <h2 className="text-xs font-bold text-gray-600 mb-4">
                Category Visual (Optional)
              </h2>

              {/* Image Upload Zone */}
              {imagePreview ? (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video mb-4">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-primary/50 bg-surface rounded-2xl p-8 text-center transition-all cursor-pointer group mb-4 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-2xs border border-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-primary transition-colors">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Click to upload or drag
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">
                    PNG, JPG UP TO 5MB
                  </p>
                </label>
              )}

              {/* Info Callout */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-start space-x-2 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  Icons appear in global navigation and product filters.
                </p>
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="space-y-3">
              <Button type="submit" className="w-full py-3.5" disabled={isPending}>
                {isPending ? "Creating..." : "Create Category"}
              </Button>
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="w-full py-3 bg-transparent hover:bg-gray-100 text-gray-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdminCategoryAdd;