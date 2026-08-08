import Skeleton from "react-loading-skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton = ({
  rows = 6,
  columns = 4,
  className = "",
}: TableSkeletonProps) => (
  <div
    className={`bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden ${className}`}
  >
    <div className="px-6 py-4 bg-surface border-b border-gray-100">
      <Skeleton width={220} height={14} />
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 flex items-center gap-6"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="flex-1"
              width={`${Math.max(50, 100 - colIndex * 12)}%`}
              height={14}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TableSkeleton;