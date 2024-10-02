import React from "react";
import { Tabs } from "antd";
// import { sidebarOptionsData } from "../components/ShelfSidebar";

const MobileShelfBottombar = ({ sidebarOptionsData }) => {
  // Map sidebar options data to items for Tabs
  const tabItems = sidebarOptionsData.map((option, index) => ({
    key: index + 1, // Assign a unique key for each tab
    label: option.title, // Tab label
    children: option.component,
  }));

  return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default MobileShelfBottombar;
