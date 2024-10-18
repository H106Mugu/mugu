/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import Render from "./Render";
import { Plane } from "./Models/Plane";
import { useRef } from "react";

export default function Canvas_3d() {
  const controlsRef = useRef();

  return (
    <>
      <Canvas camera={{ position: [-88, 45, 120], fov: 50 }}>
        <ambientLight intensity={1} />
        <color attach="background" args={["#f0f0f0"]} />
        {/* <axesHelper args={[100]} position={[0, 0, 0]} /> */}
        <Plane />
        {/* <Silhouette /> */}
        <CameraControls
          ref={controlsRef}
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
