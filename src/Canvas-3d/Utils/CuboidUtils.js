export const getCuboidParameters = (configValues, raw_index, col_index) => {
    const defaultCuboid = configValues[0][0]; // Default cuboid at [0,0]

    if (!configValues[raw_index]) {
        configValues[raw_index] = {};
      }
    
      let width, height, startWidth, startHeight;
    
      // Calculate width from the same column (if exists), otherwise use default
      if (raw_index > 0) {
        width = configValues[raw_index - 1][col_index].width;
        startHeight = configValues[raw_index - 1][col_index].startHeight + (configValues[raw_index - 1][col_index].height / 10);
      } else {
        width = defaultCuboid.width;
        startHeight = defaultCuboid.startHeight;
      }
    
      // Calculate height from the same row (if exists), otherwise use default
      if (col_index > 0) {
        if (configValues[raw_index][col_index - 1]) {
          height = configValues[raw_index][col_index - 1].height;
          startWidth = configValues[raw_index][col_index - 1].startWidth + (configValues[raw_index][col_index - 1].width / 10);
        } else {
          height = configValues[0][col_index - 1].height;
          startWidth = configValues[0][col_index - 1].startWidth + (configValues[0][col_index - 1].width / 10);
        }     
      } else {
        height = defaultCuboid.height;
        startWidth = defaultCuboid.startWidth;
      }

    return { width, height, startWidth, startHeight };
};

// Function to find the last cuboid in the tallest column for height
export function getLastCuboidInTallestColumn(configValues) {

  let highestRowIndex = -1;

  // Find the highest row index
  Object.keys(configValues).forEach((rowIndex) => {
    const row = configValues[rowIndex];
    if (row && typeof row === 'object') { // Ensure the row exists and is an object
      const currentRowIndex = parseInt(rowIndex, 10);
      if (currentRowIndex > highestRowIndex) {
        highestRowIndex = currentRowIndex;
      }
    }
  });

  // Now, get the first existing column of the row with the highest row index
  if (highestRowIndex !== -1) {
    const highestRow = configValues[highestRowIndex];
    if (highestRow && typeof highestRow === 'object') { // Ensure the highest row exists and is an object
      for (const colIndex in highestRow) {
        if (highestRow[colIndex]) { // Check if the column exists
          return highestRow[colIndex]; // Return the first existing cuboid in that row
        }
      }
    }
  }

  if (highestRowIndex > 0) {
    const previousRow = configValues[highestRowIndex - 1];
    if (previousRow && typeof previousRow === 'object') {
      for (const colIndex in previousRow) {
        if (previousRow[colIndex]) { // Check if the cuboid exists in the row above
          return previousRow[colIndex]; // Return the cuboid from the row above
        }
      }
    }
  }

  return null; // If no cuboid is found, return null
}

export function getLastCuboidOfFirstRow(configValues) {
  const row = configValues[0]; // First row
  const lastColumnIndex = Object.keys(row).length - 1; // Last column
  return row[lastColumnIndex]; // Return the cuboid in the last column
}
