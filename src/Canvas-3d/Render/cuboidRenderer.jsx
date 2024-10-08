/* eslint-disable no-unused-vars */
// CuboidRenderer.js
import React, { useEffect, useState } from "react";
import Model from "../Models/Model";
import CreateButton from "../Buttons/CreateButton";
import { IsRight, IsTop, handleAddCuboid } from "../Utils/PositionsUtils";
import { CubeComponent } from "../Models/CubeComponent";
import configValuesStore from "../../mobx/stores/configValuesStore";

const CuboidRenderer = ({ cuboidData }) => {
    const { key, width, height, depth, startWidth, startHeight, raw_index, col_index } = cuboidData;

  // State to track visibility
  const [isVisible, setIsVisible] = useState(false); 

  const handleCubeSelect = (rawIndex, colIndex) => {
    configValuesStore.setSelectedCuboid(rawIndex, colIndex); // Store the selected indices in the store

    // Update visibility based on selected indices
    const currentlySelected = configValuesStore.selectedCuboid;
    const visible = currentlySelected.rawIndex === raw_index && currentlySelected.colIndex === col_index;
    setIsVisible(visible); // Update the state to trigger re-render
    console.log("storeIndexes", currentlySelected.rawIndex, currentlySelected.colIndex, "isVisible", visible);
  };

  // Check visibility directly based on the store's selectedCuboid
  useEffect(() => {
    const currentlySelected = configValuesStore.selectedCuboid;
    setIsVisible(currentlySelected.rawIndex === raw_index && currentlySelected.colIndex === col_index);
  }, [configValuesStore.selectedCuboid, raw_index, col_index]);

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
        position={[startWidth, startHeight, 0]}
        rotation={[0, 0, 0]}
        size={[width / 10, height / 10, depth / 10]} // Size for the Cube
        isVisible={isVisible} // Check if this cube is selected
        onCubeSelect={handleCubeSelect} // Pass the select handler
        rawIndex={raw_index} // Pass raw index
        colIndex={col_index} // Pass column index
      />
      {IsRight(raw_index, col_index) && (
        <CreateButton
          position={[startWidth + width / 20 + 2, startHeight, 0]}
          raw_index={raw_index}
          col_index={col_index}
          onClick={() => handleAddCuboid(raw_index, col_index + 1)}
          onRight={true}
        />
      )}
      {IsTop(raw_index, col_index) && (
        <CreateButton
          position={[startWidth, startHeight + height / 20 + 2, 0]}
          raw_index={raw_index}
          col_index={col_index}
          onClick={() => handleAddCuboid(raw_index + 1, col_index)}
          onRight={false}
        />
      )}
    </React.Fragment>
  );
};

export default CuboidRenderer;
