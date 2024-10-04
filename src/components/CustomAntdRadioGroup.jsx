import React, { useEffect, useState } from "react";
import { Radio } from "antd";
import { IoCheckmark } from "react-icons/io5";

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

  const isColorOption = options
    ?.map((option) => option.value)
    .includes("clear");

  return (
    <Radio.Group
      onChange={handleChange}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      buttonStyle={buttonStyle}
      optionType={optionType}
      size={"middle"}
      {...restProps}
      className={`flex gap-0 w-full ${
        typeof options[0]?.label === "string" ? "gap-3" : "gap-0"
      }`}
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          value={option.value}
          disabled={option.disabled}
          className={`flex-1 text-center ${
            typeof option.label === "string"
              ? "border hover:border-theme-primary before:hover:!bg-theme-transparent hover:!border-l-theme-primary"
              : "custom-radio-btn border-none !bg-transparent before:!bg-transparent !border-l-transparent h-fit w-fit"
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
                    ? isColorOption
                      ? " text-theme-primary"
                      : "border-dotted border-2 border-theme-primary text-theme-primary bg-[#f5f5f5]"
                    : "border-dotted border-2 border-transparent"
                } ${
                  isColorOption
                    ? "hover:border-theme-transparent"
                    : "hover:border-theme-primary"
                } transition-all duration-300 ease-in-out ${
                  option.disabled ? "opacity-50 pointer-events-none" : ""
                }`,
                children: (
                  <>
                    {option.label.props.children}
                    {/* Conditionally render the check mark */}
                    {isColorOption && option.value === selectedValue && (
                      // <IoCheckmark className="absolute top-[17%] right-[39%] text-red-400 text-2xl" />
                      <IoCheckmark
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-red-400 text-2xl"
                        style={{
                          transform: "translate(-50%, calc(-50% - 12px))",
                        }} // Calculate offset
                      />
                    )}
                  </>
                ),
              })
            )}
          </div>{" "}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default CustomAntdRadioGroup;
