import configValuesStore from "../../mobx/stores/configValuesStore";
import * as THREE from "three";

export const fitCameraToReset = () => {
    
    const groupRef = configValuesStore.groupRef?.current;
    if (!groupRef) {
      return;
    }
    
    const box = new THREE.Box3().setFromObject(groupRef);
    const size = box.getSize(new THREE.Vector3());
    console.log('size', size);
    console.log('box', groupRef.children);
    const center = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = maxDim / (1.5 * Math.tan(fov / 2));
    
    const newPosition = [
      (center.x * 0.8) - cameraDistance, // Move the camera to the left
      center.y + size.y + cameraDistance * 0.1, // Move the camera upwards
      center.z + cameraDistance + size.z, // Keep the depth the same
    ];
    
    // setPosition(newPosition);
    
    if (configValuesStore.controlRef.current) {
      console.log("setLookAt", newPosition);
      configValuesStore.controlRef.current.setLookAt(
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