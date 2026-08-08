import { Loader2 } from "lucide-react";

interface SpinnerProps {
  label?: string;
  className?: string;
}

const Spinner = ({ label, className = "" }: SpinnerProps) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-gray-500 font-medium ${className}`}
    >
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>{label}</span>
    </div>
  );
};

export default Spinner;
