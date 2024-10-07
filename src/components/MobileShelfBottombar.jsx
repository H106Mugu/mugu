// import React from "react";
// import { Tabs } from "antd";
// // import { sidebarOptionsData } from "../components/ShelfSidebar";

// const MobileShelfBottombar = ({ sidebarOptionsData }) => {
//   // Map sidebar options data to items for Tabs
//   const tabItems = sidebarOptionsData.map((option, index) => ({
//     key: index + 1, // Assign a unique key for each tab
//     label: option.title, // Tab label
//     children: option.component,
//   }));

//   return <Tabs defaultActiveKey="1" items={tabItems} />;
// };

// export default MobileShelfBottombar;

import React, { useEffect } from "react";
import { Button, Tabs } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";
import { observer } from "mobx-react-lite";

const MobileShelfBottombar = observer(({ sidebarOptionsData, changedKey }) => {
  const breakpoint = useBreakpoints();
  const { submitFormStore, configValuesStore } = useStores();

  // Filter sidebarOptionsData based on currentConfigType
  const filteredOptionsData = sidebarOptionsData.filter((option) => {
    if (configValuesStore.currentConfigType === "structure") {
      // When currentConfigType is 'structure', show all except the "Color" tab
      return (
        option.title !== "Color" && option.title !== "Choose Your Shelf Type"
      );
    } else if (configValuesStore.currentConfigType === "color") {
      // When currentConfigType is 'color', only show the "Color" tab
      return option.title === "Color";
    } else if (configValuesStore.currentConfigType === "type") {
      // When currentConfigType is 'shelfType', only show the "Shelf Type" tab
      return option.title === "Choose Your Shelf Type";
    }
    return true; // Fallback for any other state (optional)
  });

  // Map sidebar options data to items for Tabs
  const tabItems = filteredOptionsData.map((option, index) => ({
    key: (index + 1).toString(), // Assign a unique key for each tab
    label: option.title, // Tab label
    children: option.component, // Tab content
    disabled: parseInt(changedKey) < index, // Disable tabs if they are not unlocked yet
  }));

  // useEffect(() => {
  //   if (parseInt(changedKey) === sidebarOptionsData.length - 1) {
  //     configValuesStore.setCurrentConfigType("color");
  //   }
  // }, [changedKey]);

  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} className="h-[157px]" />
      <div
        className={`fixed right-0 left-0 flex py-3 px-4 bg-white shadow-xl transition-all duration-1000 ease-in-out ${
          breakpoint === "xs" || breakpoint === "sm"
            ? "bottom-0 opacity-100"
            : "-bottom-3 opacity-0"
        } `}
      >
        <div className="font-[500] text-sm">Submit the design for a quote</div>
        <Button
          disabled={parseInt(changedKey) !== sidebarOptionsData.length}
          size="small"
          type="default"
          className="ms-auto rounded-full border-theme-primary hover:!bg-[#d9d9d9]"
          onClick={() => submitFormStore.setModalOpen(true)}
        >
          <span className="text-sm">Submit</span>
        </Button>
      </div>
    </div>
  );
});

export default MobileShelfBottombar;
