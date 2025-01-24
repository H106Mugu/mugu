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
  const configValues = configValuesStore.configValues;
  const colorRows = configValuesStore.colorRows;
  let panels = {};

  Object.keys(colorRows).forEach((rowIndex) => {
    const color = colorRows[rowIndex];
    const colorName = getColorNameFromHex(color, "acrylic");
    const row =
      rowIndex === "0" ? configValues[rowIndex] : configValues[rowIndex - 1];

    if (colorName && row && typeof row === "object") {
      // Iterate through each panel in the row
      Object.values(row).forEach((panel) => {
        const size = `${panel.width} * ${panel.depth}`;

        // Initialize color and size structure in panels
        if (!panels[colorName]) {
          panels[colorName] = {};
        }

        // Increment count for the specific size
        panels[colorName][size] = (panels[colorName][size] || 0) + 1;
      });
    }
  });

  // Convert panels data to a formatted string
  const resultString = Object.entries(panels)
    .map(([colorName, sizes]) => {
      const sizeDetails = Object.entries(sizes)
        .map(([size, count]) => `${size} : ${count}`)
        .join(", ");
      return `${colorName} : [ ${sizeDetails} ]`;
    })
    .join("\n");

  return resultString;
}

export function getNumberOfPanelsStainless() {
  const configValues = configValuesStore.configValues;
  const color = configValuesStore.configValues.color;
  const colorName = getColorNameFromHex(color, "stainless");
  const shelfType = configValuesStore.configValues.structureElements;

  let panels = {};

  // Iterate through each row
  Object.keys(configValues).forEach((rowIndex) => {
    const row = configValues[rowIndex];

    if (row && typeof row === "object" && !Array.isArray(row)) {
      // Iterate through each column in the current row
      Object.keys(row).forEach((columnIndex) => {
        const panel = row[columnIndex];
        const width = panel.width;
        const height = panel.height;
        const depth = panel.depth;

        // Determine the logic based on `rowIndex` and `columnIndex`
        if (rowIndex === "0") {
          if (columnIndex === "0") {
            // First column in the first row
            addPanelEntries(panels, colorName, width, depth, 2); // 2 entries of width * depth
            if (shelfType === "all" || shelfType === "withoutBack") {
              addPanelEntries(panels, colorName, height, depth, 2); // 2 entries of height * depth
            }
            if (shelfType === "all") {
              addPanelEntries(panels, colorName, width, height, 1); // 1 entry of width * height
            }
          } else {
            // Other columns in the first row
            addPanelEntries(panels, colorName, width, depth, 2); // 2 entries of width * depth
            if (shelfType === "all" || shelfType === "withoutBack") {
              addPanelEntries(panels, colorName, height, depth, 1); // 2 entries of height * depth
            }
            if (shelfType === "all") {
              addPanelEntries(panels, colorName, width, height, 1); // 1 entry of width * height
            }
          }
        } else {
          if (columnIndex === "0") {
            // First column in other rows
            addPanelEntries(panels, colorName, width, depth, 1); // 1 entry of width * depth
            if (shelfType === "all" || shelfType === "withoutBack") {
              addPanelEntries(panels, colorName, height, depth, 2); // 2 entries of height * depth
            }
            if (shelfType === "all") {
              addPanelEntries(panels, colorName, width, height, 1); // 1 entry of width * height
            }
          } else {
            // Other columns in other rows
            addPanelEntries(panels, colorName, width, depth, 1); // 1 entry of width * depth
            if (shelfType === "all" || shelfType === "withoutBack") {
              if (configValuesStore.hasCuboidAt(rowIndex, columnIndex - 1)) {
                addPanelEntries(panels, colorName, height, depth, 1); // 2 entries of height * depth
              } else {
                addPanelEntries(panels, colorName, height, depth, 2); // 2 entries of height * depth
              }
            }
            if (shelfType === "all") {
              addPanelEntries(panels, colorName, width, height, 1); // 1 entry of width * height
            }
          }
        }
      });
    }
  });

  // Convert panels data to a formatted string
  const resultString = Object.entries(panels)
    .map(([colorName, sizes]) => {
      const sizeDetails = Object.entries(sizes)
        .map(([size, count]) => `${size} : ${count}`)
        .join(", ");
      return `${colorName} : [ ${sizeDetails} ]`;
    })
    .join("\n");

  return resultString;
}

