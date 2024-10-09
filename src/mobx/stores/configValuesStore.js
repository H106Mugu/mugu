import { makeAutoObservable, observable } from "mobx";
import { getCuboidParameters } from "../../Canvas-3d/Utils/CuboidUtils";

class ConfigValuesStore {
  currentConfigType = "type"; // Initialize currentConfigType with a default value

  selectedCuboid = {
    rawIndex: null,
    colIndex: null,
  };

  // Define your observable state as an object
  configValues = observable({
    shelfType: "",
    structureElements: "",
    color: "",
    0: { // Row 0
      0: { // Column 0
        width: 500, // Width of the cuboid
        height: 500, // Height of the cuboid
        depth: 400,
        startWidth: 0,
        startHeight: 0,
        materialType: 'metal', // Material type of the cuboid
        color: '#ff0000' // Color of the cuboid
      },
    },
  }, { deep: true });

  constructor() {
    // Automatically make properties observable
    makeAutoObservable(this, {
      configValues: observable, // Mark configValues explicitly as observable
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
  
   // Setter for selected cuboid's indices
   setSelectedCuboid(rawIndex, colIndex) {
    this.selectedCuboid.rawIndex = rawIndex;
    this.selectedCuboid.colIndex = colIndex;
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
    const { width, height, startWidth, startHeight } = getCuboidParameters(this.configValues, raw_index, col_index);
  
    // Insert the new cuboid into the configValues store
    this.configValues[raw_index][col_index] = {
      width: width,
      height: height,
      depth: this.configValues[0][0].depth,
      materialType: this.configValues[0][0].materialType,
      color: this.configValues[0][0].color,
      startWidth: startWidth,
      startHeight: startHeight
    };
    this.configValues = { ...this.configValues };
  }
  
}

// Export a singleton instance
export default new ConfigValuesStore();
