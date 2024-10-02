import React, { createContext, useContext } from "react";
import modalStore from "../stores/modalStore";
import userStore from "../stores/userStore";
import configValuesStore from "../stores/configValuesStore";
// Create a context
const StoreContext = createContext();

// Create a provider component
export const StoreProvider = ({ children }) => {
  const stores = {
    modalStore,
    userStore,
    configValuesStore,
  };

  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
};

// Custom hook to use the stores
export const useStores = () => {
  return useContext(StoreContext);
};
