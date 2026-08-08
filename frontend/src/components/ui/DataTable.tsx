import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  headerClassName?: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyState?: ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
}

const thBase =
  "bg-surface px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100";
const tdBase = "px-6 py-4 font-medium text-gray-700";

const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  emptyState,
  className = "",
  onRowClick,
}: DataTableProps<T>) => {
  return (
    <div className={`bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${thBase} ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                        ? "text-center"
                        : "text-left"
                  } ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && emptyState ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10">
                  {emptyState}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${
                    onRowClick
                      ? "hover:bg-gray-50/80 cursor-pointer"
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${tdBase} ${
                        column.align === "right"
                          ? "text-right"
                          : column.align === "center"
                            ? "text-center"
                            : "text-left"
                      } ${column.className ?? ""}`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;