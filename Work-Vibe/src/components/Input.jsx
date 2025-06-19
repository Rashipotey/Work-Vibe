import React from "react";

export function Input({ type = "text", value, onChange, name, placeholder, className = "", required = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B09F] ${className}`}
    />
  );
}
