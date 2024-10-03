import Model from './Model'; // Assuming Model.jsx is in the same directory
import { store } from './store'; // Import the store.js data

export default function Render() {
    const depth = store.depth / 10; // Common depth for all cuboids  
    let StartWidth = 0;
    let EndWidth = 0;
    let StartHeight = 0;
    let EndHeight = 0; 
    
    return (
        <>
      {Object.keys(store).map((rowKey, rowIndex) => {
        const row = store[rowKey];  // Access each row

        // Vertical positioning (Y-axis)
        StartHeight = EndHeight;
        StartWidth = 0;
        EndWidth = 0;
        
        return Object.keys(row).map((columnKey, index) => {
            const cuboid = row[columnKey];
            const { width, height, color, materialType } = cuboid;
            
            // Horizontal positioning (X-axis)
            StartWidth = EndWidth; 
            EndWidth = StartWidth + (width / 10); 
            EndHeight = StartHeight + (height / 10);

          return (
            <Model
              key={`${rowIndex}-${index}`} // Unique key for each cuboid
              width={width / 10} // Scale down for display purposes
              height={height / 10} // Scale down for display purposes
              depth={depth} // Common depth
              color={color} // Pass the color
              materialType={materialType} // Pass material type if needed for further use
              StartWidth={StartWidth}
              EndWidth={EndWidth}
              StartHeight={StartHeight} // Pass starting Y position
              EndHeight={EndHeight} // Pass ending Y position
            />
          );
        });
      })}
    </>
    );
}