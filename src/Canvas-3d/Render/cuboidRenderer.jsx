/* eslint-disable no-unused-vars */
// CuboidRenderer.js
import React, { useEffect, useState } from "react";
import Model from "../Models/Model";
import CreateButton from "../Buttons/CreateButton";
import { isOnRight, isOnTop, handleAddCuboid } from "../Utils/PositionsUtils";
import { CubeComponent } from "../Models/CubeComponent";
import configValuesStore from "../../mobx/stores/configValuesStore";
import { observer } from "mobx-react-lite"; // Import observer from mobx-react-lite

const CuboidRenderer = observer(({ cuboidData }) => {
  const { key, width, height, depth, startWidth, startHeight, raw_index, col_index } = cuboidData;

  const isVisible = configValuesStore.selectedCuboid.rawIndex === raw_index && configValuesStore.selectedCuboid.colIndex === col_index;

  const handleCubeSelect = (rawIndex, colIndex) => {
    configValuesStore.setSelectedCuboid(rawIndex, colIndex);
    console.log("indexes", configValuesStore.selectedCuboid.rawIndex, configValuesStore.selectedCuboid.colIndex);
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
      />
      <CubeComponent
        position={[startWidth + width / 20, startHeight + height / 20, 0]}
        rotation={[0, 0, 0]}
        size={[width / 10, height / 10, depth / 10]}
        isVisible={isVisible}
        onCubeSelect={handleCubeSelect}
        rawIndex={raw_index}
        colIndex={col_index}
        width={width}
        height={height}
        startHeight={startHeight}
        startWidth={startWidth}
      />
      {/* Show CreateButton for the right side only if this cube is selected */}
      {isVisible && isOnRight(raw_index, col_index) && (
          <CreateButton
              position={[startWidth + width / 10, startHeight + height / 20, depth / 20]}
              raw_index={raw_index}
              col_index={col_index}
              onClick={() => handleAddCuboid(raw_index, col_index + 1)}
              onRight={true}
          />
      )}

      {/* Show CreateButton for the top side only if this cube is selected */}
      {isVisible && isOnTop(raw_index, col_index) && (
          <CreateButton
              position={[startWidth + width / 20 , startHeight + height / 10, depth / 20]}
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
