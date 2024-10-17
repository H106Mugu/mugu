/* eslint-disable no-unused-vars */
import { cornerOffsets, pipeConnections } from "./ModelUtils";
import * as THREE from 'three';

export const getEdgePoints = (position, size, offset = 2) => {
    const points = [];
  
    // Adjust halfSize for width, height, and depth
    const halfSize = [size[0], size[1], size[2]];
  
    // Generate all 8 corner positions
    // const cornerPoints = cornerOffsets.map(corner => new THREE.Vector3(
    //   position[0] + corner[0] * halfSize[0] + (corner[0] - 0.5) * offset,
    //   position[1] + corner[1] * halfSize[1] + (corner[1] - 0.5) * offset,
    //   position[2] + corner[2] * halfSize[2] + (corner[2] - 0.5) * offset
    // ));

    const cornerPoints = cornerOffsets.map(corner => new THREE.Vector3(
      position[0] + corner[0] * halfSize[0],
      position[1] + corner[1] * halfSize[1],
      position[2] + corner[2] * halfSize[2]
    ));
  
    // Generate edge points by connecting the corresponding corners
    for (const [start, end] of pipeConnections) {
      points.push([cornerPoints[start], cornerPoints[end]]);
    }
  
    return points;
  };
  