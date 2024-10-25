/* eslint-disable no-unused-vars */
// CuboidRenderer.js
import React, { useEffect, useRef, useState } from "react";
import Model from "../Models/Model";
import CreateButton from "../Buttons/CreateButton";
import { isOnRight, isOnTop, handleAddCuboid } from "../Utils/PositionsUtils";
import { CubeComponent } from "../Models/CubeComponent";
import configValuesStore from "../../mobx/stores/configValuesStore";
import { observer } from "mobx-react-lite"; // Import observer from mobx-react-lite
import useBreakpoints from "../../hooks/useBreakpoints";

const CuboidRenderer = observer(({ cuboidData }) => {
  const {
    key,
    width,
    height,
    depth,
    startWidth,
    startHeight,
    raw_index,
    col_index,
  } = cuboidData;
  const [isVisible, setIsVisible] = useState(false);
  const [isVisiblePanelTop, setIsVisiblePanelTop] = useState(false);
  const [isVisiblePanelBottom, setIsVisiblePanelBottom] = useState(false);
  const breakpoint = useBreakpoints();

  useEffect(() => {
    const checkVisible =
      configValuesStore.selectedCuboid.rawIndex === raw_index &&
      configValuesStore.selectedCuboid.colIndex === col_index &&
      ((breakpoint !== "xs" && breakpoint !== "sm") ||
        configValuesStore.currentConfigType === "structure");

    setIsVisible(checkVisible);
    const checkVisiblePanelTop =
      configValuesStore.selectedPanel.rawIndex === raw_index + 1 &&
      ((breakpoint !== "xs" && breakpoint !== "sm") ||
        configValuesStore.currentConfigType === "color");
    setIsVisiblePanelTop(checkVisiblePanelTop);
    const checkVisiblePanelBottom =
      configValuesStore.selectedPanel.rawIndex === raw_index &&
      ((breakpoint !== "xs" && breakpoint !== "sm") ||
        configValuesStore.currentConfigType === "color");
    setIsVisiblePanelBottom(checkVisiblePanelBottom);
    if (configValuesStore.selectionType === "panel") {
      setIsVisible(false);
      // configValuesStore.setSelectedCuboid(null, null);
    } else if (configValuesStore.selectionType === "element") {
      setIsVisiblePanelTop(false);
      setIsVisiblePanelBottom(false);
      // configValuesStore.setSelectedPanel(null);
    }
  }, [
    configValuesStore.selectedCuboid,
    configValuesStore.selectionType,
    configValuesStore.selectedPanel.rawIndex,
    configValuesStore.currentConfigType,
    raw_index,
    col_index,
  ]);

  useEffect(() => {
    if (configValuesStore.selectionType === "element") {
      configValuesStore.setSelectedPanel(null);
    } else if (configValuesStore.selectionType === "panel") {
      configValuesStore.setSelectedCuboid(null, null);
    }
  }, [configValuesStore.selectionType]);

  const handleCubeSelect = (rawIndex, colIndex) => {
    const prevShelfType = configValuesStore.getPreviousShelfType;
    const currentShelfType = configValuesStore.getAllConfigValues.shelfType;

    console.log(
      "prevShelfType, currentShelfType",
      prevShelfType,
      currentShelfType
    );

    // Compare previous shelfType with current shelfType
    if (prevShelfType && prevShelfType !== currentShelfType) {
      configValuesStore.setPreviousShelfType(
        configValuesStore.getAllConfigValues.shelfType
      );
      if (configValuesStore.getAllConfigValues.shelfType === "stainless") {
        configValuesStore.setConfigDimensionAtPosition(
          "width",
          313,
          rawIndex,
          colIndex
        );
        configValuesStore.setConfigDimensionAtPosition(
          "depth",
          313,
          rawIndex,
          colIndex
        );
        configValuesStore.setConfigDimensionAtPosition(
          "height",
          313,
          rawIndex,
          colIndex
        );
      } else if (configValuesStore.getAllConfigValues.shelfType === "acrylic") {
        configValuesStore.setConfigDimensionAtPosition(
          "width",
          270,
          rawIndex,
          colIndex
        );
        configValuesStore.setConfigDimensionAtPosition(
          "depth",
          270,
          rawIndex,
          colIndex
        );
        configValuesStore.setConfigDimensionAtPosition(
          "height",
          270,
          rawIndex,
          colIndex
        );
      }
    }

    if (
      configValuesStore.selectedCuboid.rawIndex === rawIndex &&
      configValuesStore.selectedCuboid.colIndex === colIndex
    ) {
      // If the current selection is the same as before, null the selected cuboid
      configValuesStore.setSelectedCuboid(null);
    } else {
      // Otherwise, update with the new rawIndex and colIndex
      configValuesStore.setSelectedCuboid(rawIndex, colIndex);
    }
    configValuesStore.setSelectedPanel(null);
    // if (configValuesStore.selectionType === "element") {
    // }
    // else {
    //   configValuesStore.setSelectedCuboid(null, null);
    // }
  };

  const handlePanelSelect = (rawIndex) => {
    configValuesStore.setSelectedPanel(rawIndex);
    configValuesStore.setSelectedCuboid(null, null);
    // if (configValuesStore.selectionType === "panel") {
    // } else {
    //   configValuesStore.setSelectedPanel(null);
    // }
  };

  return (
    <React.Fragment key={key}>
      <Model
        keyCuboid={key}
        width={width / 10}
        height={height / 10}
        depth={depth / 10}
        startWidth={startWidth}
        startHeight={startHeight}
        raw_index={raw_index}
        col_index={col_index}
      />
      <CubeComponent
        position={[
          startWidth + width / 20,
          startHeight + height / 20,
          depth / 20,
        ]}
        rotation={[0, 0, 0]}
        size={[width / 10, height / 10, depth / 10]}
        isVisible={isVisible}
        isVisiblePanelTop={isVisiblePanelTop}
        isVisiblePanelBottom={isVisiblePanelBottom}
        onCubeSelect={handleCubeSelect}
        onPanelSelect={handlePanelSelect}
        rawIndex={raw_index}
        colIndex={col_index}
        width={width}
        height={height}
        depth={depth}
      />
      {/* Show CreateButton for the right side only if this cube is selected */}
      {isVisible && isOnRight(raw_index, col_index) && (
        <CreateButton
          position={[
            startWidth + width / 10,
            startHeight + height / 20,
            depth / 20,
          ]}
          raw_index={raw_index}
          col_index={col_index}
          onClick={() => handleAddCuboid(raw_index, col_index + 1)}
          onRight={true}
        />
      )}

      {/* Show CreateButton for the top side only if this cube is selected */}
      {isVisible && isOnTop(raw_index, col_index) && (
        <CreateButton
          position={[
            startWidth + width / 20,
            startHeight + height / 10,
            depth / 20,
          ]}
          raw_index={raw_index}
          col_index={col_index}
          onClick={() => handleAddCuboid(raw_index + 1, col_index)}
          onRight={false}
        />
      )}
    </React.Fragment>
  );
});

export default CuboidRenderer;
