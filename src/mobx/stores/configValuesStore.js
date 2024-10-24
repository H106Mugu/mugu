/* eslint-disable no-unused-vars */
import { autorun, makeAutoObservable, observable } from "mobx";
import {
  getCuboidParameters,
  getLastCuboidInTallestColumn,
  getLastCuboidOfFirstRow,
} from "../../Canvas-3d/Utils/CuboidUtils";

class ConfigValuesStore {
  currentConfigType = "type"; // Initialize currentConfigType with a default value

  selectedCuboid = {
    rawIndex: null,
    colIndex: null,
  };

  groupRef = null;

  controlRef = null;

  is2D = observable.box(false);
  selectedPanel = {
    rawIndex: null,
  };

  totalLength = {
    width: 300,
    height: 350,
  };

  showDimensions = observable.box(false);

  totalDepth = 300;

  imageUrl = {
    frontView: null,
    sideView: null,
    isometricView: null,
  };

  // New property to store previous shelfType
  previousShelfType = null;

  // Getter for previousShelfType
  get getPreviousShelfType() {
    return this.previousShelfType;
  }

  // Set the previousShelfType manually (if needed)
  setPreviousShelfType(value) {
    this.previousShelfType = value;
  }

  get getAllImagesUrl() {
    return { ...this.imageUrl };
  }

  colorRows = {
    0: "#f7531d",
    1: "#f7531d",
  };

  get getIs2d() {
    return this.is2D.get();
  }

  get getShowDimensions() {
    return this.showDimensions.get();
  }

