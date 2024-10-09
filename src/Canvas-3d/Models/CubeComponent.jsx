/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { Box, Edges } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const CubeComponent = ({ position, rotation, size, isVisible, onCubeSelect, rawIndex, colIndex }) => {
    const cubeRef = useRef();
    const { raycaster } = useThree();

    const handleClick = (event) => {
        event.stopPropagation(); // Prevent event from propagating to other cubes
        const intersects = raycaster.intersectObject(cubeRef.current);
        
        // Check if the cube is the first (closest) object hit by the ray
        if (intersects.length > 0 && intersects[0].object === cubeRef.current) {
            onCubeSelect(rawIndex, colIndex); // Notify parent with rawIndex and colIndex
        }
    };

    // Scale factor to move edges slightly outside the original cube
    const edgeOffsetScale = 1.07; // Adjust this value to control the distance of edges

    // Apply the scale to size
    const edgeSize = size.map(dim => dim * edgeOffsetScale);

    return (
        <>
            {/* Original cube, which is invisible */}
            <Box
                ref={cubeRef}
                position={position}
                rotation={rotation}
                args={size} // Width, Height, Depth of the Cube
                onClick={handleClick} // Add click event
                visible={false} // Make the cube invisible, edges will be shown
            />

            {/* Visible edges at a slight offset */}
            {isVisible && (
                <lineSegments position={position} rotation={rotation}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(...edgeSize)]} />
                    <lineBasicMaterial attach="material" color="blue" />
                </lineSegments>
            )}
        </>
    );
};
