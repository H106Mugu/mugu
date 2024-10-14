import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStores } from "../mobx/context/StoreContext";
import "./css/Three.css";
import CuboidRenderer from "./Render/cuboidRenderer";

const Render = observer(() => {
  const { configValuesStore } = useStores();
  const [cuboids, setCuboids] = useState([]);

  useEffect(() => {
    const initializeCuboids = () => {
      const allCuboids = [];

      // Flattening the configValuesStore
      Object.entries(configValuesStore.configValues).forEach(
        ([raw_index, columns]) => {
          // Ensure it's a row object (not properties like shelfType or other non-object entries)
          if (typeof columns === "object") {
            Object.entries(columns).forEach(([col_index, cuboid]) => {
              if (cuboid) {
                allCuboids.push({
                  key: `${raw_index}-${col_index}`,
                  width: cuboid?.width || 0,
                  height: cuboid?.height || 0,
                  depth: cuboid?.depth || 0,
                  startWidth: cuboid?.startWidth || 0,
                  startHeight: cuboid?.startHeight || 0,
                  raw_index: parseInt(raw_index),
                  col_index: parseInt(col_index),
                });
              }
            });
          }
        }
      );

      setCuboids(allCuboids);
      console.log("cuboids", allCuboids);
    };

    initializeCuboids(); // Call to initialize cuboids
  }, [configValuesStore.configValues]); // Depend on the store's observable object

  // Render cuboids and pass them to the CuboidRenderer component
  return (
    <>
      {cuboids.map((cuboidData) => (
        <CuboidRenderer key={cuboidData.key} cuboidData={cuboidData} />
      ))}
    </>
  );
});

export default Render;
