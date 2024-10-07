// import React, { useState } from "react";
// import { Radio } from "antd";
// import colorCheckMark from "../assets/icons/color-check.svg";

// const CustomAntdRadioGroup = ({
//   value = null, // Default value is null
//   options = [], // Array of radio options
//   onChange = () => {}, // Default onChange is an empty function
//   defaultValue = null, // Default value is null
//   disabled = false, // Default is not disabled
//   buttonStyle = "solid", // Default button style
//   optionType = "button", // Default option type is plain radio
//   size = "large", // Default size is "default"
//   ...restProps // Any other props that need to be passed
// }) => {
//   // State to track the selected radio button value
//   const [selectedValue, setSelectedValue] = useState(defaultValue);

//   const handleChange = (e) => {
//     setSelectedValue(e.target.value); // Update the selected value
//     onChange(e); // Call the onChange handler
//   };

//   const isColorOption = options
//     ?.map((option) => option.value)
//     .includes("clear");

//   return (
//     <Radio.Group
//       // value={value}
//       onChange={handleChange}
//       defaultValue={defaultValue}
//       disabled={disabled}
//       name={name}
//       buttonStyle={buttonStyle}
//       optionType={optionType}
//       size={"middle"}
//       {...restProps}
//       className={`flex gap-0 w-full ${
//         typeof options[0]?.label === "string" ? "gap-3" : "gap-0"
//       }`}
//     >
//       {options.map((option, index) => (
//         <Radio
//           key={index}
//           value={option.value}
//           disabled={option.disabled}
//           className={`flex-1 text-center ${
//             typeof option.label === "string"
//               ? "border hover:border-theme-primary before:hover:!bg-theme-transparent hover:!border-l-theme-primary transition-all duration-300 ease-in-out"
//               : "custom-radio-btn border-none !bg-transparent before:!bg-transparent !border-l-transparent h-fit w-fit transition-all duration-300 ease-in-out"
//           } `}
//         >
//           <div>
//             {typeof option.label === "string" ? (
//               <span>{option.label}</span>
//             ) : (
//               // Clone the label element and apply the `className` dynamically
//               React.cloneElement(option.label, {
//                 disabled: option.disabled,
//                 className: `${option.label.props.className || ""} ${
//                   option.value === selectedValue
//                     ? isColorOption
//                       ? " text-theme-primary"
//                       : "border-dotted border-2 border-theme-primary text-theme-primary bg-[#f5f5f5]"
//                     : "border-dotted border-2 border-transparent"
//                 } ${
//                   isColorOption
//                     ? "hover:border-theme-transparent"
//                     : "hover:border-theme-primary"
//                 } transition-all duration-300 ease-in-out ${
//                   option.disabled ? "opacity-50 pointer-events-none" : ""
//                 }`,
//                 children: (
//                   <>
//                     {option.label.props.children}
//                     {/* Conditionally render the check mark */}
//                     {isColorOption && option.value === selectedValue && (
//                       // <IoCheckmark className="absolute top-[17%] right-[39%] text-red-400 text-2xl" />
//                       <img
//                         width={18}
//                         src={colorCheckMark}
//                         alt="checkmark"
//                         className="absolute top-1/2 left-1/2 transform -translate-x-1/2"
//                         style={{
//                           transform: "translate(-50%, calc(-50% - 13px))",
//                         }} // Calculate offset
//                       />
//                     )}
//                   </>
//                 ),
//               })
//             )}
//           </div>{" "}
//         </Radio>
//       ))}
//     </Radio.Group>
//   );
// };

// export default CustomAntdRadioGroup;

import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import colorCheckMark from "../assets/icons/color-check.svg";

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
    .includes("clear");

  const getButtonWidth = () => {
    // Calculate the width based on the number of options
    return `${100 / options.length}%`;
  };

  console.log("Vasluesssssss", value);

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
      className={`flex gap-0 w-full transition-opacity duration-300 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${typeof options[0]?.label === "string" ? "gap-3" : "gap-0"}`}
      style={{
        opacity: isVisible ? 1 : 0, // Handle opacity transition
        transition: "opacity 0.3s ease-in-out", // Smooth opacity transition
      }}
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          value={option.value}
          disabled={option.disabled}
          className={`text-center transition-all duration-300 ease-in-out ${
            typeof option.label === "string"
              ? "border hover:border-theme-primary before:hover:!bg-theme-transparent hover:!border-l-theme-primary transition-all duration-300 ease-in-out min-w-12"
              : "custom-radio-btn border-none !bg-transparent before:!bg-transparent !border-l-transparent h-fit w-fit transition-all duration-300 ease-in-out"
          }`}
          style={{
            width: getButtonWidth(), // Apply width dynamically
            transition: "width 0.5s ease-in-out, opacity 0.5s ease-in-out", // Smooth width and opacity transitions
            opacity: isVisible ? 1 : 0, // Apply opacity based on visibility
          }}
        >
          <div>
            {typeof option.label === "string" ? (
              <span>{option.label}</span>
            ) : (
              // Clone the label element and apply the `className` dynamically
              React.cloneElement(option.label, {
                disabled: option.disabled,
                className: `${option.label.props.className || ""} ${
                  option.value === value
                    ? isColorOption
                      ? "text-theme-primary border-2 border-transparent"
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
                    {isColorOption && option.value === value && (
                      <img
                        width={18}
                        src={colorCheckMark}
                        alt="checkmark"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2"
                        style={{
                          transform: "translate(-50%, calc(-50% - 13px))",
                        }} // Calculate offset
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
