import React from "react";

export function Button({ children, onClick, type = "button", variant = "default", className = "" }) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl px-4 py-2 text-sm transition-colors";

  const variants = {
    default: "bg-[#00B09F] text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
