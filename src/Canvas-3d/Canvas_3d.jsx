/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import Render from "./Render";
import { Plane } from "./Models/Plane";
import { useEffect, useRef } from "react";
import configValuesStore from "../mobx/stores/configValuesStore";
import LoadCamera from "./LoadCamera";
import AllDimensionLines from "./Dimentions/AllDimensionLines";
import { observer } from "mobx-react-lite";
import * as THREE from "three";

const Canvas_3d = observer(() => {
  configValuesStore.setgroupRef(useRef());
  configValuesStore.setControlRef(useRef());
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.id = "canvas"; // Assign your desired ID here
  }, []);

  return (
    <>
      <Canvas
        className="mugu-3d-canvas"
        ref={canvasRef}
        shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
        gl={(canvas) => ({
          toneMapping: THREE.LinearToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.sRGBEncoding,
          antialias: true,
          preserveDrawingBuffer: true,
        })}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} color={"white"} />
        <hemisphereLight
          intensity={0.5}
          skyColor={"white"}
          groundColor={"white"}
        />

        {/* Using PointLight directly as JSX */}
        <pointLight
          position={[0, 30, 50]}
          intensity={0.4}
          color={"white"}
          distance={500}
          shadow-bias={-0.009}
          // shadow-normalBias={0.05}
          decay={0.01}
          castShadow
          // shadow-mapSize={[4096, 4096]}
          // shadow-radius={20}
        />

        <color attach="background" args={["#f0f0f0"]} />

        {/* Scene contents */}
        <Plane />
        <Environment
          files={"/poly_haven_studio_1k.hdr"}
          intensity={0.5}
          castShadow
        />
        <Render />
        <LoadCamera />
        <AllDimensionLines />
      </Canvas>
    </>
  );
});

export default Canvas_3d;
