import { makeAutoObservable } from "mobx";

class ConfigValuesStore {
  currentConfigType = "structure"; // Initialize currentConfigType with a default value

  // Define your observable state as an object
  configValues = {
    shelfType: "acrylic",
    structureElements: "withTopAndBottomOnly",
    color: "transparentBlack",
    0: {
      // Row 0
      0: {
        // Column 0
        width: "270", // Width of the cuboid
        height: "121", // Height of the cuboid
        depth: "270",
        materialType: "metal", // Material type of the cuboid
        color: "transparentBlack", // Color of the cuboid
      },
    },
  };

  constructor() {
    // Automatically make properties observable
    makeAutoObservable(this);
  }

  // Setter for currentConfigType
  setCurrentConfigType(value) {
    if (value === "structure" || value === "color") {
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
  setConfigValue(key, value, raw_index = 0) {
    if (key === "shelfType" || key === "structureElements" || key === "color") {
      this.configValues[key] = value;
      return;
    }

    // Update the configValues object for all columns in the specified row
    Object.keys(this.configValues[raw_index]).forEach((colIndex) => {
      this.configValues[raw_index][colIndex][key] = value;
    });
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

  addColumnToRow(rowIndex = 0) {
    const existingColumns = this.configValues[rowIndex];
    const newColumnIndex = Object.keys(existingColumns).length; // Determine the new column index

    // Create a new column with the same data as column 0
    this.configValues[rowIndex][newColumnIndex] = { ...existingColumns[0] };
    console.log("add column called");
  }

  addRow() {
    const rows = Object.keys(this.configValues).filter((key) => !isNaN(key)); // Get numeric rows
    const lastRowIndex = rows.length > 0 ? Math.max(...rows) : 0;
    const newRowIndex = lastRowIndex + 1;
    const previousRow = this.configValues[lastRowIndex];

    // Add new row with the same data as the previous row
    this.configValues[newRowIndex] = { ...previousRow };
  }

  // Add cuboid at specified row and column with data from [0, 0]
  addCuboidAtPosition(raw_index, col_index) {
    if (!this.configValues[raw_index]) {
      this.configValues[raw_index] = {};
    }

    this.configValues[raw_index][col_index] = { ...this.configValues[0][0] };
  }
}

// Export a singleton instance
export default new ConfigValuesStore();
