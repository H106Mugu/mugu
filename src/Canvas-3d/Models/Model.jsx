/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Pipe, Connector } from "./ModelComponents";
import { pipeConnections, cornerOffsets } from "../Utils/ModelUtils";

const Model = ({width, height, depth, StartWidth, StartHeight }) => {
  
  const { scene } = useLoader(GLTFLoader, "/Models/Material.glb");
  const material = scene.getObjectByName("Plane").material;
  const texture = useLoader(THREE.TextureLoader, "/Models/images.jpg");
  if (texture) {
    material.roughnessMap = texture;
    material.needsUpdate = true;
  }

  const corners = cornerOffsets.map(([x, y, z]) => 
    new THREE.Vector3(
      StartWidth + (x * width) / 2,
      StartHeight + (y * height) / 2,
      (z * depth) / 2
    )
  );

  return (
    <>
      {pipeConnections.map(([start, end], index) => (
      <Pipe key={`pipe-${index}`} start={corners[start]} end={corners[end]} material={material} />
    ))}

    {corners.map((corner, index) => (
      <Connector key={`connector-${index}`} position={corner} material={material} />
    ))}
    </>
  );
};

export default Model;
