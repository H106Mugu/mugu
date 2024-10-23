import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import colorCheckMark from "../assets/icons/color-check.svg";
import useBreakpoints from "../hooks/useBreakpoints";

const CustomAntdRadioGroup = ({
  value = null, // Default value is null
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
  const [isVisible, setIsVisible] = useState(false);
  const breakpoint = useBreakpoints();

  useEffect(() => {
    if (options.length > 0) {
      // Set to visible when options exist
      setIsVisible(true);
    } else {
      // Set to invisible when no options are available
      setIsVisible(false);
    }
  }, [options]);

  const handleChange = (e) => {
    setSelectedValue(e.target.value); // Update the selected value
    onChange(e); // Call the onChange handler
  };

  const isColorOption = options
    ?.map((option) => option.value)
    .includes("#f7531d");

  const getButtonWidth = () => {
    // Calculate the width based on the number of options
    return `${100 / options.length}%`;
  };

  const isSmallScreen = ["xs", "sm"].includes(breakpoint);

  return (
    <Radio.Group
      value={value}
      onChange={handleChange}
      defaultValue={defaultValue}
      disabled={disabled}
      buttonStyle={buttonStyle}
      optionType={optionType}
      size={"middle"}
      {...restProps}
      className={`flex gap-0 w-full ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${typeof options[0]?.label === "string" ? "gap-3" : "gap-0"}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: !isSmallScreen ? "opacity 0.2s ease-in-out" : "none", // Disable transition for small screens
      }}
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          value={option.value}
          disabled={disabled}
          className={`text-center ${
            !isSmallScreen ? "transition-all duration-200 ease-in-out" : ""
          } ${
            typeof option.label === "string"
              ? `border ${
                  !disabled &&
                  "hover:border-theme-primary before:hover:!bg-theme-transparent hover:!border-l-theme-primary"
                } min-w-12`
              : "custom-radio-btn border-none !bg-transparent before:!bg-transparent !border-l-transparent h-fit w-fit"
          }`}
          style={{
            width: getButtonWidth(),
            transition: !isSmallScreen
              ? "width 0.2s ease-in-out, opacity 0.2s ease-in-out"
              : "none", // Disable transition for small screens
            opacity: isVisible ? 1 : 0,
          }}
        >
          <div>
            {typeof option.label === "string" ? (
              <span>{option.label}</span>
            ) : (
              React.cloneElement(option.label, {
                disabled: disabled,
                className: `${option.label.props.className || ""} ${
                  option.value === value
                    ? isColorOption
                      ? "text-theme-primary border-2 border-transparent "
                      : "border-dotted border-2 border-theme-primary text-theme-primary bg-[#f5f5f5]"
                    : "border-dotted border-2 border-transparent"
                } ${
                  isColorOption
                    ? "hover:border-theme-transparent"
                    : "hover:border-theme-primary"
                } ${
                  !isSmallScreen
                    ? "transition-all duration-200 ease-in-out"
                    : ""
                } ${disabled ? "opacity-50 pointer-events-none" : ""}`,
                children: (
                  <>
                    {option.label.props.children}
                    {isColorOption && option.value === value && (
                      <img
                        width={18}
                        src={colorCheckMark}
                        alt="checkmark"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2"
                        style={{
                          transform: "translate(-50%, calc(-50% - 13px))",
                        }}
                      />
                    )}
                  </>
                ),
              })
            )}
          </div>
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default CustomAntdRadioGroup;
