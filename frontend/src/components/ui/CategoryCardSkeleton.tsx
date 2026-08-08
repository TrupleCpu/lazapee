import Skeleton from "react-loading-skeleton";

interface CategoryCardSkeletonProps {
  variant?: "card" | "tile";
}

const CategoryCardSkeleton = ({
  variant = "card",
}: CategoryCardSkeletonProps) => {
  if (variant === "tile") {
    return (
      <div className="h-80 w-full overflow-hidden rounded-2xl shadow-md">
        <Skeleton height={320} className="w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <Skeleton height={224} className="w-full" />
      <div className="p-6 flex-1 space-y-3">
        <Skeleton width="50%" height={22} />
        <Skeleton count={2} height={14} containerClassName="space-y-2" />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;