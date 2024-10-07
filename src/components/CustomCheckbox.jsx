import React from "react";

const CustomCheckbox = ({ checked, onChange, label, icon }) => {
  return (
    <label className="inline-flex items-center cursor-pointer rounded-[1920px] overflow-hidden">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden" // Hide the default checkbox
      />
      <span
        className={`border-theme-[#d9d9d9] hover:border-theme-primary flex items-center justify-center px-2 !text-[0.75rem] font-[500] h-8 border rounded-[1920px] transition-colors duration-300 
          ${
            checked
              ? "bg-theme-primary text-white border-theme-primary hover:bg-opacity-80" // Styles when checked
              : "bg-white text-gray-700 border-gray-300 hover:bg-opacity-75 hover:text-gray-800" // Styles when unchecked
          }
          focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-opacity-50`}
      >
        {/* Render icon if provided */}
        {icon && (
          <span
            className={`pt-[2px] me-[8px] ${
              checked ? "hover:border-white" : "hover:border-theme-primary"
            }`}
          >
            {icon}
          </span>
        )}
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;
