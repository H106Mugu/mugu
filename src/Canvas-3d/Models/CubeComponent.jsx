import { Box } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { getEdgePoints } from '../Utils/EdgePointsUtils';
import { EdgeCylinder } from './EdgeCylinder';

export const CubeComponent = ({ position, rotation, size, isVisible, onCubeSelect, rawIndex, colIndex, width, height }) => {
    const cubeRef = useRef();
    const { raycaster } = useThree();
    const [hovered, setHovered] = useState(false);

    const edgeRadius = 0.5;
    const offset = 2;

    const handleClick = (event) => {
        event.stopPropagation(); // Prevent event from propagating to other cubes
        const intersects = raycaster.intersectObject(cubeRef.current);

        // Check if the cube is the first (closest) object hit by the ray
        if (intersects.length > 0 && intersects[0].object === cubeRef.current) {
            onCubeSelect(rawIndex, colIndex);
        }
    };
    const edgePosition = [position[0] - width / 20, position[1] - height / 20, position[2] + offset];
    const edges = getEdgePoints(edgePosition, size, offset);

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
                            radius={edgeRadius}
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
                            radius={edgeRadius}
                        />
                    ))}
                </>
            )}
        </>
    );
};