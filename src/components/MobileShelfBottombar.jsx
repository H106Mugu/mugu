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

import React from "react";
import { Button, Tabs } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { useStores } from "../mobx/context/StoreContext";

const MobileShelfBottombar = ({ sidebarOptionsData, changedKey }) => {
  const breakpoint = useBreakpoints();
  const { submitFormStore } = useStores();

  // Map sidebar options data to items for Tabs
  const tabItems = sidebarOptionsData.map((option, index) => ({
    key: (index + 1).toString(), // Assign a unique key for each tab
    label: option.title, // Tab label
    children: option.component, // Tab content
    disabled: parseInt(changedKey) < index, // Disable tabs if they are not unlocked yet
  }));

  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} />
      <div
        className={`fixed right-0 left-0 flex py-3 px-4 bg-white shadow-xl transition-all duration-1000 ease-in-out ${
          breakpoint === "xs" || breakpoint === "sm"
            ? "bottom-0 opacity-100"
            : "-bottom-3 opacity-0"
        } `}
      >
        <div className="font-medium">Submit the design for a quote</div>
        <Button
          disabled={parseInt(changedKey) < sidebarOptionsData.length}
          size="small"
          type="primary"
          className="ms-auto"
          onClick={() => submitFormStore.setModalOpen(true)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MobileShelfBottombar;
