/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Corrected the import path for GLTFLoader
import { getAdjustRotation } from "../Utils/PositionsUtils";

export const Connector = ({ position, uniqueKey, raw_index, col_index }) => {
  uniqueKey = parseInt(uniqueKey);
  const scale = [0.74, 0.74, 0.74];
  
  const {rotation, modelPath} = getAdjustRotation(uniqueKey, raw_index, col_index);

  // Load the selected model
  const { scene } = useLoader(GLTFLoader, modelPath);
  const clonedScene = scene.clone(true);
  console.log("position", position, "uniqueKey", uniqueKey, "modelPath", modelPath, "rotation", rotation );

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};
