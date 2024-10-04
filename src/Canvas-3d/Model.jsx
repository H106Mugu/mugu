import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const Pipe = ({ start, end, radius = 1, material }) => {
  const pipeRef = useRef();

  useEffect(() => {
    const direction = new THREE.Vector3().subVectors(end, start);
    const distance = direction.length(); // Calculate the distance

    // Position the pipe
    const midpoint = start.clone().lerp(end, 0.5);
    pipeRef.current.position.set(midpoint.x, midpoint.y, midpoint.z);

    // Set the rotation of the pipe
    direction.normalize();
    const axis = new THREE.Vector3(0, 1, 0); // Default to align along Y-axis
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction
    );
    pipeRef.current.quaternion.set(
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w
    );

    // Set the scale of the pipe
    if (start.x === end.x && start.z === end.z) {
      // Vertical pipe (same x and z)
      pipeRef.current.scale.set(radius, distance, radius); // Using distance
    } else if (start.y === end.y && start.z === end.z) {
      // Horizontal pipe (same y and z, front or back)
      pipeRef.current.scale.set(radius, distance, radius); // Using distance
    } else {
      // Horizontal pipe (same y and x, sides)
      pipeRef.current.scale.set(radius, distance, radius); // Using distance
    }
    console.log(pipeRef);
  }, [start, end, radius]);

  return (
    <mesh ref={pipeRef}>
      <cylinderGeometry args={[radius, radius, 1, 16]} />
      <meshStandardMaterial {...material} />
      {/* Use distance here */}
      {/* <meshStandardMaterial color="silver" /> */}
    </mesh>
  );
};

const Connector = ({ position, material }) => {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <mesh position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
};

const Model = ({ width, height, depth, StartWidth, StartHeight }) => {
  const { scene } = useLoader(GLTFLoader, "./Models/Material.glb");

  const material = scene.getObjectByName("Plane").material;

  const texture = useLoader(THREE.TextureLoader, "./Models/images.jpg");

  if (texture) {
    material.roughnessMap = texture;
    material.needsUpdate = true; // Ensure the material updates with the new texture
  }

  console.log(material);

  console.log(width, height, depth, StartWidth, StartHeight);

  const corners = [
    [StartWidth - width / 2, StartHeight - height / 2, 0 - depth / 2], // Bottom-left-back
    [StartWidth + width / 2, StartHeight - height / 2, 0 - depth / 2], // Bottom-right-back
    [StartWidth + width / 2, StartHeight + height / 2, 0 - depth / 2], // Top-right-back
    [StartWidth - width / 2, StartHeight + height / 2, 0 - depth / 2], // Top-left-back
    [StartWidth - width / 2, StartHeight - height / 2, depth / 2], // Bottom-left-front
    [StartWidth + width / 2, StartHeight - height / 2, depth / 2], // Bottom-right-front
    [StartWidth + width / 2, StartHeight + height / 2, depth / 2], // Top-right-front
    [StartWidth - width / 2, StartHeight + height / 2, depth / 2], // Top-left-front
  ].map((corner) => new THREE.Vector3(...corner));

  // console.log(corners);

  return (
    <>
      {/* Bottom frame */}
      <Pipe start={corners[0]} end={corners[1]} material={material} />
      <Pipe start={corners[1]} end={corners[2]} material={material} />
      <Pipe start={corners[2]} end={corners[3]} material={material} />
      <Pipe start={corners[3]} end={corners[0]} material={material} />
      <Pipe start={corners[4]} end={corners[5]} material={material} />
      <Pipe start={corners[5]} end={corners[6]} material={material} />
      <Pipe start={corners[6]} end={corners[7]} material={material} />
      <Pipe start={corners[7]} end={corners[4]} material={material} />
      <Pipe start={corners[0]} end={corners[4]} material={material} />
      <Pipe start={corners[1]} end={corners[5]} material={material} />
      <Pipe start={corners[2]} end={corners[6]} material={material} />
      <Pipe start={corners[3]} end={corners[7]} material={material} />
      {/* Connectors at corners */}
      <Connector position={corners[0]} material={material} />
      <Connector position={corners[1]} material={material} />
      <Connector position={corners[2]} material={material} />
      <Connector position={corners[3]} material={material} />
      <Connector position={corners[4]} material={material} />
      <Connector position={corners[5]} material={material} />
      <Connector position={corners[6]} material={material} />
      <Connector position={corners[7]} material={material} />
    </>
  );
};

export default Model;
