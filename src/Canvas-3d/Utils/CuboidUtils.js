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
    const rowData = configValues[raw_index]
    const keys = Object.keys(rowData);
    const rowFirstElement = rowData[keys[0]];
    if (rowFirstElement) {
      height = rowFirstElement.height;
    }else {
      height = defaultCuboid.height;
    }
    startWidth = defaultCuboid.startWidth;
  }

  return { width, height, startWidth, startHeight };
};

// Function to find the last cuboid in the tallest column for height
export function getLastCuboidInTallestColumn(configValues) {

  let rows = Object.keys(configValues);
  rows = rows.filter((row) => typeof configValues[row] === 'object');

  //Remove rows with no cuboids
  rows = rows.filter((row) => {
    const noOfData = Object.keys(configValues[row]).length;
    return noOfData > 0;
  });
  if (rows.length === 0) {
    return [null, null]
  }

  const lastRow = rows[rows.length - 1];
  const lastCol = Object.keys(configValues[lastRow])[0]
  return [configValues[lastRow][lastCol], parseInt(lastRow)];

}


export function getLastCuboidOfFirstRow(configValues) {
  const row = configValues[0]; // First row
  const lastColumnIndex = Object.keys(row).length - 1; // Last column
  const lastCuboid = row[lastColumnIndex];
  return [lastCuboid, lastColumnIndex]; // Return the cuboid in the last column
}
