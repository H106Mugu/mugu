/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import Render from "./Render";
import { Plane } from "./Models/Plane";
import { useRef } from "react";
import configValuesStore from "../mobx/stores/configValuesStore";
import LoadCamera from "./LoadCamera";

export default function Canvas_3d() {

  configValuesStore.setgroupRef(useRef());

  return (
    <>
      <Canvas 
      // camera={{ position: [-88, 45, 135], fov: 50 }}
      >
        <ambientLight intensity={1} />
        <color attach="background" args={["#f0f0f0"]} />
        {/* <axesHelper args={[100]} position={[0, 0, 0]} /> */}
        <Plane />
        {/* <Silhouette /> */}
        <Render />
        <LoadCamera />
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}
