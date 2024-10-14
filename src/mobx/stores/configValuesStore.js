/* eslint-disable no-unused-vars */
import { autorun, makeAutoObservable, observable } from "mobx";
import { getCuboidParameters, getLastCuboidInTallestColumn, getLastCuboidOfFirstRow } from "../../Canvas-3d/Utils/CuboidUtils";

class ConfigValuesStore {
  currentConfigType = "type"; // Initialize currentConfigType with a default value

  selectedCuboid = {
    rawIndex: null,
    colIndex: null,
  };

  totalLength = {
    width: 270,
    height: 330,
  }

  // Define your observable state as an object
  configValues = observable(
    {
      shelfType: "acrylic",
      structureElements: "withTopAndBottomOnly",
      color: "transparentBlack",
      0: {
        // Row 0
        0: {
          // Column 0
          width: 270, // Width of the cuboid
          height: 270, // Height of the cuboid
          depth: 270,
          startWidth: -20,
          startHeight: -19,
          materialType: "metal", // Material type of the cuboid
          color: "#ff0000", // Color of the cuboid
        },
      },
    },
    { deep: true }
  );

  constructor() {
    // Automatically make properties observable
    makeAutoObservable(this, {
      configValues: observable, // Mark configValues explicitly as observable
    });
  
    // Automatically update totalLength.width whenever configValues changes
    autorun(() => {
      const lastCuboid = getLastCuboidOfFirstRow(this.configValues);
      if (lastCuboid) {
        this.totalLength.width = (lastCuboid.startWidth + 20) * 10 + lastCuboid.width;
      }
    });

    // Automatically update totalLength.height based on the column with the most rows
    autorun(() => {
      const lastCuboidInTallestColumn = getLastCuboidInTallestColumn(this.configValues);
      if (lastCuboidInTallestColumn) {
        this.totalLength.height = (lastCuboidInTallestColumn.startHeight + 25) * 10 + lastCuboidInTallestColumn.height;
      }
    });
  }
  
  // Setter for currentConfigType
  setCurrentConfigType(value) {
    if (value === "structure" || value === "color" || value === "type") {
      this.currentConfigType = value;
    } else {
      console.warn(
        "Invalid value for currentConfigType. Must be 'structure' or 'color'."
      );
    }
  }

  // Getter for currentConfigType
  get getCurrentConfigType() {
    return this.currentConfigType;
  }

  // Define a single action to set values based on key
  setConfigValue(key, value) {

    let raw_index = this.selectedCuboid.rawIndex;
    let col_index = this.selectedCuboid.colIndex;

    if (key === "shelfType" || key === "structureElements" || key === "color") {
      this.configValues[key] = value;
      return;
    }

    // Handle width: update the value in all rows of a particular column (colIndex)
    if (key === "width") {
      value = parseInt(value);
      Object.keys(this.configValues).forEach((rowIndex) => {
        if (typeof this.configValues[rowIndex] === "object") {
          if (this.configValues[rowIndex][col_index]) {
            this.configValues[rowIndex][col_index][key] = value; // Update width
          }
        }
      });
      this.recalculateStartWidthHeight(col_index, parseInt(value));
      this.configValues = { ...this.configValues };
      return;
    }

    // Handle height: update the value in all columns of a particular row (raw_index)
    if (key === "height") {
      value = parseInt(value);
      if (raw_index === null) {
        raw_index = 0;
      }
      Object.keys(this.configValues[raw_index]).forEach((colIndex) => {
        this.configValues[raw_index][colIndex][key] = value;
      });
      this.recalculateStartWidthHeight(col_index, parseInt(value));
      this.configValues = { ...this.configValues };
      return;
    }
  
    // Handle depth: update the value in all cells (all rows and columns)
    if (key === "depth") {
      value = parseInt(value);

      // Loop through all rows
      Object.keys(this.configValues).forEach((configKey) => {
        const row = this.configValues[configKey];

        // Ensure it's a row object with cuboids (e.g., not shelfType or color)
        if (row && typeof row === "object" && !Array.isArray(row)) {
          Object.keys(row).forEach((colIndex) => {
            const cuboid = row[colIndex];

            // Update the cuboid with the new value for width/height/depth
            if (cuboid && typeof cuboid === "object") {
              cuboid[key] = value;
            }
          });
        }
      });
      this.configValues = { ...this.configValues };
      return;
    }
    
  }

  // Function to recalculate startWidth for all cuboids in the specified column
  recalculateStartWidthHeight() {
    Object.keys(this.configValues).forEach((rowIndex) => {
      if (typeof this.configValues[rowIndex] === "object") {
        Object.keys(this.configValues[rowIndex]).forEach((columnIndex) => {
          const cuboid = this.configValues[rowIndex][columnIndex];
          if (cuboid) {
            const { width, height, startWidth, startHeight } =
              getCuboidParameters(this.configValues, rowIndex, columnIndex);
            this.configValues[rowIndex][columnIndex].startWidth = startWidth;
            this.configValues[rowIndex][columnIndex].startHeight = startHeight;
          }
        });
      }
    });
  }

  // Setter for selected cuboid's indices
  setSelectedCuboid(rawIndex, colIndex) {
    this.selectedCuboid.rawIndex = rawIndex;
    this.selectedCuboid.colIndex = colIndex;
    this.selectedCuboid = { ...this.selectedCuboid };
  }

  get getSelectedCuboidIndex() {
    return this.selectedCuboid;
  }

  get getTotalLength() {
    return this.totalLength;
  }

  // Getter for selected cuboid's indices
  get getSelectedCuboid() {
    return this.selectedCuboid;
  }

  // Getter to retrieve a value based on a key
  getConfigValue(key, raw_index, col_index) {
    return this.configValues[raw_index][col_index][key];
  }

  // Getter to retrieve all configuration values
  get getAllConfigValues() {
    return { ...this.configValues }; // Return a shallow copy of the configValues
  }

  // Check if a specific row and column has a cuboid
  hasCuboidAt(rowIndex, colIndex) {
    return this.configValues[rowIndex] && this.configValues[rowIndex][colIndex];
  }

  addCuboidAtPosition(raw_index, col_index) {
    const { width, height, startWidth, startHeight } = getCuboidParameters(
      this.configValues,
      raw_index,
      col_index
    );

    // Insert the new cuboid into the configValues store
    this.configValues[raw_index][col_index] = {
      width: width,
      height: height,
      depth: this.configValues[0][0].depth,
      materialType: this.configValues[0][0].materialType,
      color: this.configValues[0][0].color,
      startWidth: startWidth,
      startHeight: startHeight,
    };

    this.configValues = { ...this.configValues };
  }

  removeCuboid(raw_index, col_index) {
    if (this.configValues[raw_index] && this.configValues[raw_index][col_index]) {
      const nextRow = this.configValues[parseInt(raw_index) + 1];
      const nextColumn = this.configValues[raw_index][parseInt(col_index) + 1];
      if ((nextRow && nextRow[col_index]) || (raw_index === 0 && nextColumn) || (raw_index === 0 && col_index === 0)) {
        this.errorMessage = `Cannot be deleted: There is a cuboid above at row ${raw_index + 1}, column ${col_index} or a cuboid to the right.`;
        return; // Exit without deleting
      }
      delete this.configValues[raw_index][col_index];
      this.selectedCuboid.rawIndex = null;
      this.selectedCuboid.colIndex = null;
      this.configValues = { ...this.configValues };
    }
  }
}

// Export a singleton instance
export default new ConfigValuesStore();
