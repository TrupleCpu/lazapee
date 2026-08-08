import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "accent" | "outline" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer",
  accent:
    "bg-accent hover:bg-accent-hover text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer",
  outline:
    "bg-white border border-primary text-primary hover:bg-blue-50 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 cursor-pointer",
  danger:
    "bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 disabled:text-gray-400 cursor-pointer",
};

const Button = ({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2.5 transition-colors duration-150 disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;