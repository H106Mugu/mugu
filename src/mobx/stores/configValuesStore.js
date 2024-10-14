/* eslint-disable no-unused-vars */
import { makeAutoObservable, observable } from "mobx";
import { getCuboidParameters } from "../../Canvas-3d/Utils/CuboidUtils";

class ConfigValuesStore {
  currentConfigType = "type"; // Initialize currentConfigType with a default value

  selectedCuboid = {
    rawIndex: null,
    colIndex: null,
  };

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
          height: 121, // Height of the cuboid
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
    if (key === "shelfType" || key === "structureElements" || key === "color") {
      this.configValues[key] = value;
      return;
    }

    if (key === "width" || key === "height" || key === "depth") {
      value = parseInt(value);

      // Object.keys(this.configValues).forEach((rowIndex) => {
      //   if (typeof this.configValues[rowIndex] === "object") {
      //     // Ensure it's a row object, not other values like shelfType
      //     Object.keys(this.configValues[rowIndex]).forEach((colIndex) => {
      //       this.configValues[rowIndex][colIndex][key] = value;
      //     });
      //   }
      // });

      // Loop through all rows
      // Log the structure of configValues for debugging
      // console.log("configValues", this.configValues);

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

      // Object.keys(this.configValues).forEach((rowIndex) => {
      //   Object.keys(this.configValues[rowIndex]).forEach((columnIndex) => {
      //     this.configValues[rowIndex][columnIndex][key] = value;
      //   });
      // });
      this.recalculateStartWidthHeight();
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
  }

  get getSelectedCuboidIndex() {
    return this.selectedCuboid;
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
}

// Export a singleton instance
export default new ConfigValuesStore();
