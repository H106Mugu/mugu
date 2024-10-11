/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import Render from "./Render";
import { Plane } from "./Models/Plane";
import Silhouette from "./Models/Silhouette";

export default function Canvas_3d() {
  return (
    <>
      <Canvas camera={{ position: [0, 10, 150], fov: 50 }}>
        <ambientLight intensity={1} />
        <color attach="background" args={["#f0f0f0"]} />
        {/* <axesHelper args={[100]} /> */}
        <Plane />
        <Silhouette />
        <CameraControls
          minDistance={100} // Minimum zoom distance
          maxDistance={400} // Maximum zoom distance
          dollyToCursor={true} // Zoom to cursor
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 8}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />
        <Render />
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}
