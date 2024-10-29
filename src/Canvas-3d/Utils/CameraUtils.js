import configValuesStore from "../../mobx/stores/configValuesStore";
import * as THREE from "three";

export const fitCameraToReset = () => {
  return new Promise((resolve) => {
    const groupRef = configValuesStore.groupRef?.current;
    const controlsRef = configValuesStore.controlRef?.current;
    if (!groupRef) {
      // console.error('groupRef not found');
      resolve();
      return;
    }

    const box = new THREE.Box3().setFromObject(groupRef);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = maxDim / (1.5 * Math.tan(fov / 2));

    if (controlsRef) {
      controlsRef.setLookAt(
        88 + size.x * 1.2,
        45 + size.y,
        135 + cameraDistance * 0.3,
        center.x,
        center.y,
        center.z,
        true
      ).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

export const fitCameraToSideView = () => {
  return new Promise((resolve) => {
    const groupRef = configValuesStore.groupRef?.current;
    if (!groupRef) {
      // console.error('groupRef not found');
      resolve();
      return;
    }

    const box = new THREE.Box3().setFromObject(groupRef);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // console.log("size", size, "center", center);

    if (configValuesStore.controlRef.current) {
      configValuesStore.controlRef.current.setLookAt(
      center.x + 8 * size.x,
      center.y,
      center.z,
      center.x,
      center.y,
      center.z,
      true
      ).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};
