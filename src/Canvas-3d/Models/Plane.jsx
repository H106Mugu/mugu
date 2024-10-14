/* eslint-disable react/no-unknown-property */
import * as THREE from "three";

export const Plane = () => {
  const args = [10000, 10000];
  return (
    <>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -5]}>
        <planeGeometry args={args} />
        <meshBasicMaterial color={new THREE.Color("#f0f0f0")}  />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
        <planeGeometry args={args} />
        <meshBasicMaterial color={new THREE.Color("#cfc8c8")}  />
      </mesh>
    </>
  );
};
