import { useStores } from "../../mobx/context/StoreContext";

export function IsRight(raw_index, col_index) {
    const { configValuesStore } = useStores();
    // Case 1: First row, check if the next column is empty
    if (raw_index === 0 && !configValuesStore.hasCuboidAt(raw_index, col_index + 1)) {
      return true;
    }
  
    // Case 2: Any other row, check if the previous row has a cuboid and the current row/column is empty
    if (raw_index > 0 && 
        configValuesStore.hasCuboidAt(raw_index - 1, col_index + 1) && 
        !configValuesStore.hasCuboidAt(raw_index, col_index + 1)) {
      return true;
    }
  
    // Return false if neither condition is met
    return false;
  }

export function IsTop(raw_index, col_index) {
    const { configValuesStore } = useStores();
    // Check if there's no cuboid in the next row at the same column
    return !configValuesStore.hasCuboidAt(raw_index + 1, col_index);
  }
