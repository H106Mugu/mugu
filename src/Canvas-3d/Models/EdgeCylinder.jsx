/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';


export const EdgeCylinder = ({ start, end, color, radius }) => {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const midPoint = new THREE.Vector3().addVectors(start, end).divideScalar(2);
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    const cylinderMesh = new THREE.Mesh(geometry, material);

    // Position and rotate the cylinder
    cylinderMesh.position.copy(midPoint);
    cylinderMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()); // Align with direction

    return <primitive object={cylinderMesh} />;
};