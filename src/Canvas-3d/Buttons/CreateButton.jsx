import { Html } from "@react-three/drei"; // Use Sphere from drei for 3D clickable buttons
import { useStores } from "../../mobx/context/StoreContext";

const CreateButton = ({ position, raw_index, col_index, onRight = true }) => {
  const { configValuesStore } = useStores();

  const onClick = () => {
    if (onRight) {
      configValuesStore.addCuboidAtPosition(raw_index, col_index + 1);
      return;
    }
    configValuesStore.addCuboidAtPosition(raw_index + 1, col_index);
    return;
  };

  return (
    <Html
      position={position} // Position relative to 3D model
      scale={5} // Adjust the size
      center
      zIndexRange={[0, 0]}
    >
      <div
        className="add-icon-container"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/Vector.svg"
          alt=""
          style={{
            width: "25px",
            height: "25px",
          }}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "auto";
          }}
        />
      </div>
    </Html>
  );
};

export default CreateButton;