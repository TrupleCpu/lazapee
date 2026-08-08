import { useRef, useState } from "react";
import {
  Folder,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";
import { categoriesApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { Category } from "../../types";
import {
  DataTable,
  type Column,
  Modal,
  ConfirmDialog,
  Button,
  TextInput,
  TextArea,
  Select,
  EmptyState,
  PageHeader,
  StatCard,
  TableSkeleton,
} from "../../components/ui";

interface CategoryRow extends Category {
  name?: string;
  _count?: { products?: number };
}

interface EditFormData {
  title: string;
  description: string;
  image: string;
  status: string;
}

const getTitle = (category: CategoryRow): string =>
  category.title || category.name || "Untitled";

const getCount = (category: CategoryRow): number =>
  category.productsCount ?? category._count?.products ?? 0;

const getStatus = (category: CategoryRow): string =>
  category.status || "Active";

const AdminCategories = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch(categoriesApi.list);
  const { isPending: isDeleting, run: runDelete } = useAsyncAction();
  const { isPending: isSaving, run: runSave } = useAsyncAction();

  const categoriesData = (data as CategoryRow[] | null) ?? [];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(
    null,
  );

  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    description: "",
    image: "",
    status: "Active",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Derived Metrics
  const totalCategories = categoriesData.length;
  const activeCategories = categoriesData.filter(
    (c) => getStatus(c).toLowerCase() === "active",
  ).length;
  const emptyCategories = categoriesData.filter((c) => getCount(c) === 0).length;

  const resetImageState = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setEditImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    resetImageState();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenEditModal = (category: CategoryRow) => {
    setSelectedCategory(category);
    const initialImage = category.image || "";
    setEditFormData({
      title: getTitle(category),
      description: category.description || "",
      image: initialImage,
      status: getStatus(category),
    });
    setImagePreview(initialImage);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (category: CategoryRow) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resetImageState();
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setEditImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    resetImageState();
    setEditFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    const bodyData = new FormData();
    bodyData.append("title", editFormData.title);
    bodyData.append("slug", selectedCategory.slug || "");
    bodyData.append("description", editFormData.description || "");
    bodyData.append("status", editFormData.status);
    if (editImageFile) {
      bodyData.append("image", editImageFile);
    }

    const result = await runSave(() =>
      categoriesApi.update(selectedCategory.id, bodyData),
    );
    if (result == null) return;

    handleCloseEditModal();
    await refetch();
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;
    const result = await runDelete(() =>
      categoriesApi.remove(selectedCategory.id),
    );
    if (result == null) return;

    handleCloseDeleteModal();
    await refetch();
  };

  const columns: Column<CategoryRow>[] = [
    {
      key: "name",
      header: "Category Name",
      render: (category) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
            {category.image ? (
              <img
                src={category.image}
                alt={getTitle(category)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Folder className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="font-bold text-gray-900 text-xs sm:text-sm">
            {getTitle(category)}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (category) => (
        <span className="text-gray-500 max-w-xs font-normal block truncate">
          {category.description || "No description provided."}
        </span>
      ),
    },
    {
      key: "products",
      header: "Products",
      render: (category) => (
        <span className="inline-flex items-center justify-center bg-blue-50 text-primary font-bold px-3 py-1 rounded-lg text-xs">
          {getCount(category)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (category) => {
        const status = getStatus(category);
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
              status.toLowerCase() === "active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (category) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleOpenEditModal(category)}
            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDeleteModal(category)}
            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Category Management"
        description="Organize and structure your product inventory hierarchically."
        actions={
          <Button onClick={() => navigate("/admin/categories/add")}>
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </Button>
        }
      />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Categories"
          value={totalCategories}
          icon={Folder}
          iconClassName="bg-blue-50 text-primary"
        />
        <StatCard
          label="Active Categories"
          value={activeCategories}
          icon={Folder}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Empty Categories"
          value={emptyCategories}
          icon={Folder}
          iconClassName="bg-gray-100 text-gray-800"
        />
      </div>

      {/* Categories Table */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={categoriesData}
            getRowKey={(row) => row.id}
            emptyState={
              <EmptyState
                icon={Folder}
                title="No categories found"
                description='Click "New Category" to create one.'
              />
            }
          />

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div>
              Showing{" "}
              <span className="font-bold text-gray-800">
                {categoriesData.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800">
                {categoriesData.length}
              </span>{" "}
              categories
            </div>
          </div>
        </>
      )}

      {/* EDIT CATEGORY MODAL */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        size="md"
        title="Edit Category"
      >
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Update category details for{" "}
          <strong>{selectedCategory && getTitle(selectedCategory)}</strong>
        </p>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <TextInput
            label="Category Title / Name"
            required
            value={editFormData.title}
            onChange={(e) =>
              setEditFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category Image
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative flex items-center gap-3 p-2 bg-surface border border-gray-200 rounded-2xl">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    Image selected
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Click below to replace or remove
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-primary bg-surface hover:bg-blue-50/30 rounded-2xl p-5 text-center cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-primary group-hover:border-blue-200 transition-colors shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-700 group-hover:text-primary">
                  Click to choose image from PC
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  PNG, JPG, WEBP, or GIF up to 5MB
                </p>
              </div>
            )}
          </div>

          <TextArea
            label="Description"
            rows={3}
            value={editFormData.description}
            onChange={(e) =>
              setEditFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <Select
            label="Status"
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            options={[
              { value: "Active", label: "Active" },
              { value: "Pending", label: "Pending" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmDialog
        open={isDeleteModalOpen}
        title="Delete Category?"
        pending={isDeleting}
        message={
          selectedCategory
            ? `Are you sure you want to delete ${getTitle(
                selectedCategory,
              )}? This action cannot be undone and may affect associated products.`
            : ""
        }
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteSubmit}
        confirmLabel="Delete Category"
      />
    </>
  );
};

export default AdminCategories;