import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useState } from 'react';
import Render from './Render';
// import configValuesStore from '../mobx/stores/configValuesStore';
import { useStores } from "../mobx/context/StoreContext";


export default function Canvas_3d() {

    const { configValuesStore } = useStores();

    // State for row and column input fields
    const [rowInput, setRowInput] = useState('');
    const [colInput, setColInput] = useState('');

    // Use useCallback to memoize the add column function
    // const handleAddColumn = useCallback(() => {
    //     configValuesStore.addColumnToRow(0); // Call the function to add a new column to row 0
    // }, []);

    // const handleAddRow = () => {
    //     configValuesStore.addRow(); // Call addRow method from store
    // };

      // Handler to add a cuboid at specified row and column
      const handleAddCuboid = () => {
        const row = parseInt(rowInput);
        const col = parseInt(colInput);
        
        if (!isNaN(row) && !isNaN(col)) {
            configValuesStore.addCuboidAtPosition(row, col);
        } else {
            alert("Please enter valid numeric values for row and column.");
        }
    };

    return (
        <>
            <Canvas camera={{ position: [50, 50, 100] }}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <ambientLight intensity={1} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <color attach="background" args={['#f0f0f0']} />
                <CameraControls />
                <Render />
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
