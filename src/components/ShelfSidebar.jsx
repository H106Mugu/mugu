import React, { useState, useEffect } from "react";
import CustomAntdRadioGroup from "./CustomAntdRadioGroup";
import {
  heightOptions as defaultHeightOptions,
  shelfTypeOption,
  widthOptions as defaultWidthOptions,
  colorOptions,
  structureElements as defaultStructureElements,
  depthOptions as defaultDepthOptions,
} from "../data/optionData";
import { Button } from "antd";
import MobileShelfBottombar from "./MobileShelfBottombar";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";
import { observer } from "mobx-react-lite";

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
    // Common width options for "stainless"
    newWidthOptions = [
      { label: "121", value: "121" },
      { label: "313", value: "313" },
      { label: "483", value: "483" },
      { label: "603", value: "603" },
    ];

    // Set structureElements for stainless
    newStructureElements = defaultStructureElements.filter((option) =>
      ["all", "withoutBack", "withTopAndBottomOnly"].includes(option.value)
    );

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
      title: "Choose Your Shelf Type",
      component: (
        <CustomAntdRadioGroup
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
      component: (
        <CustomAntdRadioGroup
          options={structureOptions}
          disabled={parseInt(changedKey) < 1}
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
      component: (
        <CustomAntdRadioGroup
          options={widthOptions}
          disabled={parseInt(changedKey) < 2}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "width", "3")
          }
        />
      ),
    },
    {
      title: "Depth (mm)",
      component: (
        <CustomAntdRadioGroup
          options={depthOptions}
          disabled={parseInt(changedKey) < 3}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "depth", "4")
          }
        />
      ),
    },
    {
      title: "Height (mm)",
      component: (
        <CustomAntdRadioGroup
          options={heightOptions}
          disabled={parseInt(changedKey) < 4}
          onChange={(ev) =>
            handleSidebarOptionsChange(ev.target.value, "height", "5")
          }
        />
      ),
    },
    {
      title: "Color",
      component: (
        <CustomAntdRadioGroup
          options={colorOptions}
          disabled={parseInt(changedKey) < 5}
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
              <div className="mb-2 font-medium w-full">{option.title}</div>
              <div className="mb-2 font-medium w-full overflow-x-auto overflow-y-hidden">
                {option.component}
              </div>
            </div>
          ))}

          <div className="text-sm">
            <span className="font-semibold">Next step:</span> Lorem ipsum dolor
            sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation.
          </div>
          <Button
            disabled={parseInt(changedKey) < sidebarOptionsData.length}
            size="large"
            type="primary"
            className="w-full py-6"
            onClick={() => submitFormStore.setModalOpen(true)}
          >
            Get a quote on this!
          </Button>
        </div>
      )}
    </>
  );
});

export default ShelfSidebar;
