/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Pipe = ({ start, end, radius = 0.75, material }) => {
    const pipeRef = useRef();
  
    useEffect(() => {
      const direction = new THREE.Vector3().subVectors(end, start);
      const distance = direction.length();
      const midpoint = start.clone().lerp(end, 0.5);
      pipeRef.current.position.set(midpoint.x, midpoint.y, midpoint.z);
  
      direction.normalize();
      const axis = new THREE.Vector3(0, 1, 0); // Default to align along Y-axis
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
      pipeRef.current.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  
      // Set the scale of the pipe
      pipeRef.current.scale.set(radius, distance, radius); // Using distance
    }, [start, end, radius]);
  
    return (
      <mesh ref={pipeRef} name ="pipe">
        <cylinderGeometry args={[radius, radius, 1, 16]} />
        <meshStandardMaterial {...material} />
      </mesh>
    );
  };