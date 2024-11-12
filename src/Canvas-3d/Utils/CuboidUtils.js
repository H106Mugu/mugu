import { getColorNameFromHex } from "../../components/SubmitFormModal";
import configValuesStore from "../../mobx/stores/configValuesStore";

export const getCuboidParameters = (configValues, raw_index, col_index) => {
  const defaultCuboid = configValues[0][0]; // Default cuboid at [0,0]

  if (!configValues[raw_index]) {
    configValues[raw_index] = {};
  }

  let width, height, startWidth, startHeight;

  // Calculate width from the same column (if exists), otherwise use default
  if (raw_index > 0) {
    width = configValues[raw_index - 1][col_index].width;
    startHeight =
      configValues[raw_index - 1][col_index].startHeight +
      configValues[raw_index - 1][col_index].height / 10;
  } else {
    width = defaultCuboid.width;
    startHeight = defaultCuboid.startHeight;
  }

  // Calculate height from the same row (if exists), otherwise use default
  if (col_index > 0) {
    if (configValues[raw_index][col_index - 1]) {
      // height = configValues[raw_index][col_index - 1].height;
      startWidth =
        configValues[raw_index][col_index - 1].startWidth +
        configValues[raw_index][col_index - 1].width / 10;
    } else {
      // height = configValues[0][col_index - 1].height;
      startWidth =
        configValues[0][col_index - 1].startWidth +
        configValues[0][col_index - 1].width / 10;
    }
  } else {
    // const rowData = configValues[raw_index];
    // const keys = Object.keys(rowData);
    // const rowFirstElement = rowData[keys[0]];
    // if (rowFirstElement) {
    //   height = rowFirstElement.height;
    // } else {
    //   height = defaultCuboid.height;
    // }
    startWidth = defaultCuboid.startWidth;
  }
  const rowData = configValues[raw_index];
  const keys = Object.keys(rowData);
  const rowFirstElement = rowData[keys[0]];
  if (rowFirstElement) {
    height = rowFirstElement.height;
  } else {
    height = defaultCuboid.height;
  }

  return { width, height, startWidth, startHeight };
};

// Function to find the last cuboid in the tallest column for height
export function getLastCuboidInTallestColumn(configValues) {
  let rows = Object.keys(configValues);
  rows = rows.filter((row) => typeof configValues[row] === "object");

  //Remove rows with no cuboids
  rows = rows.filter((row) => {
    const noOfData = Object.keys(configValues[row]).length;
    return noOfData > 0;
  });
  if (rows.length === 0) {
    return [null, null];
  }

  const lastRow = rows[rows.length - 1];
  const lastCol = Object.keys(configValues[lastRow])[0];
  return [configValues[lastRow][lastCol], parseInt(lastRow)];
}

export function getLastCuboidOfFirstRow(configValues) {
  const row = configValues[0]; // First row
  const lastColumnIndex = Object.keys(row).length - 1; // Last column
  const lastCuboid = row[lastColumnIndex];
  return [lastCuboid, lastColumnIndex]; // Return the cuboid in the last column
}

export function getNumberofFrames() {
  const configValues = configValuesStore.configValues;
  let Frames = {};

  Object.keys(configValues).forEach((rowIndex) => {
    const row = configValues[rowIndex];
    if (row && typeof row === "object" && !Array.isArray(row)) {
      Object.keys(row).forEach((colIndex) => {
        const cuboid = row[colIndex];
        if (cuboid && typeof cuboid === "object") {
          const width = cuboid["width"];
          const height = cuboid["height"];
          const depth = cuboid["depth"];

          if (width != null) {
            const incrementValue = rowIndex === "0" ? 4 : 2;
            Frames[`${width} mm`] = (Frames[`${width} mm`] || 0) + incrementValue;
          }

          if (height != null) {
            let incrementValue;
            if (rowIndex !== "0" && colIndex !== "0") {
              if (!configValuesStore.hasCuboidAt(rowIndex, colIndex - 1)) {
                incrementValue = 4;
              } else {
                incrementValue = 2;
              }
            } else {
              incrementValue = colIndex === "0" ? 4 : 2;
            }
            Frames[`${height} mm`] = (Frames[`${height} mm`] || 0) + incrementValue;
          }

          if (depth != null) {
            let incrementValue;
            if (rowIndex === "0" && colIndex === "0") {
              incrementValue = 4;
            } else if ((rowIndex === "0" && colIndex !== "0") || (rowIndex !== "0" && colIndex === "0")) {
              incrementValue = 2;
            } else {
              incrementValue = configValuesStore.hasCuboidAt(rowIndex, colIndex - 1) ? 1 : 2;
            }
            Frames[`${depth} mm`] = (Frames[`${depth} mm`] || 0) + incrementValue;
          }
        }
      });
    }
  });

  // Convert Frames object to the desired string format
  const resultString = Object.entries(Frames)
    .map(([key, value]) => `${key} : ${value}`)
    .join(", ");

  return resultString;
}


