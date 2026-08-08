import Skeleton from "react-loading-skeleton";

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <Skeleton height={192} className="w-full" />
    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <Skeleton width={100} height={12} />
        <Skeleton width="70%" height={22} />
        <Skeleton width={130} height={20} />
      </div>
      <div className="space-y-2">
        <Skeleton height={36} borderRadius={8} />
        <Skeleton height={36} borderRadius={8} />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;