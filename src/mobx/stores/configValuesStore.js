import { makeAutoObservable, observable } from "mobx";

class ConfigValuesStore {
  currentConfigType = "structure"; // Initialize currentConfigType with a default value

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
        StartWidth: 0,
        StartHeight: 0,
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
    // Update the configValues object for all columns in the specified row
    Object.keys(this.configValues[raw_index]).forEach(colIndex => {
        this.configValues[raw_index][colIndex][key] = value;
    });
  }
  

  // Getter to retrieve a value based on a key
  getConfigValue(key, raw_index, col_index) {
    return this.configValues[raw_index][col_index][key];
  }

  // Getter to retrieve all configuration values
  getAllConfigValues() {
    return { ...this.configValues }; // Return a shallow copy of the configValues
  }

  // Check if a specific row and column has a cuboid
  hasCuboidAt(rowIndex, colIndex) {
    return this.configValues[rowIndex] && this.configValues[rowIndex][colIndex];
  }

  addCuboidAtPosition(raw_index, col_index) {
    const defaultCuboid = this.configValues[0][0]; // Default cuboid at [0,0]
  
    // Check if the row exists, if not, initialize it
    if (!this.configValues[raw_index]) {
      this.configValues[raw_index] = {};
    }
  
    let width, height, startWidth, startHeight;
  
    // Calculate width from the same column (if exists), otherwise use default
    if (raw_index > 0) {
      width = this.configValues[raw_index - 1][col_index].width;
      startHeight = this.configValues[raw_index - 1][col_index].StartHeight + (this.configValues[raw_index - 1][col_index].height / 10);
    } else {
      width = defaultCuboid.width;
      startHeight = defaultCuboid.StartHeight;
    }
  
    // Calculate height from the same row (if exists), otherwise use default
    if (col_index > 0) {
      if (this.configValues[raw_index][col_index - 1]) {
        height = this.configValues[raw_index][col_index - 1].height;
        startWidth = this.configValues[raw_index][col_index - 1].StartWidth + (this.configValues[raw_index][col_index - 1].width / 10);
      } else {
        height = this.configValues[0][col_index - 1].height;
        startWidth = this.configValues[0][col_index - 1].StartWidth + (this.configValues[0][col_index - 1].width / 10);
      }     
    } else {
      height = defaultCuboid.height;
      startWidth = defaultCuboid.StartWidth;
    }
  
    // Insert the new cuboid into the configValues store
    this.configValues[raw_index][col_index] = {
      width: width, // Calculated width from the same column
      height: height, // Calculated height from the same row
      depth: defaultCuboid.depth, // Use depth from [0,0]
      materialType: defaultCuboid.materialType, // Use materialType from [0,0]
      color: defaultCuboid.color, // Use color from [0,0]
      StartWidth: startWidth, // Calculated StartWidth based on the previous cuboid in the same column
      StartHeight: startHeight // Calculated StartHeight based on the previous cuboid in the same row
    };
    console.log(this.configValues[raw_index][col_index], raw_index, col_index);
    this.configValues = { ...this.configValues }; // Create a shallow copy to trigger reactivity
  }
  
}

// Export a singleton instance
export default new ConfigValuesStore();
