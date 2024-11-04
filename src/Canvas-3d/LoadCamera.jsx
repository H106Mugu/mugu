/* eslint-disable no-unused-vars */
import {
  CameraControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import configValuesStore from "../mobx/stores/configValuesStore";
import * as THREE from "three";
import { observer } from "mobx-react-lite";

const LoadCamera = observer(() => {
  // Start with the initial camera position
  const [position, setPosition] = useState([88, 45, 135]);
  const cameraRef = useRef();
  const controlsRef = configValuesStore.controlRef;
  const [childCount, setChildCount] = useState(0);
  // const [isOrthographic, setIsOrthographic] = useState(
  //   configValuesStore.getIs2d
  // );

  const fitCameraToGroup = () => {
    const groupRef = configValuesStore.groupRef?.current;
    if (!groupRef) {
      return;
    }

    const box = new THREE.Box3().setFromObject(groupRef);
    const size = box.getSize(new THREE.Vector3());
    // console.log("size", size);
    // console.log("box", groupRef.children);
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = maxDim / (2.5 * Math.tan(fov / 2));

    const newPosition = [
      center.x,
      center.y,
      center.z + cameraDistance * 1.5 + size.z + size.y * 0.2,
    ];

    setPosition(newPosition);

    if (controlsRef.current) {
      const padding = {
        paddingTop: 30,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
      };
      // controlsRef.current.fitToBox(groupRef, true, padding);
      controlsRef.current.setLookAt(
        newPosition[0],
        newPosition[1],
        newPosition[2],
        center.x,
        center.y,
        center.z,
        true
      );
    }
  };

  useEffect(() => {
    if (childCount != 41) {
      fitCameraToGroup();
    }
  }, [childCount, configValuesStore.configValues]); // Run when childCount changes

  useEffect(() => {
    const groupRef = configValuesStore.groupRef?.current;

    if (groupRef) {
      // Update child count when children change
      const updateChildCount = () => {
        setChildCount(groupRef.children.length);
      };

      // Initial count
      updateChildCount();
    }
  }, [configValuesStore.configValues]); // Run when groupRef changes

  // useEffect(() => {
  //   console.log("useEffect");
  //   if (configValuesStore.getIs2d) {
  //     setIsOrthographic(true);
  //     console.log("is2D", configValuesStore.getIs2d);
  //   } else {
  //     setIsOrthographic(false);
  //   }
  // }, [configValuesStore.getIs2d]);

  return (
    <>
      {!configValuesStore.getIs2d ? (
        <>
          <PerspectiveCamera
            position={[88, 45, 135]}
            fov={50}
            ref={cameraRef}
            makeDefault
          />
          <CameraControls
            ref={controlsRef}
            minDistance={50}
            maxDistance={400}
            dollyToCursor={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 8}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
          />
        </>
      ) : (
        <>
          <OrthographicCamera position={[88, 45, 135]} ref={cameraRef} makeDefault/>
          <CameraControls
            ref={controlsRef}
            minDistance={50}
            maxDistance={400}
            dollyToCursor={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 8}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
          />
        </>
      )}
    </>
  );
});

export default LoadCamera;
