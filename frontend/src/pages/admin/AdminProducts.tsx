import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router";
import { productsApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { normalizeImageUrl } from "../../lib/images";
import { formatCurrency } from "../../lib/format";
import type { Product } from "../../types";
import {
  DataTable,
  type Column,
  Modal,
  ConfirmDialog,
  Pagination,
  Button,
  Select,
  TextInput,
  EmptyState,
  PageHeader,
  TableSkeleton,
} from "../../components/ui";

const productStatusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  out_of_stock: "Out of Stock",
};

const statusBadgeClass: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-gray-100 text-gray-600",
  out_of_stock: "bg-red-50 text-red-500",
};

const getProductStatus = (product: Product): string => {
  if (product.stock_status === "inactive") return "inactive";
  if (product.stock_status === "out_of_stock" || (product.quantity ?? 0) === 0)
    return "out_of_stock";
  return "active";
};

interface EditFormData {
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  stock_status: string;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch(productsApi.list);
  const { isPending: isDeleting, run: runDelete } = useAsyncAction();
  const { isPending: isSaving, run: runSave } = useAsyncAction();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    subtitle: "",
    price: 0,
    quantity: 0,
    stock_status: "active",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const productData = useMemo(() => data ?? [], [data]);

  const resetToFirstPage = () => setCurrentPage(1);

  const getImageUrl = (img?: string | { url: string } | null): string =>
    normalizeImageUrl(img) ?? "https://via.placeholder.com/150";

  const dynamicCategories = Array.from(
    new Set(
      productData
        .map((p) => p.categories?.title)
        .filter((title): title is string => Boolean(title)),
    ),
  );

  const filteredProducts = productData.filter((product) => {
    const currentStatus = getProductStatus(product);
    const matchesSearch =
      (product.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subtitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.categories?.title === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Statuses" || currentStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currProducts = filteredProducts.slice(startIndex, endIndex);

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      title: product.title || "",
      subtitle: product.subtitle || "",
      price: Number(product.price) || 0,
      quantity: product.quantity ?? 0,
      stock_status: product.stock_status || "active",
    });
    setExistingImages((product.images || []).map(getImageUrl));
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleNewImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const previews = fileArray.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prev) => [...prev, ...fileArray]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    const removedUrl = newImagePreviews[indexToRemove];
    if (removedUrl) URL.revokeObjectURL(removedUrl);
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewImagePreviews((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove),
    );
  };

  const handleDeleteSubmit = async () => {
    if (!selectedProduct) return;
    const ok = await runDelete(() => productsApi.remove(selectedProduct.id));
    if (ok == null) return;
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
    await refetch();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || isSaving) return;

    const bodyData = new FormData();
    bodyData.append("title", editFormData.title);
    bodyData.append("subtitle", editFormData.subtitle);
    bodyData.append("price", editFormData.price.toString());
    bodyData.append("quantity", editFormData.quantity.toString());
    bodyData.append("stock_status", editFormData.stock_status);
    existingImages.forEach((url) => bodyData.append("existingImages", url));
    newImageFiles.forEach((file) => bodyData.append("imageFiles", file));

    const ok = await runSave(() => productsApi.update(selectedProduct.id, bodyData));
    if (ok == null) return;

    setIsEditModalOpen(false);
    setSelectedProduct(null);
    await refetch();
  };

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center space-x-3">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
          />
          <div>
            <div className="font-bold text-gray-900 text-xs sm:text-sm">
              {product.title}
            </div>
            {product.subtitle && (
              <div className="text-[11px] text-gray-400 font-normal">
                {product.subtitle}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => (
        <span className="text-gray-600">{product.categories?.title || "Uncategorized"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <span className="font-semibold text-gray-700">
          {product.quantity ?? 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => {
        const status = getProductStatus(product);
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadgeClass[status]}`}
          >
            {productStatusLabel[status]}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (product) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleOpenEditModal(product)}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Edit product"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDeleteModal(product)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete product"
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
        title="Product Management"
        description="Manage your inventory, pricing, and stock levels."
        actions={
          <Button onClick={() => navigate("/admin/products/add")}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        }
      />

      <div className="bg-white rounded-3xl border border-gray-200/60 p-4 sm:p-5 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by product name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetToFirstPage();
              }}
              className="w-full bg-surface border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-1/2 sm:w-auto min-w-[140px]">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full appearance-none bg-surface border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary focus:bg-white cursor-pointer transition-all"
              >
                <option value="All Categories">All Categories</option>
                {dynamicCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-1/2 sm:w-auto min-w-[130px]">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full appearance-none bg-surface border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary focus:bg-white cursor-pointer transition-all"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          rows={currProducts}
          getRowKey={(row) => row.id}
          emptyState={
            <EmptyState icon={Search} title="No products found" />
          }
        />
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-800">
              {startIndex + 1}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            products
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
        title="Edit Product"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <TextInput
            label="Title"
            required
            value={editFormData.title}
            onChange={(e) =>
              setEditFormData({ ...editFormData, title: e.target.value })
            }
          />
          <TextInput
            label="Subtitle"
            value={editFormData.subtitle}
            onChange={(e) =>
              setEditFormData({ ...editFormData, subtitle: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Price ($)"
              type="number"
              step="0.01"
              required
              value={editFormData.price}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
            <TextInput
              label="Quantity"
              type="number"
              required
              value={editFormData.quantity}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <Select
            label="Stock Status"
            value={editFormData.stock_status}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                stock_status: e.target.value,
              })
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "out_of_stock", label: "Out of Stock" },
            ]}
          />

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Product Images
            </label>
            <label className="border-2 border-dashed border-gray-200 hover:border-primary/50 bg-surface rounded-2xl p-4 text-center transition-all cursor-pointer group flex flex-col items-center justify-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImagesUpload}
                className="hidden"
              />
              <div className="w-10 h-10 bg-white rounded-xl shadow-2xs border border-gray-100 flex items-center justify-center mb-2 text-gray-400 group-hover:text-primary transition-colors">
                <ImagePlus className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-gray-700">Upload new images</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                SVG, PNG, JPG (1:1 aspect ratio)
              </p>
            </label>

            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {existingImages.map((imgUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50"
                  >
                    <img
                      src={imgUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((imgUrl, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-xl overflow-hidden border-2 border-primary aspect-square bg-gray-50"
                  >
                    <img
                      src={imgUrl}
                      alt={`New preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
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

      <ConfirmDialog
        open={isDeleteModalOpen}
        title="Delete Product?"
        icon={Trash2}
        pending={isDeleting}
        message={`Are you sure you want to delete ${selectedProduct?.title}? This action cannot be undone.`}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSubmit}
        confirmLabel="Delete Product"
      />
    </>
  );
};

export default AdminProducts;