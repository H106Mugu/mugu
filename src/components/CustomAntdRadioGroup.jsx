import React, { useState } from "react";
import { Radio } from "antd";

const CustomAntdRadioGroup = ({
  options = [], // Array of radio options
  onChange = () => {}, // Default onChange is an empty function
  defaultValue = null, // Default value is null
  disabled = false, // Default is not disabled
  buttonStyle = "solid", // Default button style
  optionType = "button", // Default option type is plain radio
  size = "large", // Default size is "default"
  ...restProps // Any other props that need to be passed
}) => {
  // State to track the selected radio button value
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (e) => {
    setSelectedValue(e.target.value); // Update the selected value
    onChange(e); // Call the onChange handler
  };

  return (
    <Radio.Group
      onChange={handleChange}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      buttonStyle={buttonStyle}
      optionType={optionType}
      size={size}
      {...restProps}
      className="flex gap-3"
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          value={option.value}
          disabled={option.disabled}
          className={`${
            typeof option.label === "string"
              ? " border hover:border-theme-primary before:hover:!bg-theme-primary hover:!border-l-theme-primary"
              : "border-none !bg-transparent before:!bg-transparent !border-l-transparent !px-[2px] !h-fit py-[2px]"
          } `}
        >
          <div>
            {typeof option.label === "string" ? (
              <span>{option.label}</span>
            ) : (
              // Clone the label element and apply the `className` dynamically
              React.cloneElement(option.label, {
                disabled: option.disabled,
                className: `${option.label.props.className || ""} ${
                  option.value === selectedValue
                    ? "border-2 border-theme-primary shadow-xl text-theme-primary"
                    : "border-2 border-transparent"
                } hover:border-theme-primary transition-all duration-300 ease-in-out ${
                  option.disabled ? "opacity-50 pointer-events-none" : ""
                }`,
              })
            )}
          </div>{" "}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default CustomAntdRadioGroup;
