"use client";

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export default function Input({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
