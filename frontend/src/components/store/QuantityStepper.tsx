import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  compact?: boolean;
}

const QuantityStepper = ({
  quantity,
  onDecrement,
  onIncrement,
  min = 1,
  max,
  disabled = false,
  size = "md",
  compact = false,
}: QuantityStepperProps) => {
  const canDecrement = !disabled && quantity > min;
  const canIncrement = !disabled && (max === undefined || quantity < max);

  if (compact) {
    return (
      <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label="Decrease quantity"
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold text-gray-800">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label="Increase quantity"
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 ${
        size === "md" ? "w-full sm:w-36" : "w-28"
      } ${
        disabled
          ? "bg-gray-100 opacity-50 pointer-events-none"
          : "bg-gray-50/50"
      }`}
    >
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label="Decrease quantity"
        className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 cursor-pointer"
      >
        <Minus className={`${size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
      </button>
      <span className="font-semibold text-gray-800 text-sm">
        {disabled ? 0 : quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label="Increase quantity"
        className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 cursor-pointer"
      >
        <Plus className={`${size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
      </button>
    </div>
  );
};

export default QuantityStepper;