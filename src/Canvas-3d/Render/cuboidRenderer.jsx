// CuboidRenderer.js
import React from "react";
import Model from "../Models/Model";
import CreateButton from "../Buttons/CreateButton";
import { IsRight, IsTop, handleAddCuboid } from "../Utils/PositionsUtils";

const CuboidRenderer = ({ cuboidData }) => {
  const { key, width, height, depth, StartWidth, StartHeight, raw_index, col_index } = cuboidData;

  return (
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
          onClick={() => handleAddCuboid(raw_index, col_index + 1)}
          onRight={true}
        />
      )}
      {IsTop(raw_index, col_index) && (
        <CreateButton
          position={[StartWidth, StartHeight + height / 20 + 2, 0]}
          raw_index={raw_index}
          col_index={col_index}
          onClick={() => handleAddCuboid(raw_index + 1, col_index)}
          onRight={false}
        />
      )}
    </React.Fragment>
  );
};

export default CuboidRenderer;
