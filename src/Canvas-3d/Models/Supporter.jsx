/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { adjustPositionAndGetRotation } from "../Utils/PositionsUtils";

export const Supporter = ({ position, uniqueKey }) => {
    const scale = [0.8, 0.8, 0.8];
    const { scene } = useLoader(GLTFLoader, "/Models/SuppoterV1.1.glb");
    const clonedScene = scene.clone(true);

    const { adjustedPosition, rotation } = adjustPositionAndGetRotation(parseInt(uniqueKey), position);

    return (
        <primitive object={clonedScene} position={adjustedPosition} scale={scale} rotation={rotation} castShadow receiveShadow/>
    );
};
