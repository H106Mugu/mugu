/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { Box } from '@react-three/drei';

export const CubeComponent = ({ position, rotation, size, isVisible, onCubeSelect, rawIndex, colIndex }) => {
    const handleClick = () => {
        onCubeSelect(rawIndex, colIndex); // Notify parent with rawIndex and colIndex
    };

    return (
        <Box
            position={position}
            rotation={rotation}
            args={size} // Width, Height, Depth of the Cube
            receiveShadow
            onClick={handleClick} // Add click event
            visible={isVisible} // Control visibility from parent
        >
            <meshStandardMaterial attach="material" color={isVisible ? "lightgreen" : "lightblue"} />
        </Box>
    );
};
