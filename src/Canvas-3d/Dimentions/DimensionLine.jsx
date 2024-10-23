/* eslint-disable react/no-unknown-property */
import { Vector3 } from "three";
import Arrow from "./Arrow";
import AddWallLengthWithCSS from "./AddWallLengthWithCSS";

function DimensionLine({ line, offset = 22 }) {
  const p1 = line.p1;
  const p2 = line.p2;
  const totalLength = line.totalLength;
  const innerLength = line.innerLength;
  const rotation = line.rotation;
  const start = new Vector3(p1[0], p1[1], p1[2]);
  const end = new Vector3(p2[0], p2[1], p2[2]);
  const wallLength = start.distanceTo(end);
  const normal = new Vector3()
    .subVectors(end, start)
    .normalize()
    .cross(new Vector3(0, 0, 1)); // Assuming a normal perpendicular to the wall in the Z-plane

  if (!wallLength) return null;

  let position = normal.clone().normalize().multiplyScalar(offset).toArray();
  const midPoint = new Vector3().addVectors(start, end).divideScalar(2);
  const lengthPos = new Vector3(midPoint.x, midPoint.y, midPoint.z);
  const dir1 = new Vector3().subVectors(end, midPoint).normalize();
  const dir2 = new Vector3().subVectors(start, midPoint).normalize();
  const length = wallLength / 2;
  const color = "grey";

  const temp = new Vector3()
    .subVectors(end, start)
    .normalize()
    .cross(new Vector3(1, 0, 0));
  return (
    <>
      <object3D position={position}>
        <Arrow origin={midPoint} dir={dir1} length={length} color={color} />
        <Arrow origin={midPoint} dir={dir2} length={length} color={color} />
        <AddWallLengthWithCSS
          position={lengthPos}
          totalLength={totalLength}
          innerLength={innerLength}
          direction={dir1}
          normal={temp}
          normalZUp={normal}
          rotation={rotation}
        />
      </object3D>
      {/* <Arrow
                origin={start}
                dir={normal}
                length={offset + 2}
                color={color}
                arrowLength={0}
                arrowWidth={0}
            /> */}
      {/* <Arrow
                origin={end}
                dir={normal}
                length={offset + 2}
                color={color}
                arrowLength={0}
                arrowWidth={0}
            /> */}
    </>
  );
}

export default DimensionLine;
