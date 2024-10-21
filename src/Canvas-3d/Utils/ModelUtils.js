import * as THREE from "three";
import configValuesStore from "../../mobx/stores/configValuesStore";

// Static pipe connections
export const pipeConnections = [
  [0, 1], [1, 2], [2, 3], [3, 0], // Back face
  [4, 5], [5, 6], [6, 7], [7, 4], // Front face
  [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting front and back
];

// Static corner offsets
export const cornerOffsets = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], // Back face
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]  // Front face
];

// Bottom corner indices
export const bottomCornersIndices = [0, 1, 4, 5]; 

export const getCorners = (width, height, depth, startWidth, startHeight) => {
  return cornerOffsets.map(
    ([x, y, z]) =>
      new THREE.Vector3(
        startWidth + (x * width),
        startHeight + (y * height),
        (z * depth)
      )
  );
};

export const getLegPipes = (corners) => {
  return bottomCornersIndices.map((index) => {
    const start = corners[index];
    const end = new THREE.Vector3(start.x, start.y - 5, start.z);
    return { start, end };
  });
};

  // Function to check if the remove button should be displayed
  export const shouldDisplayRemoveButton = () => {
    const { rawIndex, colIndex } = configValuesStore.selectedCuboid;

    // Check if a cuboid is selected and if the cuboid above the current one exists
    if (rawIndex !== null && colIndex !== null) {
      return !configValuesStore.hasCuboidAt(rawIndex + 1, colIndex) && 
        !configValuesStore.hasCuboidAt(rawIndex, colIndex + 1);
    }

    return false;
  };
