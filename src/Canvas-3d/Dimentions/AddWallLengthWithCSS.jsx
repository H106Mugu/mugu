/* eslint-disable no-unused-vars */
import { Html } from "@react-three/drei";
import { useState } from "react";
import { Euler, Vector3 } from "three";
import * as THREE from "three";

const AddWallLengthWithCSS = ({
  position,
  // direction,
  totalLength,
  innerLength,
  // normal,
  // normalZUp,
  rotation = [0, 0, 0],
}) => {
  const number = totalLength;
  // const [diRot, setDiRot] = useState([0, 0, 0]);



  // if (diRot == [0, 0, 0]) {
  //   // setDiRot([-Math.PI / 2, 0, Math.PI / 2]);
  // }
  //   if (normal.equals(new Vector3(0, 1, 0))) diRot.z = Math.PI/2;
  // console.log(diRot)
  //   if (normal.equals(new Vector3(0, 1, 0))) diRot.z = Math.PI / 2;

  //   const directionVector = new Vector3(direction[0], direction[1], 0);
  //   const angle = Math.atan2(directionVector.y, directionVector.x); // Only X and Y plane
  //   const rotation = angle * (180 / Math.PI); // Convert radians to degrees
  //   console.log(directionVector, angle);
  //   const angle = Math.atan2(directionVector.y, directionVector.x);
  //   const directionVector = new Vector3(...normal).normalize();

  // Calculate Euler angles (yaw and pitch) for rotation in 3D space
  //   const euler = new Euler().setFromVector3(directionVector);
  //   console.log("euler", euler);
  //   const rotation = angle * (180 / Math.PI);

  //   if (normal.y) diRot.y = -diRot.y;
  //   const rotation = normal.clone().multiplyScalar(angle);
  // const rotation = normal.clone().multiplyScalar(angle * (180 / Math.PI));
  //   position = new Vector3(...position).add(normal.clone().negate().multiplyScalar(-10));

  return (
    <>
      {
        <Html
          position={position}
          center
          scale={10}
          transform
          rotation={rotation}
          zIndexRange={[10, 0]}
          //   rotation={rotation.toArray()}
          //   rotation={[
          //     (euler.x * Math.PI) / 2,
          //     (euler.y * Math.PI) / 2,
          //     (euler.z * Math.PI) / 2,
          //   ]}
        >
          <div
            className={`HtmlContent`}
            // style={{
            //     transform: `rotate(${rotation}deg)`, // Apply rotation
            //     transformOrigin: 'center', // Set the origin for rotation
            // }}
          >
            {"Outside: " + number + " mm"}
            <br />
            {"Inside: " + innerLength + " mm"}
          </div>
        </Html>
      }
    </>
  );
};

export default AddWallLengthWithCSS;
