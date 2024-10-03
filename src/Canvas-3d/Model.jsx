import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Pipe = ({ start, end, radius = 1 }) => {
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
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
      pipeRef.current.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  
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
    }, [start, end, radius]);
  
    return (
      <mesh ref={pipeRef}>
        <cylinderGeometry args={[radius, radius, 1, 16]} /> {/* Use distance here */}
        <meshStandardMaterial color="silver" />
      </mesh>
    );
  };
  
const Connector = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

const Model = ({ width, height, depth, color, StartWidth, EndWidth, StartHeight, EndHeight, materialType }) => {

  const corners = [
    [StartWidth, StartHeight, 0], // Bottom-left-back
    [StartWidth + width, StartHeight, 0], // Bottom-right-back
    [StartWidth + width, StartHeight + height, 0], // Top-right-back
    [StartWidth, StartHeight + height, 0], // Top-left-back
    [StartWidth, StartHeight, depth], // Bottom-left-front
    [StartWidth + width, StartHeight, depth], // Bottom-right-front
    [StartWidth + width, StartHeight + height, depth], // Top-right-front
    [StartWidth, StartHeight + height, depth], // Top-left-front
  ].map((corner) => new THREE.Vector3(...corner));

  console.log(corners);

  return (
    <>
      {/* Bottom frame */}
      <Pipe start={corners[0]} end={corners[1]} /> {/* Bottom Front */}
      <Pipe start={corners[1]} end={corners[2]} /> {/* Bottom Right */}
      <Pipe start={corners[2]} end={corners[3]} /> {/* Bottom Back */}
      <Pipe start={corners[3]} end={corners[0]} /> {/* Bottom Left */}

      {/* Top frame */}
      <Pipe start={corners[4]} end={corners[5]} /> {/* Top Front */}
      <Pipe start={corners[5]} end={corners[6]} /> {/* Top Right */}
      <Pipe start={corners[6]} end={corners[7]} /> {/* Top Back */}
      <Pipe start={corners[7]} end={corners[4]} /> {/* Top Left */}

      {/* Vertical pipes */}
      <Pipe start={corners[0]} end={corners[4]} /> {/* Left Vertical */}
      <Pipe start={corners[1]} end={corners[5]} /> {/* Right Vertical */}
      <Pipe start={corners[2]} end={corners[6]} /> {/* Back Right Vertical */}
      <Pipe start={corners[3]} end={corners[7]} /> {/* Back Left Vertical */}

      {/* Connectors at corners */}
      <Connector position={corners[0]} />
      <Connector position={corners[1]} />
      <Connector position={corners[2]} />
      <Connector position={corners[3]} />
      <Connector position={corners[4]} />
      <Connector position={corners[5]} />
      <Connector position={corners[6]} />
      <Connector position={corners[7]} />
    </>
  );
};

export default Model;
