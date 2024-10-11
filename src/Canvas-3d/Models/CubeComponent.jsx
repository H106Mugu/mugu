import { Box } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { getEdgePoints } from '../Utils/EdgePointsUtils';
import { EdgeCylinder } from './EdgeCylinder';

export const CubeComponent = ({ position, rotation, size, isVisible, onCubeSelect, rawIndex, colIndex, width, height, depth }) => {
    const cubeRef = useRef();
    const { raycaster, scene } = useThree();
    const [hovered, setHovered] = useState(false);

    const offset = 2;

    const handleClick = (event) => {
        event.stopPropagation(); // Prevent event from propagating to other cubes

        // Update the raycaster with the current mouse position
        raycaster.setFromCamera(event.pointer, event.camera);

        // Get all intersected objects
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            // Sort the intersects by distance (closest object first)
            const sortedIntersects = intersects.sort((a, b) => a.distance - b.distance);

            // Get the first (closest) intersected object
            const closestIntersect = sortedIntersects[0];

            // Check if the closest object is the current cube
            if (closestIntersect.object === cubeRef.current) {
                onCubeSelect(rawIndex, colIndex);
            }
        }
    };

    const edgePosition = [position[0] - width / 20, position[1] - height / 20, position[2] - depth / 20];
    const edges = getEdgePoints(edgePosition, size, offset);
    // console.log("edges", edges[0]);

    return (
        <>
            {/* Original cube, which is invisible */}
            <Box
                ref={cubeRef}
                position={position}
                rotation={rotation}
                args={size}
                onClick={handleClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={false}
            />

            {/* Show edges based on selection */}
            {isVisible && (
                <>
                    {edges.map((edge, index) => (
                        <EdgeCylinder
                            key={index}
                            start={edge[0]}
                            end={edge[1]}
                            color={'blue'}
                        />
                    ))}
                </>
            )}

            {/* Show edges in green when hovered, but not when selected */}
            {hovered && !isVisible && (
                <>
                    {edges.map((edge, index) => (
                        <EdgeCylinder
                            key={`hover-${index}`}
                            start={edge[0]}
                            end={edge[1]}
                            color={'green'}
                        />
                    ))}
                </>
            )}
        </>
    );
};