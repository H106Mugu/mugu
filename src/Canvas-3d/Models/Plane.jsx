/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import configValuesStore from "../../mobx/stores/configValuesStore";

export const Plane = () => {
  const args = [10000, 10000];
  const handleDoubleClick = () => {
    configValuesStore.setSelectedCuboid(null, null);
    configValuesStore.setSelectedPanel(null);
  };
  return (
    <>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -5]} onDoubleClick={handleDoubleClick}>
        <planeGeometry args={args} />
        <meshBasicMaterial color={new THREE.Color("#F5F1EB")}  />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]} onDoubleClick={handleDoubleClick}>
        <planeGeometry args={args} />
        <meshBasicMaterial color={new THREE.Color("#EBE3D7")}  />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-1000, 0, 0]} onDoubleClick={handleDoubleClick}>
        <planeGeometry args={args} />
        <meshBasicMaterial color={new THREE.Color("#EBE3D7")}  />
      </mesh>
    </>
  );
};
