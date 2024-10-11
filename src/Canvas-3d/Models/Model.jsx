/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Connector } from "./Connector";
import { Pipe } from "./Pipe";
import {
  pipeConnections,
  cornerOffsets,
  bottomCornersIndices,
} from "../Utils/ModelUtils";
import { LegScrew } from "./LegScrew";

const Model = ({
  width,
  height,
  depth,
  startWidth,
  startHeight,
  raw_index,
}) => {
  const { scene } = useLoader(GLTFLoader, "/Models/Material.glb");
  const material = scene.getObjectByName("Plane").material;
  const texture = useLoader(THREE.TextureLoader, "/Models/images.jpg");
  if (texture) {
    material.roughnessMap = texture;
    material.needsUpdate = true;
  }

  // console.log("width", width, "startWidth", startWidth);

  const corners = cornerOffsets.map(
    ([x, y, z]) =>
      new THREE.Vector3(
        startWidth + (x * width) / 2,
        startHeight + (y * height) / 2,
        (z * depth) / 2
      )
  );

  const legPipes = bottomCornersIndices.map((index) => {
    const start = corners[index];
    const end = new THREE.Vector3(start.x, start.y - 5, start.z); // 5 units below the corner
    return { start, end };
  });

  return (
    <>
      {pipeConnections.map(([start, end], index) => (
        <Pipe
          key={`pipe-${index}`}
          start={corners[start]}
          end={corners[end]}
          material={material}
        />
      ))}

      {/* Render pipes for the legs */}
      {raw_index === 0 &&
        legPipes.map((pipe, index) => (
          <Pipe
            key={`leg-pipe-${index}`}
            start={pipe.start}
            end={pipe.end}
            material={material}
          />
        ))}

      {corners.map((corner, index) => (
        <Connector
          key={`connector-${index}`}
          position={corner}
          material={material}
        />
      ))}

      {raw_index === 0 &&
        legPipes.map((pipe, index) => (
          <LegScrew
            key={`leg-screw-${index}`}
            position={pipe.end}
            material={material}
          />
        ))}
      {/* <LegScrew/> */}
    </>
  );
};

export default Model;
