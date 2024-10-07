import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStores } from "../mobx/context/StoreContext";
import Model from './Model';
import CreateButton from './CreateButton';
import './css/Three.css';
import React from "react";
import { IsRight, IsTop } from "./Utils/PositionsUtils";

const Render = observer(() => {
  const { configValuesStore } = useStores();
  const [cuboids, setCuboids] = useState([]);

  // Effect to update cuboids when configValuesStore changes
  useEffect(() => {
    const initializeCuboids = () => {
      const allCuboids = [];

      // Flattening the configValuesStore
      Object.entries(configValuesStore.configValues).forEach(([raw_index, columns]) => {
        Object.entries(columns).forEach(([col_index, cuboid]) => {
          allCuboids.push({
            key: `${raw_index}-${col_index}`,
            width: cuboid?.width || 0,
            height: cuboid?.height || 0,
            depth: cuboid?.depth || 0,
            StartWidth: cuboid?.StartWidth || 0,
            StartHeight: cuboid?.StartHeight || 0,
            raw_index: parseInt(raw_index),
            col_index: parseInt(col_index)
          });
        });
      });

      setCuboids(allCuboids);
      console.log("allCuboids", allCuboids);
    };

    initializeCuboids(); // Call to initialize cuboids
  }, [configValuesStore.configValues]); // Depend on the store's observable object

  const handleAddCuboid = (raw_index, col_index) => {
    configValuesStore.addCuboidAtPosition(raw_index, col_index); // Add cuboid
  };

  // Render the models and buttons
  return (
    <>
      {cuboids.map(({ key, width, height, depth, StartWidth, StartHeight, raw_index, col_index }) => (
        <React.Fragment key={key}>
          <Model
            keyCuboid={key}
            width={width / 10}
            height={height / 10}
            depth={depth / 10}
            StartWidth={StartWidth}
            StartHeight={StartHeight}
          />
          {IsRight(raw_index, col_index) && (
            <CreateButton
                position={[StartWidth + width / 20 + 2, StartHeight, 0]}
                raw_index={raw_index}
                col_index={col_index}
                onClick={() => handleAddCuboid(raw_index, col_index + 1)} // Add click handler
                isRight={true}
            />
            )}
          {IsTop(raw_index, col_index) && (
            <CreateButton
              position={[StartWidth, StartHeight + height / 20 + 2, 0]}
              raw_index={raw_index}
              col_index={col_index}
              onClick={() => handleAddCuboid(raw_index + 1, col_index)}
              isRight={false}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
});

export default Render;


