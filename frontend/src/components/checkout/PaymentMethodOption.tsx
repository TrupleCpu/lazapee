import type { LucideIcon } from "lucide-react";

interface PaymentMethodOptionProps {
  label: string;
  icon: LucideIcon;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

const PaymentMethodOption = ({
  label,
  icon: Icon,
  value,
  selected,
  onSelect,
}: PaymentMethodOptionProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
        selected
          ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/20"
          : "border-gray-200 bg-surface text-gray-600 hover:border-gray-300"
      }`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
};

export default PaymentMethodOption;