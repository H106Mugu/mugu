import React, { useState, useEffect, useLayoutEffect } from "react";
import CustomAntdRadioGroup from "./CustomAntdRadioGroup";
import {
  heightOptions as defaultHeightOptions,
  shelfTypeOption,
  widthOptions as defaultWidthOptions,
  colorOptions,
  structureElements as defaultStructureElements,
  depthOptions as defaultDepthOptions,
} from "../data/optionData";
import { Button, message, Tooltip } from "antd";
import MobileShelfBottombar from "./MobileShelfBottombar";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";
import { observer } from "mobx-react-lite";
import { IoMdInformation } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import withTopAndBottomOnly from "../assets/images/structure/withTopAndBottomOnly.png";
import withTopAndBottomOnlyAcrylic from "../assets/images/structure/withTopAndBottomOnlyAcrylic.png";

// Set to track called changes
const calledChanges = new Set();

const ShelfSidebar = observer(() => {
  const breakpoint = useBreakpoints();
  const [shelfType, setShelfType] = useState(null);
  const [previousShelfType, setPreviousShelfType] = useState(shelfType); // Track previous shelfType

  const [width, setWidth] = useState(null);
  const [depth, setDepth] = useState(null);
  const [height, setHeight] = useState(null);
  const [structureElement, setStructureElement] = useState(null); // Added structureElement here

  const [widthOptions, setWidthOptions] = useState(defaultWidthOptions);
  const [depthOptions, setDepthOptions] = useState(defaultDepthOptions);
  const [heightOptions, setHeightOptions] = useState(defaultHeightOptions);
  const [structureOptions, setStructureOptions] = useState(
    defaultStructureElements
  );
  const [changedKey, setChangedKey] = useState("0");
  const { configValuesStore, submitFormStore } = useStores();

  const [messageApi, contextHolder] = message.useMessage();

  // const getUpdatedOptions = (
  //   shelfType,
  //   selectedWidth,
  //   selectedDepth,
  //   selectedStructureElement
  // ) => {
  //   let newWidthOptions = [];
  //   let newDepthOptions = [];
  //   let newHeightOptions = [];
  //   let newStructureElements = [];

  //   if (shelfType === "acrylic") {
  //     newWidthOptions = [
  //       { label: "270", value: "270" },
  //       { label: "370", value: "370" },
  //     ];
  //     newHeightOptions = [
  //       { label: "121", value: "121" },
  //       { label: "180", value: "180" },
  //       { label: "200", value: "200" },
  //       { label: "270", value: "270" },
  //       { label: "313", value: "313" },
  //       { label: "370", value: "370" },
  //       { label: "483", value: "483" },
  //       { label: "603", value: "603" },
  //     ];
  //     newDepthOptions = [...newWidthOptions];
  //     newStructureElements = defaultStructureElements.filter((option) =>
  //       ["withTopAndBottomOnly", "withoutShelves"].includes(option.value)
  //     );
  //   } else if (shelfType === "stainless") {
  //     // Set structureElements for stainless
  //     newStructureElements = defaultStructureElements.filter((option) =>
  //       ["all", "withoutBack", "withTopAndBottomOnly"].includes(option.value)
  //     );
  //     // Common width options for "stainless"
  //     newWidthOptions = [
  //       { label: "121", value: "121" },
  //       { label: "313", value: "313" },
  //       { label: "483", value: "483" },
  //       { label: "603", value: "603" },
  //     ];

  //     if (
  //       selectedStructureElement === "all" ||
  //       selectedStructureElement === "withoutBack"
  //     ) {
  //       if (selectedWidth === "121") {
  //         newDepthOptions = [{ label: "313", value: "313" }];
  //         newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
  //           label: h,
  //           value: h,
  //         }));
  //       } else if (selectedWidth === "313") {
  //         newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
  //           label: d,
  //           value: d,
  //         }));
  //         if (selectedDepth === "121") {
  //           newHeightOptions = [{ label: "313", value: "313" }];
  //         } else if (selectedDepth === "313") {
  //           newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
  //             label: h,
  //             value: h,
  //           }));
  //         } else if (selectedDepth === "483" || selectedDepth === "603") {
  //           newHeightOptions = [{ label: "313", value: "313" }];
  //         }
  //       } else if (selectedWidth === "483" || selectedWidth === "603") {
  //         newDepthOptions = [{ label: "313", value: "313" }];
  //         newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
  //           label: h,
  //           value: h,
  //         }));
  //       }
  //     } else if (selectedStructureElement === "withTopAndBottomOnly") {
  //       if (
  //         selectedWidth === "121" ||
  //         selectedWidth === "483" ||
  //         selectedWidth === "603"
  //       ) {
  //         newDepthOptions = [{ label: "313", value: "313" }];
  //         newHeightOptions = [
  //           "121",
  //           "180",
  //           "200",
  //           "270",
  //           "313",
  //           "370",
  //           "483",
  //           "603",
  //         ].map((h) => ({ label: h, value: h }));
  //       } else if (selectedWidth === "313") {
  //         newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
  //           label: d,
  //           value: d,
  //         }));
  //         newHeightOptions = [
  //           "121",
  //           "180",
  //           "200",
  //           "270",
  //           "313",
  //           "370",
  //           "483",
  //           "603",
  //         ].map((h) => ({ label: h, value: h }));
  //       }
  //     }
  //   }

  //   return {
  //     widthOptions: newWidthOptions,
  //     depthOptions: newDepthOptions,
  //     heightOptions: newHeightOptions,
  //     structureElements: newStructureElements,
  //   };
  // };

  const getUpdatedOptions = (
    shelfType,
    selectedWidth,
    selectedDepth,
    selectedStructureElement,
    previousShelfType
  ) => {
    let newWidthOptions = [];
    let newDepthOptions = [];
    let newHeightOptions = [];
    let newStructureElements = [];

    // Function to handle change only once
    const handleChangeOnce = (value, type, key) => {
      const id = `${type}-${key}`; // Unique identifier
      if (!calledChanges.has(id)) {
        calledChanges.add(id);
        handleSidebarOptionsChange(value, type, key);
      }
    };

    // Reset the set if shelfType changes
    if (shelfType !== previousShelfType) {
      calledChanges.clear();
    }

    if (shelfType === "acrylic") {
      newWidthOptions = [
        { label: "270", value: "270" },
        { label: "370", value: "370" },
      ];
      handleChangeOnce(newWidthOptions[0].value, "width", "1");

      newHeightOptions = [
        { label: "121", value: "121" },
        { label: "180", value: "180" },
        { label: "200", value: "200" },
        { label: "270", value: "270" },
        { label: "313", value: "313" },
        { label: "370", value: "370" },
        { label: "483", value: "483" },
        { label: "603", value: "603" },
      ];
      handleChangeOnce(newHeightOptions[0].value, "height", "2");

      newDepthOptions = [...newWidthOptions];
      handleChangeOnce(newDepthOptions[0].value, "depth", "3");

      newStructureElements = defaultStructureElements.filter((option) =>
        ["withTopAndBottomOnly", "withoutShelves"].includes(option.value)
      );
      newStructureElements = newStructureElements.map((option) => {
        if (option.value === "withTopAndBottomOnly") {
          return {
            ...option, // Keep existing properties
            label: (
              <div className="flex flex-col items-center justify-start pt-5 h-full min-h-[111px] w-full px-1">
                <img
                  src={withTopAndBottomOnlyAcrylic}
                  alt="With top and bottom only"
                  className="w-[53px] h-[53px]"
                />
                <p className="text-xs leading-3">With top and bottom only</p>
              </div>
            ),
          };
        }

        // Return the option unchanged if no condition is met
        return option;
      });
      handleChangeOnce(newStructureElements[0].value, "structureElements", "4");
    } else if (shelfType === "stainless") {
      newStructureElements = defaultStructureElements.filter((option) =>
        ["all", "withoutBack", "withTopAndBottomOnly"].includes(option.value)
      );

      newStructureElements = newStructureElements.map((option) => {
        if (option.value === "withTopAndBottomOnly") {
          return {
            ...option, // Keep existing properties
            label: (
              <div className="flex flex-col items-center justify-start pt-5 h-full min-h-[111px] w-full px-1">
                <img
                  src={withTopAndBottomOnly}
                  alt="With top and bottom only"
                  className="w-[53px] h-[53px]"
                />
                <p className="text-xs leading-3">With top and bottom only</p>
              </div>
            ),
          };
        }

        // Return the option unchanged if no condition is met
        return option;
      });

      handleChangeOnce(
        newStructureElements[0].value,
        "structureElements",
        "20"
      );

      newWidthOptions = [
        { label: "121", value: "121" },
        { label: "313", value: "313" },
        { label: "483", value: "483" },
        { label: "603", value: "603" },
      ];
      handleChangeOnce(newWidthOptions[0].value, "width", "5");

      if (
        selectedStructureElement === "all" ||
        selectedStructureElement === "withoutBack"
      ) {
        if (selectedWidth === "121") {
          newDepthOptions = [{ label: "313", value: "313" }];
          handleChangeOnce(newDepthOptions[0].value, "depth", "6");

          newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
            label: h,
            value: h,
          }));
          handleChangeOnce(newHeightOptions[0].value, "height", "7");
        } else if (selectedWidth === "313") {
          newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
            label: d,
            value: d,
          }));
          handleChangeOnce(newDepthOptions[1].value, "depth", "8");

          if (selectedDepth === "121") {
            newHeightOptions = [{ label: "313", value: "313" }];
            handleChangeOnce(newHeightOptions[0].value, "height", "9");
          } else if (selectedDepth === "313") {
            newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
              label: h,
              value: h,
            }));
            handleChangeOnce(newHeightOptions[0].value, "height", "10");
          } else if (selectedDepth === "483" || selectedDepth === "603") {
            newHeightOptions = [{ label: "313", value: "313" }];
            handleChangeOnce(newHeightOptions[0].value, "height", "11");
          }
        } else if (selectedWidth === "483" || selectedWidth === "603") {
          newDepthOptions = [{ label: "313", value: "313" }];
          handleChangeOnce(newDepthOptions[0].value, "depth", "12");

          newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
            label: h,
            value: h,
          }));
          handleChangeOnce(newHeightOptions[0].value, "height", "13");
        }
      } else if (selectedStructureElement === "withTopAndBottomOnly") {
        if (
          selectedWidth === "121" ||
          selectedWidth === "483" ||
          selectedWidth === "603"
        ) {
          newDepthOptions = [{ label: "313", value: "313" }];
          handleChangeOnce(newDepthOptions[0].value, "depth", "14");

          newHeightOptions = [
            "121",
            "180",
            "200",
            "270",
            "313",
            "370",
            "483",
            "603",
          ].map((h) => ({ label: h, value: h }));
          handleChangeOnce(newHeightOptions[0].value, "height", "15");
        } else if (selectedWidth === "313") {
          newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
            label: d,
            value: d,
          }));
          handleChangeOnce(newDepthOptions[1].value, "depth", "16");

          newHeightOptions = [
            "121",
            "180",
            "200",
            "270",
            "313",
            "370",
            "483",
            "603",
          ].map((h) => ({ label: h, value: h }));
          handleChangeOnce(newHeightOptions[0].value, "height", "17");
        }
      }
    }

    return {
      widthOptions: newWidthOptions,
      depthOptions: newDepthOptions,
      heightOptions: newHeightOptions,
      structureElements: newStructureElements,
    };
  };

  const handleSidebarOptionsChange = (value, type, key) => {
    configValuesStore.setConfigValue(type, value);
    setChangedKey(key);
    switch (type) {
      case "shelfType":
        resetSelections();
        setShelfType(value);
        setStructureElement(null); // Reset structure element
        // console.log(configValuesStore.getAllConfigValues());
        break;
      case "structureElements":
        setStructureElement(value); // Set structure element
        // console.log(configValuesStore.getAllConfigValues());
        break;
      case "width":
        setWidth(value);
        // console.log(configValuesStore.getAllConfigValues());
        break;
      case "depth":
        setDepth(value);
        // console.log(configValuesStore.getAllConfigValues());
        break;
      case "height":
        setHeight(value);
        // console.log(configValuesStore.getAllConfigValues());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Update the previous shelf type whenever the current shelf type changes
    setPreviousShelfType(shelfType);
  }, [shelfType]);

  useLayoutEffect(() => {
    handleSidebarOptionsChange(
      configValuesStore.getAllConfigValues.shelfType,
      "shelfType",
      "1"
    );
  }, [configValuesStore]);

  // useEffect to update options based on shelfType
  useEffect(() => {
    if (shelfType) {
      const updatedOptions = getUpdatedOptions(
        shelfType,
        null,
        null,
        null,
        previousShelfType
      );
      setWidthOptions(updatedOptions.widthOptions);
      setDepthOptions(updatedOptions.depthOptions);
      setHeightOptions(updatedOptions.heightOptions);
      setStructureOptions(updatedOptions.structureElements);
    }
  }, [shelfType]);

  // useEffect to update options based on structureElement, width, and depth
  useEffect(() => {
    if (shelfType && structureElement) {
      const updatedOptions = getUpdatedOptions(
        shelfType,
        width,
        depth,
        structureElement,
        previousShelfType
      ); // Passing structureElement here
      setWidthOptions(updatedOptions.widthOptions);
      setDepthOptions(updatedOptions.depthOptions);
      setHeightOptions(updatedOptions.heightOptions);
    }
  }, [structureElement, width, depth, shelfType]); // Added structureElement dependency

  const resetSelections = () => {
    setWidth(null);
    setDepth(null);
    setHeight(null);
  };

  const sidebarOptionsData = [
    {
      title: (
        <div className="flex items-center gap-2 w-full">
          <div>Choose Your Shelf Type</div>
          <div>
            <Tooltip
              autoAdjustOverflow={true}
              color="black"
              wrapperClassName="flex items-center gap-1"
              overlayClassName="bg-theme-primary rounded-lg text-white w-[85%] max-w-[330px] h-[125px] border border-[#606060] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.2)]"
              title={
                <div className="text-center text-xs p-2">
                  <div className="leading-[14.65px] mb-2">
                    <div className="text-[#949494] font-[500]">
                      Acrylic Panel Shelves
                    </div>
                    <div className="text-white font-[400]">
                      Open-sided design, supported by shelf supporters. They
                      cannot create walls
                    </div>
                  </div>
                  <div className="leading-[14.65px]">
                    <div className="text-[#949494] font-[500]">
                      Stainless Steel Panel Shelves
                    </div>
                    <div className="text-white font-[400]">
                      Attach directly to the frame without supporters and create
                      walls
                    </div>
                  </div>
                </div>
              }
              placement={
                breakpoint === "xs" || breakpoint === "sm" ? "top" : "bottom"
              }
            >
              <div className="bg-theme-primary rounded-full text-white text-[10px] p-px cursor-pointer w-3 h-3 flex justify-center items-center">
                i
              </div>
              {/*Info icon */}
            </Tooltip>
          </div>
        </div>
      ),
      category: "type",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues.shelfType}
          options={shelfTypeOption}
          disabled={false}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "shelfType", "1")
          }
        />
      ),
    },
    {
      title: "Structure Elements",
      category: "structure",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues.structureElements}
          options={structureOptions}
          onChange={(ev) =>
            handleSidebarOptionsChange(
              ev.target.value,
              "structureElements",
              "2"
            )
          }
        />
      ),
    },
    {
      title: "Width (mm)",
      category: "structure",
      isDisabled: configValuesStore.selectionType === "panel",
      disabledMessage:
        "To configure dimensions, please choose the element from the options and then select it in the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0]["width"].toString()}
          options={widthOptions}
          disabled={
            breakpoint === "xs" || breakpoint === "sm"
              ? false
              : configValuesStore.selectionType === "panel"
          }
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "width", "3")
          }
        />
      ),
    },
    {
      title: "Depth (mm)",
      category: "structure",
      isDisabled: configValuesStore.selectionType === "panel",
      disabledMessage:
        "To configure dimensions, please choose the element from the options and then select it in the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0]["depth"].toString()}
          options={depthOptions}
          disabled={
            breakpoint === "xs" || breakpoint === "sm"
              ? false
              : configValuesStore.selectionType === "panel"
          }
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "depth", "4")
          }
        />
      ),
    },
    {
      title: "Height (mm)",
      category: "structure",
      isDisabled: configValuesStore.selectionType === "panel",
      disabledMessage:
        "To configure dimensions, please choose the element from the options and then select it in the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0][
            "height"
          ].toString()}
          options={heightOptions}
          disabled={
            breakpoint === "xs" || breakpoint === "sm"
              ? false
              : configValuesStore.selectionType === "panel"
          }
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "height", "5")
          }
        />
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 w-full">
          <div>Colour</div>
          <div>
            <Tooltip
              autoAdjustOverflow={true}
              color="black"
              overlayClassName="bg-theme-primary rounded-lg text-white w-[80%] max-w-[330px] h-[55px] border border-[#606060] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.2)]"
              title={
                <div className="text-center text-xs p-2">
                  <div className="leading-[14.65px] mb-2">
                    <div className="text-white font-[400]">
                      All panels will have the same colour for the stainless
                      panel shelf type.
                    </div>
                  </div>
                </div>
              }
              placement={
                breakpoint === "xs" || breakpoint === "sm"
                  ? "topRight"
                  : "bottom"
              }
            >
              <div className="bg-theme-primary rounded-full text-white text-[10px] p-px cursor-pointer w-3 h-3 flex justify-center items-center">
                i
              </div>
              {/*Info icon */}
            </Tooltip>
          </div>
        </div>
      ),
      category: "color",
      isDisabled:
        configValuesStore.selectionType === "element" ||
        configValuesStore.configValues.structureElements === "withoutShelves",
      disabledMessage:
        configValuesStore.selectionType === "element"
          ? "To configure the colour, please choose the panel from the options and then select it in the 3D shelf."
          : "As the selected element is without shelves, the panel won't have any colour configuration.",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues.color}
          options={colorOptions}
          disabled={
            breakpoint === "xs" || breakpoint === "sm"
              ? configValuesStore.configValues.structureElements ===
                "withoutShelves"
              : configValuesStore.selectionType === "element" ||
                configValuesStore.configValues.structureElements ===
                  "withoutShelves"
          }
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "color", "6")
          }
        />
      ),
    },
  ];

  return (
    <>
      {breakpoint === "xs" || breakpoint === "sm" ? (
        <MobileShelfBottombar
          sidebarOptionsData={sidebarOptionsData}
          changedKey={changedKey}
        />
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {sidebarOptionsData.map((option, index) => (
            <div key={index}>
              <div className="mb-2 text-sm font-medium w-full">
                {option.title}
              </div>
              <div
                className="mb-2 font-medium w-full overflow-x-auto overflow-y-hidden"
                onClick={() => {
                  if (!option.isDisabled) return;

                  messageApi.open({
                    type: "info",
                    icon: (
                      <IoMdInformation className="text-black bg-white text-xs me-3 rounded-full" />
                    ),
                    duration: 5,
                    content: (
                      <div className="bg-theme-primary text-white text-sm flex items-center">
                        {option.disabledMessage || "This option is disabled."}
                        <IoCloseOutline
                          className="text-white text-lg ms-3 cursor-pointer"
                          onClick={() => messageApi.destroy()}
                        />
                      </div>
                    ),
                  });
                }}
              >
                {option.component}
              </div>
            </div>
          ))}

          <div className="text-sm">Submit the design for a quote</div>
          <Button
            // disabled={parseInt(changedKey) < sidebarOptionsData.length}
            size="large"
            type="default"
            className="w-full py-6 rounded-full"
            onClick={() => submitFormStore.setModalOpen(true)}
          >
            <span className="text-[16px]">Submit</span>
          </Button>
        </div>
      )}
      {contextHolder}
    </>
  );
});

export default ShelfSidebar;
