import { getStatusBadgeClass } from "../../lib/order-status";

interface StatusBadgeProps {
  status: string | undefined;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(status)} ${className}`}
    >
      {status || "—"}
    </span>
  );
};

export default StatusBadge;