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

export const getPlanes = (height, width, depth, planeRefsCube) => {
  const planeDims = [
  {
    position: [0, height / 20, 0],
    rotation: [-Math.PI / 2, 0, 0],
    face: "top",
    ref: planeRefsCube.current[0],
  },
  {
    position: [0, -height / 20, 0],
    rotation: [-Math.PI / 2, 0, 0],
    face: "bottom",
    ref: planeRefsCube.current[1],
  },
  {
    position: [width / 20, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    face: "right",
    ref: planeRefsCube.current[2],
  },
  {
    position: [-width / 20, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    face: "left",
    ref: planeRefsCube.current[3],
  },
  {
    position: [0, 0, -depth / 20],
    rotation: [0, Math.PI, 0],
    face: "back",
    ref: planeRefsCube.current[4],
  },
];
  return planeDims
};

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
  export const shouldDisplayRemoveButton = (breakpoint) => {
    const { rawIndex, colIndex } = configValuesStore.selectedCuboid;
  
    // Check if a cuboid is selected and if the cuboid above the current one exists
    if (rawIndex !== null && colIndex !== null) {
      if (rawIndex === 0 && colIndex === 0) {
        return false;
      }
  
      const canDisplayButton =
        !configValuesStore.hasCuboidAt(rawIndex + 1, colIndex) &&
        (rawIndex !== 0 || !configValuesStore.hasCuboidAt(rawIndex, colIndex + 1));
  
      // Additional condition for breakpoint and config type
      const additionalConditionMobile =
        (breakpoint !== "xs" && breakpoint !== "sm") ||
        configValuesStore.currentConfigType === "structure";
  
      return canDisplayButton && additionalConditionMobile;
    }
  
    return false;
  };