// Helper function to add panel entries
function addPanelEntries(panels, colorName, dim1, dim2, count) {
  const [smaller, larger] = dim1 < dim2 ? [dim1, dim2] : [dim2, dim1];
  const size = `${smaller} * ${larger}`;
  if (!panels[colorName]) {
    panels[colorName] = {};
  }
  panels[colorName][size] = (panels[colorName][size] || 0) + count;
}

export function getNumberOfPanels() {
  const shelfType = configValuesStore.configValues.shelfType;
  // console.log("shelfType", shelfType);
  if (shelfType === "acrylic") {
    return configValuesStore.configValues.structureElements ===
      "withTopAndBottomOnly"
      ? getNumberOfPanelsAcrylic()
      : "Not Applicable";
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

export function getNumberOfConnectors() {
  const configValues = configValuesStore.configValues;
  let connectors = {
    "3T": 0,
    "4T": 0,
    "5T": 0,
  };

  Object.keys(configValues).forEach((rowIndex) => {
    const row = configValues[rowIndex];
    if (row && typeof row === "object" && !Array.isArray(row)) {
      Object.keys(row).forEach((colIndex) => {
        const rowNum = parseInt(rowIndex);
        const colNum = parseInt(colIndex);

        const hasAbove = configValuesStore.hasCuboidAt(rowNum + 1, colNum);
        const hasRight = configValuesStore.hasCuboidAt(rowNum, colNum + 1);
        const hasLeft = configValuesStore.hasCuboidAt(rowNum, colNum - 1);
        const hasRightAbove = configValuesStore.hasCuboidAt(
          rowNum + 1,
          colNum + 1
        );

        const hasAboveBoth = hasAbove || hasRightAbove;

        if (rowNum === 0 && colNum === 0) {
          // Case: rowIndex === 0 && colIndex === 0
          if (hasAbove && hasRight) {
            connectors["4T"] += 4;
            connectors["5T"] += 4;
          } else if (!hasAbove && hasRight) {
            connectors["3T"] += 2;
            if (!hasRightAbove) {
              connectors["4T"] += 4;
              connectors["5T"] += 2;
            } else {
              connectors["4T"] += 2;
              connectors["5T"] += 4;
            }
          } else if (hasAbove && !hasRight) {
            connectors["4T"] += 8;
          } else {
            connectors["3T"] += 4;
            connectors["4T"] += 4;
          }
        } else if (rowNum === 0 && colNum !== 0) {
          // Case: rowIndex === 0 && colIndex !== 0
          if (hasAboveBoth && hasRight) {
            connectors["5T"] += 4;
          } else if (!hasAboveBoth && hasRight) {
            connectors["4T"] += 2;
            connectors["5T"] += 2;
          } else if (hasAboveBoth && !hasRight) {
            connectors["4T"] += 4;
          } else {
            connectors["3T"] += 2;
            connectors["4T"] += 2;
          }
        } else if (rowNum !== 0 && colNum === 0) {
          // Case: rowIndex !== 0 && colIndex === 0
          if (hasAbove && hasRight) {
            connectors["4T"] += 2;
            connectors["5T"] += 2;
          } else if (!hasAbove && hasRight) {
            connectors["3T"] += 2;
            if (!hasRightAbove) {
              connectors["4T"] += 2;
            } else {
              connectors["5T"] += 2;
            }
          } else if (hasAbove && !hasRight) {
            connectors["4T"] += 4;
          } else {
            connectors["3T"] += 4;
          }
        } else {
          // Case: rowIndex !== 0 && colIndex !== 0
          if (hasAbove && hasRight) {
            connectors["5T"] += 2;
          } else if (!hasAbove && hasRight) {
            hasRightAbove ? (connectors["5T"] += 2) : (connectors["4T"] += 2);
          } else if (hasAbove && !hasRight) {
            connectors["4T"] += 2;
          } else {
            connectors["3T"] += 2;
          }

          if (!hasLeft) {
            hasAbove ? (connectors["4T"] += 2) : (connectors["3T"] += 2);
          }
        }
      });
    }
  });

  return connectors;
}
