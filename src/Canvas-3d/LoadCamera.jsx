import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import configValuesStore from "../mobx/stores/configValuesStore";
import * as THREE from "three";

const LoadCamera = () => {
  // Start with the initial camera position
  const [position, setPosition] = useState([-88, 45, 135]);
  const cameraRef = useRef();
  const controlsRef = configValuesStore.controlRef;
  const [childCount, setChildCount] = useState(0);

  const fitCameraToGroup = () => {
    const groupRef = configValuesStore.groupRef?.current;
    if (!groupRef) {
      return;
    }

    const box = new THREE.Box3().setFromObject(groupRef);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = maxDim / (1.5 * Math.tan(fov / 2));

    const newPosition = [
      center.x,
      center.y + size.y / 1.5,
      center.z + cameraDistance + size.z,
    ];

    setPosition(newPosition);

    if (controlsRef.current) {
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
  }, [childCount]); // Run when childCount changes

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
  }, [configValuesStore.groupRef]); // Run when groupRef changes

  return (
    <>
      <PerspectiveCamera
        position={position}
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
  );
};

export default LoadCamera;
