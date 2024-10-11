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
import { Button, Tooltip } from "antd";
import MobileShelfBottombar from "./MobileShelfBottombar";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";
import { observer } from "mobx-react-lite";

const ShelfSidebar = observer(() => {
  const breakpoint = useBreakpoints();
  const [shelfType, setShelfType] = useState(null);
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

  //   // Utility function to generate a unique key based on the arguments
  //   const generateKey = (value, optionType, id) => {
  //     return `${value}-${optionType}-${id}`;
  //   };

  //   // Function to handle options change if not already processed
  //   const handleOptionChangeOnce = (value, optionType, id) => {
  //     const key = generateKey(value, optionType, id);
  //     if (!processedCombinations.has(key)) {
  //       handleSidebarOptionsChange(value, optionType, id);
  //       processedCombinations.add(key);
  //     }
  //   };

  //   if (shelfType === "acrylic") {
  //     // Set width and height options for acrylic
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

  //     // Ensure option change for acrylic is handled once
  //     if (newWidthOptions.length > 0)
  //       handleOptionChangeOnce(newWidthOptions[0].value, "width", "10");

  //     if (newHeightOptions.length > 0)
  //       handleOptionChangeOnce(newHeightOptions[0].value, "height", "11");

  //     if (newDepthOptions.length > 0)
  //       handleOptionChangeOnce(newDepthOptions[0].value, "depth", "12");

  //     if (newStructureElements.length > 0)
  //       handleOptionChangeOnce(
  //         newStructureElements[0].value,
  //         "structureElements",
  //         "13"
  //       );
  //   } else if (shelfType === "stainless") {
  //     // Set structureElements for stainless
  //     newStructureElements = defaultStructureElements.filter((option) =>
  //       ["all", "withoutBack", "withTopAndBottomOnly"].includes(option.value)
  //     );
  //     if (newStructureElements.length > 0)
  //       handleOptionChangeOnce(
  //         newStructureElements[0].value,
  //         "structureElements",
  //         "2"
  //       );

  //     // Common width options for "stainless"
  //     newWidthOptions = [
  //       { label: "121", value: "121" },
  //       { label: "313", value: "313" },
  //       { label: "483", value: "483" },
  //       { label: "603", value: "603" },
  //     ];

  //     if (newWidthOptions.length > 0)
  //       handleOptionChangeOnce(newWidthOptions[0].value, "width", "3");

  //     // Nested conditions within stainless
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

  //         if (newHeightOptions.length > 0)
  //           handleOptionChangeOnce(newHeightOptions[0].value, "height", "5");

  //         if (newDepthOptions.length > 0)
  //           handleOptionChangeOnce(newDepthOptions[0].value, "depth", "4");
  //       } else if (selectedWidth === "313") {
  //         newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
  //           label: d,
  //           value: d,
  //         }));

  //         if (newDepthOptions.length > 0)
  //           handleOptionChangeOnce(newDepthOptions[0].value, "depth", "4");

  //         if (selectedDepth === "121") {
  //           newHeightOptions = [{ label: "313", value: "313" }];

  //           if (newHeightOptions.length > 0)
  //             handleOptionChangeOnce(newHeightOptions[0].value, "height", "14");
  //         } else if (selectedDepth === "313") {
  //           newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
  //             label: h,
  //             value: h,
  //           }));

  //           if (newHeightOptions.length > 0)
  //             handleOptionChangeOnce(newHeightOptions[0].value, "height", "15");
  //         } else if (selectedDepth === "483" || selectedDepth === "603") {
  //           newHeightOptions = [{ label: "313", value: "313" }];

  //           if (newHeightOptions.length > 0)
  //             handleOptionChangeOnce(newHeightOptions[0].value, "height", "16");
  //         }
  //       } else if (selectedWidth === "483" || selectedWidth === "603") {
  //         newDepthOptions = [{ label: "313", value: "313" }];
  //         newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
  //           label: h,
  //           value: h,
  //         }));

  //         if (newDepthOptions.length > 0)
  //           handleOptionChangeOnce(newDepthOptions[0].value, "depth", "17");
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

  //         // alert("Here" + newHeightOptions.length);
  //         if (newDepthOptions.length > 0)
  //           handleOptionChangeOnce(newDepthOptions[0].value, "depth", "6");

  //         if (newHeightOptions.length > 0)
  //           handleOptionChangeOnce(newHeightOptions[0].value, "height", "7");
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

  //         if (newDepthOptions.length > 0)
  //           handleOptionChangeOnce(newDepthOptions[0].value, "depth", "8");

  //         if (newHeightOptions.length > 0)
  //           handleOptionChangeOnce(newHeightOptions[0].value, "height", "9");
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
    selectedStructureElement
  ) => {
    let newWidthOptions = [];
    let newDepthOptions = [];
    let newHeightOptions = [];
    let newStructureElements = [];

    // Track if we already handled sidebar options

    if (shelfType === "acrylic") {
      newWidthOptions = [
        { label: "270", value: "270" },
        { label: "370", value: "370" },
      ];
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
      newDepthOptions = [...newWidthOptions];
      newStructureElements = defaultStructureElements.filter((option) =>
        ["withTopAndBottomOnly", "withoutShelves"].includes(option.value)
      );
    } else if (shelfType === "stainless") {
      // Set structureElements for stainless
      newStructureElements = defaultStructureElements.filter((option) =>
        ["all", "withoutBack", "withTopAndBottomOnly"].includes(option.value)
      );
      // Common width options for "stainless"
      newWidthOptions = [
        { label: "121", value: "121" },
        { label: "313", value: "313" },
        { label: "483", value: "483" },
        { label: "603", value: "603" },
      ];

      if (
        selectedStructureElement === "all" ||
        selectedStructureElement === "withoutBack"
      ) {
        if (selectedWidth === "121") {
          newDepthOptions = [{ label: "313", value: "313" }];
          newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
            label: h,
            value: h,
          }));
        } else if (selectedWidth === "313") {
          newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
            label: d,
            value: d,
          }));
          if (selectedDepth === "121") {
            newHeightOptions = [{ label: "313", value: "313" }];
          } else if (selectedDepth === "313") {
            newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
              label: h,
              value: h,
            }));
          } else if (selectedDepth === "483" || selectedDepth === "603") {
            newHeightOptions = [{ label: "313", value: "313" }];
          }
        } else if (selectedWidth === "483" || selectedWidth === "603") {
          newDepthOptions = [{ label: "313", value: "313" }];
          newHeightOptions = ["121", "313", "483", "603"].map((h) => ({
            label: h,
            value: h,
          }));
        }
      } else if (selectedStructureElement === "withTopAndBottomOnly") {
        if (
          selectedWidth === "121" ||
          selectedWidth === "483" ||
          selectedWidth === "603"
        ) {
          newDepthOptions = [{ label: "313", value: "313" }];
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
        } else if (selectedWidth === "313") {
          newDepthOptions = ["121", "313", "483", "603"].map((d) => ({
            label: d,
            value: d,
          }));
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
    console.log("Changed key qdaereae:", key, value, type);
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
      const updatedOptions = getUpdatedOptions(shelfType, null, null, null);
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
        structureElement
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
              overlayClassName="bg-theme-primary rounded-lg text-white w-[330px] max-w-[400px] h-[122px]"
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
          // disabled={parseInt(changedKey) < 1}
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
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0]["width"].toString()}
          options={widthOptions}
          // disabled={parseInt(changedKey) < 2}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "width", "3")
          }
        />
      ),
    },
    {
      title: "Depth (mm)",
      category: "structure",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0]["depth"].toString()}
          options={depthOptions}
          // disabled={parseInt(changedKey) < 3}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "depth", "4")
          }
        />
      ),
    },
    {
      title: "Height (mm)",
      category: "structure",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues[0][0][
            "height"
          ].toString()}
          options={heightOptions}
          // disabled={parseInt(changedKey) < 4}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "height", "5")
          }
        />
      ),
    },
    {
      title: "Color",
      category: "color",
      component: (
        <CustomAntdRadioGroup
          value={configValuesStore.getAllConfigValues.color}
          options={colorOptions}
          // disabled={parseInt(changedKey) < 5}
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
              <div className="mb-2 font-medium w-full overflow-x-auto overflow-y-hidden">
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
    </>
  );
});

export default ShelfSidebar;