  // Define your observable state as an object
  configValues = observable(
    {
      shelfType: "acrylic",
      structureElements: "withTopAndBottomOnly",
      color: "#f7531d",
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
    console.log("class initialized");
    // Automatically make properties observable
    makeAutoObservable(this, {
      configValues: observable, // Mark configValues explicitly as observable
      is2D: observable,
    });

    // Automatically update totalLength.width whenever configValues changes
    autorun(() => {
      const [lastCuboid, lastColumnIndex] = getLastCuboidOfFirstRow(
        this.configValues
      );
      if (lastCuboid) {
        this.totalLength.width = parseInt(
          (lastCuboid.startWidth + 20) * 10 +
            lastCuboid.width +
            15 * (lastColumnIndex + 2)
        );
      }
    });

    // Automatically update totalLength.height based on the column with the most rows
    autorun(() => {
      const [cuboid, rowIndex] = getLastCuboidInTallestColumn(
        this.configValues
      );
      if (cuboid) {
        this.totalLength.height = parseInt(
          (cuboid.startHeight + 25) * 10 +
            cuboid.height -
            10 +
            15 * (rowIndex + 2)
        );
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

  setShowDimensions() {
    this.showDimensions.set(!this.showDimensions.get());
    console.log("inside store", this.showDimensions.get());
  }

  setgroupRef(value) {
    this.groupRef = value;
  }

  setIs2D(value) {
    this.is2D.set(value);
  }

  setResetCamera() {
    this.ResetCam.value = !this.ResetCam.value;
  }

  // Getter for groupRef
  get getgroupRef() {
    return this.groupRef;
  }

  // Getter for currentConfigType
  get getCurrentConfigType() {
    return this.currentConfigType;
  }
  get getControlRef() {
    return this.controlRef;
  }

  setControlRef(value) {
    this.controlRef = value;
  }
  // Define a single action to set values based on key
  setConfigValue(key, value) {
    let raw_index = this.selectedCuboid.rawIndex;
    let col_index = this.selectedCuboid.colIndex;

    if (key === "shelfType" || key === "structureElements" || key === "color") {
      if (key === "shelfType") {
        if (this.previousShelfType !== this.configValues.shelfType) {
          this.previousShelfType = this.configValues.shelfType;
        }
      }

      if (key !== "color") {
        this.configValues[key] = value;
      }

      if (key === "structureElements" && value === "withoutShelves") {
        // reset all the colorRows
        Object.keys(this.colorRows).forEach((key) => {
          this.colorRows[key] = "";
        });
      }

      if (key === "structureElements" && value === "withTopAndBottomOnly") {
        // reset all the colorRows
        Object.keys(this.colorRows).forEach((key) => {
          if (this.colorRows[key] === "") {
            this.colorRows[key] = "#f7531d";
          }
        });
      }

      if (key === "color") {
        if (this.configValues.shelfType === "acrylic") {
          this.colorRows[this.selectedPanel.rawIndex] = value;
        } else if (this.configValues.shelfType === "stainless") {
          this.configValues.color = value;
        }
      }
      this.configValues = { ...this.configValues };
      return;
    }

    // Handle width: update the value in all rows of a particular column (colIndex)
    if (key === "width") {
      value = parseInt(value);
      if (raw_index != null) {
        const oldValue = this.configValues[raw_index][col_index][key];
        if (this.totalLength.width + value - oldValue > 2500) {
          return;
        }
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
      // else {
      //   alert("Please select a cuboid first");
      // }
    }

    // Handle height: update the value in all columns of a particular row (raw_index)
    if (key === "height") {
      value = parseInt(value);
      if (raw_index != null) {
        const oldValue = this.configValues[raw_index][col_index][key];
        if (this.totalLength.height + value - oldValue > 2500) {
          return;
        }
      }
      if (raw_index !== null) {
        Object.keys(this.configValues[raw_index]).forEach((colIndex) => {
          this.configValues[raw_index][colIndex][key] = value;
        });
        this.recalculateStartWidthHeight(col_index, parseInt(value));
        this.configValues = { ...this.configValues };
        return;
      }
    }

    // Handle depth: update the value in all cells (all rows and columns)
    if (key === "depth") {
      value = parseInt(value);

      if (raw_index != null) {
        Object.keys(this.configValues).forEach((configKey) => {
          const row = this.configValues[configKey];
          if (row && typeof row === "object" && !Array.isArray(row)) {
            Object.keys(row).forEach((colIndex) => {
              const cuboid = row[colIndex];
              if (cuboid && typeof cuboid === "object") {
                cuboid[key] = value;
              }
            });
          }
        });
        this.totalDepth = value + 30;
        this.configValues = { ...this.configValues };
        return;
      }
    }
  }

  setConfigDimensionAtPosition(key, value, raw_index, col_index) {
    // Handle width: update the value in all rows of a particular column (colIndex)
    if (key === "width") {
      value = parseInt(value);
      if (raw_index != null) {
        const oldValue = this.configValues[raw_index][col_index][key];
        if (this.totalLength.width + value - oldValue > 2500) {
          return;
        }
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
      // else {
      //   alert("Please select a cuboid first");
      // }
    }

    // Handle height: update the value in all columns of a particular row (raw_index)
    if (key === "height") {
      value = parseInt(value);
      if (raw_index != null) {
        const oldValue = this.configValues[raw_index][col_index][key];
        if (this.totalLength.height + value - oldValue > 2500) {
          return;
        }
      }
      if (raw_index !== null) {
        Object.keys(this.configValues[raw_index]).forEach((colIndex) => {
          this.configValues[raw_index][colIndex][key] = value;
        });
        this.recalculateStartWidthHeight(col_index, parseInt(value));
        this.configValues = { ...this.configValues };
        return;
      }
    }

    // Handle depth: update the value in all cells (all rows and columns)
    if (key === "depth") {
      value = parseInt(value);

      if (raw_index != null) {
        Object.keys(this.configValues).forEach((configKey) => {
          const row = this.configValues[configKey];
          if (row && typeof row === "object" && !Array.isArray(row)) {
            Object.keys(row).forEach((colIndex) => {
              const cuboid = row[colIndex];
              if (cuboid && typeof cuboid === "object") {
                cuboid[key] = value;
              }
            });
          }
        });
        this.totalDepth = value + 30;
        this.configValues = { ...this.configValues };
        return;
      }
    }
    // this.configValues = { ...this.configValues };
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

  setSelectedPanel(raw_index) {
    this.selectedPanel.rawIndex = raw_index;
    this.selectedPanel = { ...this.selectedPanel };
  }
  get getSelectedPanel() {
    return this.selectedPanel.rawIndex;
  }

  setColorRows(key, value) {
    this.colorRows[key] = value;
    this.colorRows = { ...this.colorRows };
  }

  get getColorRows() {
    return this.colorRows;
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
    if (startHeight * 10 + 250 + height > 2500) {
      return;
    }
    if (startWidth * 10 + 200 + width > 2500) {
      return;
    }

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

    if (!this.colorRows[raw_index + 1]) {
      this.colorRows[raw_index + 1] = "#f7531d";
    }

    this.configValues = { ...this.configValues };
  }

  removeCuboid(raw_index, col_index) {
    if (
      this.configValues[raw_index] &&
      this.configValues[raw_index][col_index]
    ) {
      const nextRow = this.configValues[parseInt(raw_index) + 1];
      const nextColumn = this.configValues[raw_index][parseInt(col_index) + 1];
      if (
        (nextRow && nextRow[col_index]) ||
        (raw_index === 0 && nextColumn) ||
        (raw_index === 0 && col_index === 0)
      ) {
        this.errorMessage = `Cannot be deleted: There is a cuboid above at row ${
          raw_index + 1
        }, column ${col_index} or a cuboid to the right.`;
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
