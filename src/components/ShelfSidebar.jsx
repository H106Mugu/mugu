/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useLayoutEffect } from "react";
import CustomAntdRadioGroup from "./CustomAntdRadioGroup";
import {
  heightOptions as defaultHeightOptions,
  shelfTypeOption,
  widthOptions as defaultWidthOptions,
  acrylicColorOptions,
  stainlessColorOptions,
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
import { addImages } from "../Canvas-3d/Utils/ImageUtils";

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
  const { configValuesStore, submitFormStore, loadingStore } = useStores();

  const selectedCuboid = configValuesStore.getSelectedCuboid;

  const [messageApi, contextHolder] = message.useMessage();

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
      handleChangeOnce(newHeightOptions[3].value, "height", "2");

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
              <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
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
              <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
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
      handleChangeOnce(newWidthOptions[1].value, "width", "5");

      if (
        selectedStructureElement === "all" ||
        selectedStructureElement === "withoutBack"
      ) {
        if (selectedWidth?.toString() === "121") {
          newDepthOptions = [{ label: "313", value: "313" }];
          handleChangeOnce(newDepthOptions[0].value, "depth", "6");

          if (selectedStructureElement === "all") {
            newHeightOptions = ["313"].map((h) => ({
              label: h,
              value: h,
            })); //reducing height options to only 313 for structure all
          }

          if (selectedStructureElement === "withoutBack") {
            newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
              label: h,
              value: h,
            }));
          }

          handleChangeOnce(
            newHeightOptions[selectedStructureElement === "all" ? 0 : 1].value,
            "height",
            "7"
          );
        } else if (selectedWidth?.toString() === "313") {
          newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
            label: d,
            value: d,
          }));
          handleChangeOnce(newDepthOptions[1].value, "depth", "8");

          if (selectedDepth?.toString() === "121") {
            newHeightOptions = [{ label: "313", value: "313" }];
            handleChangeOnce(newHeightOptions[0].value, "height", "9");
          } else if (selectedDepth?.toString() === "313") {
            // newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
            //   label: h,
            //   value: h,
            // }));
            // handleChangeOnce(newHeightOptions[1].value, "height", "10");

            if (selectedStructureElement === "all") {
              newHeightOptions = ["313"].map((h) => ({
                label: h,
                value: h,
              })); //reducing height options to only 313 for structure all
            }

            if (selectedStructureElement === "withoutBack") {
              newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
                label: h,
                value: h,
              }));
            }

            handleChangeOnce(
              newHeightOptions[selectedStructureElement === "all" ? 0 : 1]
                .value,
              "height",
              "10"
            );
          } else if (
            selectedDepth?.toString() === "483" ||
            selectedDepth?.toString() === "603"
          ) {
            newHeightOptions = [{ label: "313", value: "313" }];
            handleChangeOnce(newHeightOptions[0].value, "height", "11");
          }
        } else if (
          selectedWidth?.toString() === "483" ||
          selectedWidth?.toString() === "603"
        ) {
          newDepthOptions = [{ label: "313", value: "313" }];

          handleChangeOnce(newDepthOptions[0].value, "depth", "12");

          if (
            selectedDepth?.toString() === "121" ||
            selectedDepth?.toString() === "483" ||
            selectedDepth?.toString() === "603"
          ) {
            handleSidebarOptionsChange("313", "depth", "43");
          } // empty depth bug fix

          if (selectedStructureElement === "all") {
            newHeightOptions = ["313"].map((h) => ({
              label: h,
              value: h,
            })); //reducing height options to only 313 for structure all
          }

          if (selectedStructureElement === "withoutBack") {
            newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
              label: h,
              value: h,
            }));
          }

          handleChangeOnce(
            newHeightOptions[selectedStructureElement === "all" ? 0 : 1].value,
            "height",
            "13"
          );
        }
      } else if (selectedStructureElement === "withTopAndBottomOnly") {
        if (
          selectedWidth?.toString() === "121" ||
          selectedWidth?.toString() === "483" ||
          selectedWidth?.toString() === "603"
        ) {
          newDepthOptions = [{ label: "313", value: "313" }];
          handleChangeOnce(newDepthOptions[0].value, "depth", "14");

          if (
            selectedDepth?.toString() === "121" ||
            selectedDepth?.toString() === "483" ||
            selectedDepth?.toString() === "603"
          ) {
            handleSidebarOptionsChange("313", "depth", "53");
          } // empty depth bug fix

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
        } else if (selectedWidth?.toString() === "313") {
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
          handleChangeOnce(newHeightOptions[4].value, "height", "17");
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
        break;
      case "structureElements":
        setStructureElement(value); // Set structure element
        break;
      case "width":
        setWidth(value);
        break;
      case "depth":
        setDepth(value);
        break;
      case "height":
        setHeight(value);
        break;
      default:
        break;
    }
  };

  const getValuesFromSelectedCuboid = () => {
    const { rawIndex, colIndex } = configValuesStore.getSelectedCuboid;

    const widthValue = configValuesStore.hasCuboidAt(rawIndex, colIndex)
      ? configValuesStore.getConfigValue("width", rawIndex, colIndex).toString()
      : "0"; // Provide a default value if there is no cuboid at that index

    const heightValue = configValuesStore.hasCuboidAt(rawIndex, colIndex)
      ? configValuesStore
          .getConfigValue("height", rawIndex, colIndex)
          .toString()
      : "0"; // Provide a default value if there is no cuboid at that index

    const depthValue = configValuesStore.hasCuboidAt(rawIndex, colIndex)
      ? configValuesStore.getConfigValue("depth", rawIndex, colIndex).toString()
      : "0"; // Provide a default value if there is no cuboid at that index
    return [widthValue, heightValue, depthValue];
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

  useEffect(() => {
    const row = selectedCuboid.rawIndex;
    const column = selectedCuboid.colIndex;
    if (
      row !== null &&
      column !== null &&
      configValuesStore.hasCuboidAt(row, column)
    ) {
      // Fetch height and width for the selected cuboid and update the state
      const selectedHeight = configValuesStore.getConfigValue(
        "height",
        row,
        column
      );
      const selectedWidth = configValuesStore.getConfigValue(
        "width",
        row,
        column
      );

      const selectedDepth = configValuesStore.getConfigValue(
        "depth",
        row,
        column
      );

      setHeight(selectedHeight);
      setWidth(selectedWidth);
      setDepth(selectedDepth);
    }
  }, [selectedCuboid, configValuesStore]);

  const resetSelections = () => {
    setWidth(null);
    setDepth(null);
    setHeight(null);
  };

  const isDimensionDisabled =
    configValuesStore.getSelectedCuboid.rawIndex === null ||
    configValuesStore.getSelectedCuboid.colIndex === null;

  const isColorDisabled =
    (configValuesStore.getAllConfigValues.shelfType !== "stainless" &&
      configValuesStore.getSelectedPanel === null) ||
    configValuesStore.getAllConfigValues.structureElements === "withoutShelves";

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
      tourClass: "tour-btn-type-desktop",
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
      tourClass: "tour-btn-structure-desktop",
    },
    {
      title: "Width (mm)",
      category: "structure",
      isDisabled: isDimensionDisabled,
      disabledMessage:
        "To configure dimensions, please select any element within the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[
            parseInt(configValuesStore.getSelectedCuboidIndex.rawIndex) || 0
          ][parseInt(configValuesStore.getSelectedCuboidIndex.colIndex) || 0][
            "width"
          ].toString()}
          options={widthOptions}
          disabled={isDimensionDisabled}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "width", "3")
          }
        />
      ),
      tourClass: "tour-btn-dimension-desktop-width",
    },
    {
      title: "Depth (mm)",
      category: "structure",
      isDisabled: isDimensionDisabled,
      disabledMessage:
        "To configure dimensions, please select any element within the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={getValuesFromSelectedCuboid()[2]}
          options={depthOptions}
          disabled={isDimensionDisabled}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "depth", "4")
          }
        />
      ),
      tourClass: "tour-btn-dimension-desktop-depth",
    },
    {
      title: "Height (mm)",
      category: "structure",
      isDisabled: isDimensionDisabled,
      disabledMessage:
        "To configure dimensions, please select any element within the 3D shelf.",
      component: (
        <CustomAntdRadioGroup
          value={getValuesFromSelectedCuboid()[1]}
          options={heightOptions}
          disabled={isDimensionDisabled}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "height", "5")
          }
        />
      ),
      tourClass: "tour-btn-dimension-desktop-height",
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
      isDisabled: isColorDisabled,
      disabledMessage:
        configValuesStore.getAllConfigValues.structureElements ===
        "withoutShelves"
          ? "As the selected element is without shelves, there are no panels available to configure their colour."
          : configValuesStore.getSelectedPanel === null
          ? "To configure the colour, please select any panel from the 3D shelf."
          : "This option is disabled.",
      component: (
        <CustomAntdRadioGroup
          value={
            configValuesStore.getAllConfigValues.shelfType === "acrylic"
              ? configValuesStore.getColorRows[
                  configValuesStore.getSelectedPanel
                ]
              : configValuesStore.getAllConfigValues.shelfType === "stainless"
              ? configValuesStore.getAllConfigValues.color
              : []
          }
          options={
            configValuesStore.getAllConfigValues.shelfType === "acrylic"
              ? acrylicColorOptions
              : configValuesStore.getAllConfigValues.shelfType === "stainless"
              ? stainlessColorOptions
              : []
          }
          disabled={isColorDisabled}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "color", "6")
          }
        />
      ),
      tourClass: "tour-btn-color-desktop",
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
            <div key={index} className={`${option.tourClass || ""} md:px-6`}>
              <div className="mb-2 text-sm font-medium w-full">
                {option.title}
              </div>
              <div
                className={`mb-2 font-medium w-full overflow-x-auto overflow-y-hidden md:min-h-9  ${
                  option?.title === "Height (mm)" ? "pb-1" : ""
                }`}
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

          <div className="tour-btn-submit-desktop py-2 px-6">
            <div className="text-sm mb-2">Submit the design for a quote</div>
            <Button
              // disabled={parseInt(changedKey) < sidebarOptionsData.length}
              size="large"
              type="default"
              className="w-full py-6 rounded-full"
              onClick={async () => {
                loadingStore.setLoader(true, "Loading");
                await addImages();
                loadingStore.setLoader(false, "");
                submitFormStore.setModalOpen(true);
              }}
            >
              <span className="text-[16px]">Submit</span>
            </Button>
          </div>
        </div>
      )}
      {contextHolder}
    </>
  );
});

export default ShelfSidebar;
