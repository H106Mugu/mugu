import { useEffect, useState } from "react";
import DimensionLine from "./DimensionLine";
import configValuesStore from "../../mobx/stores/configValuesStore";
import {
  getLastCuboidInTallestColumn,
  getLastCuboidOfFirstRow,
} from "../Utils/CuboidUtils";

const AllDimensionLines = () => {
  // Define an array of points for the dimension lines
  const [dimensionLinesData, setDimensionLinesData] = useState([]);

  // Effect to update dimension lines when configValuesStore.configValues changes
  useEffect(() => {
    const [lastCuboid] = getLastCuboidOfFirstRow(
      configValuesStore.configValues
    );
    const [cuboid] = getLastCuboidInTallestColumn(
      configValuesStore.configValues
    );
    const depth = configValuesStore.configValues[0][0].depth / 10;
    const width = ((lastCuboid.startWidth + 20) * 10 + lastCuboid.width) / 10;
    const height = ((cuboid.startHeight + 25) * 10 + cuboid.height - 10) / 10;

    // Logic to generate dimension lines based on configValues
    const newDimensionLinesData = [
      {
        p1: [width - 10, -24, 0],
        p2: [width - 10, -24, depth],
        totalLength: configValuesStore.totalDepth,
        innerLength: depth * 10,
        rotation: [-Math.PI / 2, 0, Math.PI/2],
      },
      {
        p1: [-52, -25, 0],
        p2: [-52, height - 25, 0],
        totalLength: configValuesStore.totalLength.height,
        innerLength: (height - 5) * 10,
        rotation: [0, 0, Math.PI / 2],
      }, // Use a value from the store
      {
        p1: [-20, -2, depth + 10],
        p2: [width - 20, -2, depth + 10],
        totalLength: configValuesStore.totalLength.width,
        innerLength: width * 10,
        rotation: [-Math.PI / 2, 0, 0],
      }, // Another value from the store
    ];
    setDimensionLinesData(newDimensionLinesData);
  }, [configValuesStore.configValues]); // Dependency array to listen for changes

  return (
    <>
      {configValuesStore.showDimensions &&
        dimensionLinesData.map((line, index) => (
          <DimensionLine key={index} line={line} />
        ))}
    </>
  );
};

export default AllDimensionLines;