export function getNumberOfPanelsAcrylic() {
  // console.log("inside")
  const configValues = configValuesStore.configValues;
  const colorRows = configValuesStore.colorRows;
  let Panles = {};

  Object.keys(colorRows).forEach((rowIndex) => {
    const color = colorRows[rowIndex];
    const colorName = getColorNameFromHex(color, "acrylic");
    const row = rowIndex === "0" ? configValues[rowIndex] : configValues[rowIndex - 1];

    if (colorName && row && typeof row === "object") {
      // Count the total number of columns in the current row
      const columnCount = Object.keys(row).length;

      // Increment the count for the colorName in Panles by the column count
      Panles[colorName] = (Panles[colorName] || 0) + columnCount;
    }
  });

  const resultString = Object.entries(Panles)
    .map(([key, value]) => `${key} : ${value}`)
    .join(", ");

  return resultString;
}

export function getNumberOfPanelsStainless() {
  const configValues = configValuesStore.configValues;
  const color = configValuesStore.configValues.color;
  const colorName = getColorNameFromHex(color, "stainless");

  // console.log("inside")
  let count = 0;
  let Panles = {};
  Object.keys(configValues).forEach((rowIndex) => {
    let row = configValues[rowIndex];

    if (row && typeof row === "object"  && !Array.isArray(row)) {
      const columnCount = Object.keys(row).length;
      if (columnCount > 0) {
        if (rowIndex === "0") {
          if (configValuesStore.configValues.structureElements === "withTopAndBottomOnly") {
            count += (columnCount * 2);          
          }
          else if (configValuesStore.configValues.structureElements === "withoutBack") {
            count += (columnCount * 3) + 1;          
          }
          else if (configValuesStore.configValues.structureElements === "all") {
            count += (columnCount * 4) + 1; 
          }
        }
        else {
          if (configValuesStore.configValues.structureElements === "withTopAndBottomOnly") {
            count += (columnCount);          
          }
          else if (configValuesStore.configValues.structureElements === "withoutBack") {
            count += (columnCount * 2) + 1;          
          }
          else if (configValuesStore.configValues.structureElements === "all") {
            count += (columnCount * 3) + 1; 
          }
        }
      }
    }
  });
  Panles[colorName] = count;

  // Convert Panles object to desired string format
  const resultString = Object.entries(Panles)
    .map(([key, value]) => `${key} : ${value}`)
    .join(", ");

  return resultString;
}

export function getNumberOfPanels() {
  const shelfType = configValuesStore.configValues.shelfType;
  // console.log("shelfType", shelfType);
  if (shelfType === "acrylic") {
    return configValuesStore.configValues.structureElements === "withTopAndBottomOnly" ? getNumberOfPanelsAcrylic() : "Not Applicable";
  } else if (shelfType === "stainless") {
    return getNumberOfPanelsStainless();
  }
};

export function dimensionLimit(value, type) {
  const selectedRawIndex = configValuesStore.selectedCuboid?.rawIndex;
  const selectedColIndex = configValuesStore.selectedCuboid?.colIndex;
  if (selectedRawIndex === null || selectedColIndex === null) {
    return false;
  }
  const oldValue = configValuesStore.configValues[selectedRawIndex]?.[selectedColIndex]?.[type];

  const totalLengthWidth = configValuesStore.totalLength?.width ?? 0;
  const totalLengthHeight = configValuesStore.totalLength?.height ?? 0;
  const newValue = parseInt(value);

  if (type === "width") {
    if (totalLengthWidth + newValue - oldValue > 2500) {
      return true; // Exceeds width limit
    }
  } else if (type === "height") {
    if (totalLengthHeight + newValue - oldValue > 2500) {
      return true; // Exceeds height limit
    }
  }

  return false; // Return true if the new value is within the limit
}

export function checkForLimits(configValues) {
  const shelfType = configValuesStore.configValues.shelfType;
  
  const row0 = configValues[0];
  const [cuboid, rowIndex] = getLastCuboidInTallestColumn(configValues);
  configValuesStore.setSelectedCuboid(0, 0);

  const columnLimit = shelfType === "acrylic" ? 7 : 8;
  const rowLimit = shelfType === "acrylic" ? 6 : 7; // Limit for the number of rows

  // Check if row 0 has more columns than the column limit
  if (row0 && typeof row0 === "object" && Object.keys(row0).length > columnLimit) {
    // Get keys sorted numerically to safely remove columns above the limit
    const columnKeys = Object.keys(row0)
      .map(Number) // Convert to numbers if keys are strings
      .sort((a, b) => a - b);

    // Remove columns beyond the set column limit across all rows
    columnKeys.slice(columnLimit).forEach((colIndex) => {
      Object.keys(configValues).forEach((rowKey) => {
        const row = configValues[rowKey];
        // Only attempt to delete if the row is an object and contains the column index
        if (row && typeof row === "object" && row[colIndex] !== undefined) {
          delete row[colIndex];
        }
      });
    });
  }

  // Check if the number of rows exceeds the row limit
  if (rowIndex > rowLimit) {
    // Get row keys sorted numerically and delete rows above the limit
    const rowKeys = Object.keys(configValues)
      .map(Number) // Convert to numbers if keys are strings
      .sort((a, b) => a - b);

    // Remove rows beyond the set row limit
    rowKeys.slice(rowLimit).forEach((rowKey) => {
      delete configValues[rowKey];
    });
  }
}
