import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: ReactNode;
  className?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-blue-50 text-[#1d4ed8]",
  trend,
  className = "",
}: StatCardProps) => {
  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-gray-900">{value}</p>
          {trend && <div className="mt-1 text-xs text-gray-400">{trend}</div>}
        </div>
        <span className={`p-2.5 rounded-xl ${iconClassName}`}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
};

export default StatCard;