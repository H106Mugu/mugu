/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import Render from "./Render";

export default function Canvas_3d() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
        <ambientLight intensity={1} />
        <color attach="background" args={["#f0f0f0"]} />
        <CameraControls
          minDistance={1} // Minimum zoom distance
          maxDistance={400} // Maximum zoom distance
          dollyToCursor={true} // Zoom to cursor
        />
        <Render />
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}
