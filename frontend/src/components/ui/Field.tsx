import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}

const FieldWrapper = ({ label, htmlFor, hint, children }: FieldWrapperProps) => (
  <div>
    {label && (
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-gray-500 mb-1"
      >
        {label}
      </label>
    )}
    {children}
    {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
  </div>
);

const inputBase =
  "w-full bg-surface border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const TextInput = ({ label, hint, className = "", ...rest }: TextInputProps) => (
  <FieldWrapper label={label} hint={hint} htmlFor={rest.id}>
    <input className={`${inputBase} ${className}`} {...rest} />
  </FieldWrapper>
);

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

const TextArea = ({ label, hint, className = "", ...rest }: TextAreaProps) => (
  <FieldWrapper label={label} hint={hint} htmlFor={rest.id}>
    <textarea className={`${inputBase} resize-none ${className}`} {...rest} />
  </FieldWrapper>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: { value: string | number; label: string }[];
}

const Select = ({
  label,
  hint,
  options,
  className = "",
  ...rest
}: SelectProps) => (
  <FieldWrapper label={label} hint={hint} htmlFor={rest.id}>
    <div className="relative">
      <select
        className={`${inputBase} appearance-none pr-9 cursor-pointer ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </FieldWrapper>
);

export { TextInput, TextArea, Select };