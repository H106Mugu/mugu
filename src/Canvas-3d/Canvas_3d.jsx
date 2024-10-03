import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, OrbitControls } from '@react-three/drei';
import Render from './Render';
import TextBox from './TextBox';
import { store as initialStore } from './store';

export default function Canvas_3d() {

    const [store, setStore] = useState(initialStore); // Use state for the store
    const firstRow = store[0] || {};
    const firstRowColumns = Object.keys(firstRow);

    // Function to handle width changes
    const handleWidthChange = (index, newWidth) => {
        const widthValue = parseInt(newWidth, 10);
        if (!isNaN(widthValue)) {
            setStore(prevStore => {
                const updatedStore = { ...prevStore };
                // Update the width in each row at the specified column index
                Object.keys(updatedStore).forEach(rowKey => {
                    if (updatedStore[rowKey][index]) {
                        updatedStore[rowKey][index].width = widthValue;
                    }
                });
                return updatedStore; // Return the updated store
            });
        }
    };

    // Function to handle height changes
    const handleHeightChange = (rowKey, newHeight) => {
        const heightValue = parseInt(newHeight, 10);
        if (!isNaN(heightValue)) {
            setStore(prevStore => {
                const updatedStore = { ...prevStore };
                // Update the height for each column in the specified row
                Object.keys(updatedStore[rowKey]).forEach(columnKey => {
                    updatedStore[rowKey][columnKey].height = heightValue;
                });
                return updatedStore; // Return the updated store
            });
        }
    };

    return (
        <>
            <Canvas camera={{ position: [0, 50, 100] }}>
                <ambientLight intensity={1} />

                <color attach="background" args={['#f0f0f0']} />

                <CameraControls />

                <OrbitControls
                    enableRotate={true} // Rotate enabled (default)
                    enableZoom={true}   // Zoom enabled (default)
                    enablePan={true}    // Pan enabled (move camera in 2D)
                    panSpeed={1.0}      // Adjust the panning speed
                />

                <Render />
            </Canvas>

            {/* Display widths of all elements in the first row */}
            {firstRowColumns.map((columnKey, index) => {
                const width = firstRow[columnKey].width; // Get the width of the current column
                return (
                    <TextBox 
                        key={index} 
                        text={`Column ${parseInt(columnKey) + 1} Width:`} 
                        value={width} // Pass the width value
                        onChange={handleWidthChange} // Pass the change handler
                        columnIndex={columnKey} // Pass the column index for identification
                        top_offset={`${110 + index * 50}px`} // Position below the previous textboxes
                    />
                );
            })}

            {/* Display heights of all rows only if they have columns */}
            {Object.keys(store).map((rowKey, rowIndex) => {
                const row = store[rowKey];
                // Only show height textbox if there are columns in the row
                if (Object.keys(row).length > 0) {
                    const height = row[0] ? row[0].height : 0; // Get the height of the first column in the row
                    return (
                        <TextBox 
                            key={`row-${rowIndex}`} 
                            text={`Row ${parseInt(rowKey) + 1} Height:`} 
                            value={height} // Pass the height value
                            onChange={handleHeightChange} // Pass the change handler
                            columnIndex={rowKey} // Pass the row index for identification
                            top_offset={`${200 + firstRowColumns.length * 30 + rowIndex * 50}px`} // Position below previous textboxes
                        />
                    );
                }
                return null; // Don't render anything if there are no columns
            })}
        </>
    );
}
