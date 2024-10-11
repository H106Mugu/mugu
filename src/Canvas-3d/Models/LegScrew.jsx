/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const LegScrew = ({ position, material }) => {
  const scale = [0.8, 1, 0.8];

  const { scene } = useLoader(GLTFLoader, "/Models/ScrewLegV1.0.glb");

  const clonedScene = scene.clone(true);

  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });

  const modifiedPosition = position.clone();
  modifiedPosition.y -= 0.5;

  return (
    <primitive object={clonedScene} position={modifiedPosition} scale={scale} />
  );
};
