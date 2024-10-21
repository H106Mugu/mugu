import { makeAutoObservable } from "mobx";

class LoadingStore {
  loader = {
    isLoading: false,
    message: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Getter function to retrieve loader state
  get getLoader() {
    return this.loader;
  }

  // Setter function to update the loader state
  setLoader(isLoading, message = "") {
    this.loader.isLoading = isLoading;
    this.loader.message = message;
  }
}

const loadingStore = new LoadingStore();
export default loadingStore;
