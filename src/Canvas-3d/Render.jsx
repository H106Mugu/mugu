// import React from 'react';
import { observer } from 'mobx-react-lite'; // Import observer from mobx-react-lite
import Model from './Model'; // Assuming Model.jsx is in the same directory
import { useStores } from "../mobx/context/StoreContext";
import { Html, Text } from '@react-three/drei'; // Use Sphere from drei for 3D clickable buttons
import React, { useState } from 'react'; // Import useState to manage local state
import * as THREE from "three"
import './Three.css';

const Render = () => {
    let StartWidth = 0;
    let EndWidth = 0;
    let StartHeight = 0;
    let EndHeight = 0;
    let column = 0;
    let width = 0;
    let height = 0;
    let depth = 0;
    const { configValuesStore } = useStores();
    const rows = Object.keys(configValuesStore.configValues).filter(key => !isNaN(key)); // Get all rows (numeric keys)
    
    
    return (
        <>
            {rows.map(raw_index => {
                const columns = Object.keys(configValuesStore.configValues[raw_index]);

                StartHeight = EndHeight;
                StartWidth = 0;
                EndWidth = 0;
                column = 0; 

                return columns.map((col_index) => {
                    col_index = parseInt(col_index);
                    // console.log("col_index", col_index)
                    // console.log("column", column)
                    // console.log(col_index == column)
                    if (col_index == column) {
                        width = configValuesStore.getConfigValue("width", raw_index, col_index);

                        // Update StartWidth, EndWidth, and EndHeight before rendering each column
                        StartWidth = EndWidth;
                        EndWidth = StartWidth + (width / 10); 
                        
                    }
                    else {
                        for (let i = column; i < col_index + 1; i++) {
                            // console.log("i", i)
                            width = configValuesStore.getConfigValue("width", 0, i);
                            // console.log("width", width)
                            StartWidth = EndWidth;
                            EndWidth = StartWidth + (width / 10); 
                        }
                    }

                    height = configValuesStore.getConfigValue("height", raw_index, col_index);
                    depth = configValuesStore.getConfigValue("depth", raw_index, col_index);

                    EndHeight = StartHeight + (height / 10);

                    column = col_index + 1;
                    console.log(!configValuesStore.hasCuboidAt(raw_index, parseInt(col_index) + 1))
                    
                    return (
                        <React.Fragment key={`${raw_index}-${col_index}`}>
                            <Model
                                keyCuboid={`${raw_index}-${col_index}`}
                                width={width / 10} // Scale down for display purposes
                                height={height / 10} // Scale down for display purposes
                                depth={depth / 10} // Common depth
                                StartWidth={StartWidth}
                                EndWidth={EndWidth}
                                StartHeight={StartHeight} // Pass starting Y position
                                EndHeight={EndHeight} // Pass ending Y position
                            />
                            {
                                (
                                    (parseInt(raw_index) === 0 && !configValuesStore.hasCuboidAt(raw_index, parseInt(col_index) + 1)) || 
                                    (parseInt(raw_index) > 0 && configValuesStore.hasCuboidAt(parseInt(raw_index) - 1, col_index + 1) && !configValuesStore.hasCuboidAt(raw_index, parseInt(col_index) + 1))
                                ) && (
                                    <>
                                        {/* <mesh
                                            position={[EndWidth - (width / 20) + 2, StartHeight, 0]} // Position near the cuboid's right edge
                                            onClick={() => configValuesStore.addCuboidAtPosition(raw_index, parseInt(col_index) + 1)}
                                        >
                                            <sphereGeometry args={[2, 32, 32]} />
                                            <meshStandardMaterial color="white" />
                                        </mesh>
                                        <Text
                                            position={[EndWidth - (width / 20) + 2, StartHeight + 1, 0]} // Position text on the sphere
                                            fontSize={20} // Adjust text size
                                            color="black" // Text color
                                            anchorX="center" // Align text to center
                                            anchorY="middle"
                                        >
                                            +
                                        </Text> */}

                                        <Html
                                            position={[EndWidth - (width / 20) + 2, StartHeight, 0]} // Position relative to 3D model
                                            scale={5} // Adjust the size
                                            center
                                            zIndexRange={[0, 0]}
                                            >
                                            <div
                                                className="add-icon-container"
                                                onClick={() => configValuesStore.addCuboidAtPosition(raw_index, parseInt(col_index) + 1)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src='public/plus-icon.svg'
                                                    alt=""
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                    }}
                                                    onMouseEnter={() => {
                                                        document.body.style.cursor = 'pointer';
                                                    }}
                                                    onMouseLeave={() => {
                                                        document.body.style.cursor = 'auto';
                                                    }}
                                                />
                                            </div>
                                        </Html>
                                    </>
                                )
                            }



                            {/* Render 3D Button for Adding a Row (top of cuboid) */}
                            {!configValuesStore.hasCuboidAt(parseInt(raw_index) + 1, col_index) && (
                                <>
                                {/* <mesh
                                    position={[StartWidth, EndHeight - (height / 20) + 2, 0]} // Position near the cuboid's top edge
                                    onClick={() => configValuesStore.addCuboidAtPosition(parseInt(raw_index) + 1, col_index)}
                                >
                                    <sphereGeometry args={[2, 32, 32]} />
                                    <meshStandardMaterial color="white" />
                                </mesh>
                                <Text
                                    position={[StartWidth, EndHeight - (height / 20) + 3, 0]} // Position text on the sphere
                                    fontSize={20} // Adjust text size
                                    color="black" // Text color
                                    anchorX="center" // Align text to center
                                    anchorY="middle"
                                >
                                    +
                                </Text> */}
                                <Html
                                    position={[StartWidth, EndHeight - (height / 20) + 2, 0]} // Position relative to 3D model
                                    scale={5} // Adjust the size
                                    center
                                    zIndexRange={[0, 0]}
                                    >
                                    <div
                                        className="add-icon-container"
                                        onClick={() => configValuesStore.addCuboidAtPosition(parseInt(raw_index) + 1, col_index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src='public/plus-icon.svg'
                                            alt=""
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                            }}
                                            onMouseEnter={() => {
                                                document.body.style.cursor = 'pointer';
                                            }}
                                            onMouseLeave={() => {
                                                document.body.style.cursor = 'auto';
                                            }}
                                        />
                                    </div>
                                </Html>
                                </>
                            )}
                        </React.Fragment>
                    );
                });
            })}
          {/* {Object.keys(configValuesStore.configValues[0]).map((colIndex) => {
                const column = configValuesStore.configValues[0][colIndex];

                StartWidth = EndWidth; 
                EndWidth = StartWidth + (column.width / 10); 
                
                return (
                    <Model
                        key={colIndex} // Use colIndex as the key for each Model component
                        width={column.width / 10} // Scale down for display purposes
                        height={column.height / 10} // Scale down for display purposes
                        depth={column.depth / 10} // Common depth
                        StartWidth={colIndex * (column.width / 10)} // Position each cuboid based on its column index
                        EndWidth={(colIndex + 1) * (column.width / 10)} // Calculate the end width for each cuboid
                        StartHeight={0} // You can adjust this if you want to position differently
                        EndHeight={column.height / 10} // Position based on the height
                    />
                );
            })} */}
          {/* Render the 3D model with the updated values from configValuesStore */}
          {/* <Model
              width={configValuesStore.getConfigValue("width", 0, 0) / 10} // Scale down for display purposes
              height={configValuesStore.getConfigValue("height", 0, 0) / 10} // Scale down for display purposes
              depth={configValuesStore.getConfigValue("depth", 0, 0) / 10} // Common depth
              StartWidth={StartWidth}
              EndWidth={EndWidth}
              StartHeight={StartHeight} // Pass starting Y position
              EndHeight={EndHeight} // Pass ending Y position
          /> */}
        </>
    );
};

// Wrap the component in observer to respond to MobX store changes
export default observer(Render);
