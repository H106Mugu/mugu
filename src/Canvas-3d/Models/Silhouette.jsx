/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Silhouette = () => {
  const position = [-60, -25, 0];
  const scale = [1.1, 1.1, 1.1];

  const { scene } = useLoader(GLTFLoader, "/Models/shadow_man.glb"); // Load the GLB file

  return <primitive object={scene} position={position} scale={scale} />;
};

export default Silhouette;
