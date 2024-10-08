/* eslint-disable react/no-unknown-property */
export const Connector = ({ position, material }) => {
    return (
      <mesh position={position}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial {...material} />
      </mesh>
    );
  };