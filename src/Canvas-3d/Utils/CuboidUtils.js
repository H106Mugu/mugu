export const getCuboidParameters = (configValues, raw_index, col_index) => {
    const defaultCuboid = configValues[0][0]; // Default cuboid at [0,0]

    if (!configValues[raw_index]) {
        configValues[raw_index] = {};
      }
    
      let width, height, startWidth, startHeight;
    
      // Calculate width from the same column (if exists), otherwise use default
      if (raw_index > 0) {
        width = configValues[raw_index - 1][col_index].width;
        startHeight = configValues[raw_index - 1][col_index].startHeight + (configValues[raw_index - 1][col_index].height / 10);
      } else {
        width = defaultCuboid.width;
        startHeight = defaultCuboid.startHeight;
      }
    
      // Calculate height from the same row (if exists), otherwise use default
      if (col_index > 0) {
        if (configValues[raw_index][col_index - 1]) {
          height = configValues[raw_index][col_index - 1].height;
          startWidth = configValues[raw_index][col_index - 1].startWidth + (configValues[raw_index][col_index - 1].width / 10);
        } else {
          height = configValues[0][col_index - 1].height;
          startWidth = configValues[0][col_index - 1].startWidth + (configValues[0][col_index - 1].width / 10);
        }     
      } else {
        height = defaultCuboid.height;
        startWidth = defaultCuboid.startWidth;
      }

    return { width, height, startWidth, startHeight };
};
