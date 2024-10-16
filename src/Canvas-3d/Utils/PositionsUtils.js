/* eslint-disable react-hooks/rules-of-hooks */
import { useStores } from "../../mobx/context/StoreContext";

export function isOnRight(raw_index, col_index) {
    const { configValuesStore } = useStores();
    // Case 1: First row, check if the next column is empty
    if (raw_index === 0 && !configValuesStore.hasCuboidAt(raw_index, col_index + 1)) {
      return true;
    }
  
    // Case 2: Any other row, check if the previous row has a cuboid and the current row/column is empty
    if (raw_index > 0 && 
        configValuesStore.hasCuboidAt(raw_index - 1, col_index + 1) && 
        !configValuesStore.hasCuboidAt(raw_index, col_index + 1)) {
      return true;
    }
  
    // Return false if neither condition is met
    return false;
  }

export function isOnTop(raw_index, col_index) {
    const { configValuesStore } = useStores();
    return !configValuesStore.hasCuboidAt(raw_index + 1, col_index);
  }

export function handleAddCuboid(raw_index, col_index) {
  const { configValuesStore } = useStores();
  return configValuesStore.addCuboidAtPosition(raw_index, col_index); // Add cuboid
};

// Function to get rotation and adjusted position based on uniqueKey
export const adjustPositionAndGetRotation = (key, originalPosition) => {
  const newPosition = [...originalPosition]; // Clone original position
  let rotation;

  switch (key) {
      case 0:
      case 3:
          newPosition[0] += 1.5; // Add 1.5 to x
          newPosition[2] += 1.6; // Add 1.5 to z
          rotation = [0, Math.PI * 1.5, 0];
          break;
      case 1:
      case 2:
          newPosition[0] -= 1.6; // Subtract 1.5 from x
          newPosition[2] += 1.5; // Add 1.5 to z
          rotation = [0, Math.PI, 0];
          break;
      case 4:
      case 7:
          newPosition[0] += 1.6; // Add 1.5 to x
          newPosition[2] -= 1.5; // Subtract 1.5 from z
          rotation = [0, 0, 0];
          break;
      case 5:
      case 6:
          newPosition[0] -= 1.5; // Subtract 1.5 from x
          newPosition[2] -= 1.6; // Subtract 1.5 from z
          rotation = [0, Math.PI * 0.5, 0];
          break;
      default:
          rotation = [0, 0, 0]; // Default rotation
          break;
  }

  return { adjustedPosition: newPosition, rotation };
};

export const getAdjustRotation = (uniqueKey, raw_index, col_index) => {
  let rotation;
  let modelPath;
  const modalPath3TConnector = "/Models/3TConnectorV1.0.glb";
  const modalPath4TConnector = "/Models/4TConnectorV1.0.glb";
  const modalPath5TConnector = "/Models/5TConnectorV1.0.glb";

  const cubeLeft = cubeExists(raw_index, col_index - 1);
  const cubeRight = cubeExists(raw_index, col_index + 1);
  const cubeDown = cubeExists(raw_index + 1, col_index);

  switch (uniqueKey) {
    case 0:
      modelPath = cubeLeft ? modalPath5TConnector : modalPath4TConnector;
      rotation = cubeLeft ? [0, Math.PI * 1, 0] : [0, Math.PI * 1.5, 0];
      break;

    case 1:
      modelPath = modalPath4TConnector; 
      rotation = [0, Math.PI, 0];
      break;

    case 2:
      if (!cubeRight && !cubeDown) {
        modelPath = modalPath3TConnector;
        rotation = [0, Math.PI, 0];
      } else if (cubeRight && !cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, Math.PI * 1, -Math.PI * 0.5];
      } else if (!cubeRight && cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, Math.PI, 0];
      } else {
        modelPath = modalPath5TConnector;
        rotation = [0, Math.PI, 0];
      }
      break;

    case 3:
      if (!cubeLeft && !cubeDown) {
        modelPath = modalPath3TConnector;
        rotation = [0, Math.PI * 1.5, 0];
      } else if (cubeLeft && !cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, Math.PI * 1, -Math.PI * 0.5];
      } else if (!cubeLeft && cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, Math.PI * 1.5, 0];
      } else {
        modelPath = modalPath5TConnector;
        rotation = [0, Math.PI * 1, 0];
      }
      break;

    case 4:
      modelPath = cubeLeft ? modalPath5TConnector : modalPath4TConnector;
      rotation = [0, 0, 0];
      break;

    case 5:
      modelPath = cubeRight ? modalPath5TConnector : modalPath4TConnector;
      rotation = cubeRight ? [0, 0, 0] : [0, Math.PI * 0.5, 0];
      break;

    case 6:
      if (!cubeRight && !cubeDown) {
        modelPath = modalPath3TConnector;
        rotation = [0, Math.PI * 0.5, 0];
      } else if (cubeRight && !cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, 0, -Math.PI * 0.5];
      } else if (!cubeRight && cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, Math.PI * 0.5, 0];
      } else {
        modelPath = modalPath5TConnector;
        rotation = [0, 0, 0];
      }
      break;

    case 7:
      if (!cubeLeft && !cubeDown) {
        modelPath = modalPath3TConnector;
        rotation = [0, 0, 0];
      } else if (cubeLeft && !cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, 0, -Math.PI * 0.5];
      } else if (!cubeLeft && cubeDown) {
        modelPath = modalPath4TConnector;
        rotation = [0, 0, 0];
      } else {
        modelPath = modalPath5TConnector;
        rotation = [0, 0, 0];
      }
      break;

    default:
      break;
  }

  return { rotation, modelPath };
};



const cubeExists = (rIndex, cIndex) => {
  const { configValuesStore } = useStores();
  return configValuesStore.hasCuboidAt(rIndex, cIndex);
};



