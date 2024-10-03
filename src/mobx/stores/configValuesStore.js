import { makeAutoObservable } from "mobx";

class ConfigValuesStore {
  currentConfigType = "structure"; // Initialize currentConfigType with a default value

  // Define your observable state as an object
  configValues = {
    shelfType: "",
    structureElements: "",
    color: "",
    width: "0",
    height: "0",
    depth: "0",
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
  setConfigValue(key, value) {
    // Update the configValues object based on the key
    this.configValues[key] = value;
  }

  // Getter to retrieve a value based on a key
  getConfigValue(key) {
    return this.configValues[key];
  }

  // Getter to retrieve all configuration values
  get getAllConfigValues() {
    return { ...this.configValues }; // Return a shallow copy of the configValues
  }
}

// Export a singleton instance
export default new ConfigValuesStore();
