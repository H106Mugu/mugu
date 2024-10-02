import { makeAutoObservable } from "mobx";

class ConfigValuesStore {
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
