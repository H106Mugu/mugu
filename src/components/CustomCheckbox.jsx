import React from "react";

const CustomCheckbox = ({ checked, onChange, label, icon }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden" // Hide the default checkbox
      />
      <span
        className={`flex items-center justify-center px-4 h-8 border transition-colors duration-300 text-sm
          ${
            checked
              ? "bg-theme-primary text-white border-theme-primary hover:bg-opacity-80" // Styles when checked
              : "bg-white text-gray-700 border-gray-300 hover:bg-opacity-75 hover:text-gray-800" // Styles when unchecked
          }
          focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-opacity-50`}
      >
        {/* Render icon if provided */}
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;
