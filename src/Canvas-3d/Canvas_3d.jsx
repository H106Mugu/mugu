import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { CameraControls, Environment } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import Render from './Render';
// import configValuesStore from '../mobx/stores/configValuesStore';
import { useStores } from "../mobx/context/StoreContext";
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three'; // Import THREE here


export default function Canvas_3d() {

    // const cameraRef = useRef();

    // useEffect(() => {
    //     if (cameraRef.current) {
    //         cameraRef.current.lookAt((25, 25, 0)); // Look at the center of the cube (adjust height as necessary)
    //     }
    // }, [cameraRef]);

    // const controlsRef = useRef();

    // useEffect(() => {
    //     if (controlsRef.current) {
    //         controlsRef.current.target.set(25, 25, 0); // Set the target to (25, 25, 0)
    //         controlsRef.current.update(); // Update the controls to reflect the new target
    //     }
    // }, [controlsRef]);

    // const { configValuesStore } = useStores();


    // // State for row and column input fields
    // const [rowInput, setRowInput] = useState('');
    // const [colInput, setColInput] = useState('');

    // Use useCallback to memoize the add column function
    // const handleAddColumn = useCallback(() => {
    //     configValuesStore.addColumnToRow(0); // Call the function to add a new column to row 0
    // }, []);

    // const handleAddRow = () => {
    //     configValuesStore.addRow(); // Call addRow method from store
    // };

    //   // Handler to add a cuboid at specified row and column
    //   const handleAddCuboid = () => {
    //     const row = parseInt(rowInput);
    //     const col = parseInt(colInput);
        
    //     if (!isNaN(row) && !isNaN(col)) {
    //         configValuesStore.addCuboidAtPosition(row, col);
    //     } else {
    //         alert("Please enter valid numeric values for row and column.");
    //     }
    // };

    return (
        <>
            <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <ambientLight intensity={1} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <color attach="background" args={['#f0f0f0']} />
                <CameraControls 
                    minDistance={100}  // Minimum zoom distance
                    maxDistance={400}  // Maximum zoom distance
                    dollyToCursor={true}  // Zoom to cursor
                />
                <Render />
                <Environment preset='sunset' />
            </Canvas>
            {/* <button 
                onClick={handleAddColumn} 
                style={{
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '20px', 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                }}>
                Add Column
            </button>
            <button 
                onClick={handleAddRow} 
                style={{
                    position: 'absolute', 
                    bottom: '80px', 
                    left: '20px', 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                }}>
                Add Raw
            </button> */}
            {/* <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1 }}>
                <input
                    type="number"
                    placeholder="Row"
                    value={rowInput}
                    onChange={(e) => setRowInput(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    placeholder="Column"
                    value={colInput}
                    onChange={(e) => setColInput(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleAddCuboid}>Add Block</button>
            </div> */}

        </>
    );
}
