import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import configValuesStore from '../mobx/stores/configValuesStore';
import * as THREE from 'three';

const LoadCamera = () => {
  // Start with the initial camera position
  const [position, setPosition] = useState([-7, 0, 150]);
  const cameraRef = useRef();
  const controlsRef = useRef();

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
      center.y,
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
    fitCameraToGroup();
  }, [configValuesStore.groupRef.current]);

  return (
    <>
      <PerspectiveCamera position={position} fov={50} ref={cameraRef} makeDefault />
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
