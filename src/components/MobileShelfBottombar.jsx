import React, { useEffect, useState } from "react";
import { Button, message, Tabs } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";
import { observer } from "mobx-react-lite";
import { IoMdInformation } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const MobileShelfBottombar = observer(({ sidebarOptionsData, changedKey }) => {
  const [isColorTabVisitedOnce, setIsColorTabVisitedOnce] = useState(false);
  const breakpoint = useBreakpoints();
  const { submitFormStore, configValuesStore } = useStores();
  const [messageApi, contextHolder] = message.useMessage();

  // Filter sidebarOptionsData based on currentConfigType
  const filteredOptionsData = sidebarOptionsData.filter((option) => {
    if (configValuesStore.currentConfigType === "structure") {
      // When currentConfigType is 'structure', show all except the "Color" tab
      return option.category !== "color" && option.category !== "type";
    } else if (configValuesStore.currentConfigType === "color") {
      // When currentConfigType is 'color', only show the "Color" tab
      return option.category === "color";
    } else if (configValuesStore.currentConfigType === "type") {
      // When currentConfigType is 'shelfType', only show the "Shelf Type" tab
      return option.category === "type";
    }
    return true; // Fallback for any other state (optional)
  });

  // Map sidebar options data to items for Tabs
  const tabItems = filteredOptionsData.map((option, index) => ({
    key: (index + 1).toString(), // Assign a unique key for each tab
    label: option.title, // Tab label
    children: (
      <div
        onClick={() => {
          if (option.component.props.disabled) {
            messageApi.open({
              type: "info",
              icon: (
                <IoMdInformation className="text-black min-w-4 min-h-4 bg-white text-xs me-3 rounded-full" />
              ),
              duration: 5,
              content: (
                <div className="bg-theme-primary text-white text-sm flex items-center">
                  {
                    "As the selected element is without shelves, the panel won't have any colour configuration."
                  }
                  <IoCloseOutline
                    className="text-white text-lg min-w-4 ms-3 cursor-pointer"
                    onClick={() => messageApi.destroy()}
                  />
                </div>
              ),
            });
          }
        }}
      >
        {option.component}
      </div>
    ), // Tab content
    // disabled: parseInt(changedKey) < index, // Disable tabs if they are not unlocked yet
  }));

  console.log("Changedkey", configValuesStore.currentConfigType);

  useEffect(() => {
    if (
      configValuesStore.currentConfigType === "color" &&
      !isColorTabVisitedOnce
    ) {
      setIsColorTabVisitedOnce(true);
    }
  }, [configValuesStore.currentConfigType]);

  console.log("isColorTabVisitedOnce", isColorTabVisitedOnce);

  return (
    <>
      <div>
        <Tabs defaultActiveKey="1" items={tabItems} className="h-[157px]" />
        <div
          className={`fixed right-0 left-0 py-1 px-3 flex items-center bg-white shadow-xl transition-all duration-1000 ease-in-out ${
            breakpoint === "xs" || breakpoint === "sm"
              ? "bottom-0 opacity-100"
              : "-bottom-3 opacity-0"
          } `}
        >
          <div className="font-[500] text-sm">
            Submit the design for a quote
          </div>
          <Button
            disabled={!isColorTabVisitedOnce}
            size="middle"
            type="default"
            className="ms-auto rounded-full border-theme-primary hover:!bg-[#d9d9d9]"
            onClick={() => submitFormStore.setModalOpen(true)}
          >
            <span className="text-sm">Submit</span>
          </Button>
        </div>
      </div>
      {contextHolder}
    </>
  );
});

export default MobileShelfBottombar;
