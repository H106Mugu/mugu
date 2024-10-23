import { Html } from "@react-three/drei"; // Use Sphere from drei for 3D clickable buttons
import { useStores } from "../../mobx/context/StoreContext";
import { message } from "antd";
import { getCuboidParameters } from "../Utils/CuboidUtils";
import { IoMdInformation } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const CreateButton = ({ position, raw_index, col_index, onRight = true }) => {
  const { configValuesStore } = useStores();

  const [messageApi, contextHolder] = message.useMessage();

  const onClick = () => {
    if (onRight) {
      const { width, startWidth } = getCuboidParameters(
        configValuesStore.getAllConfigValues,
        raw_index,
        col_index + 1
      );
      if (startWidth * 10 + 200 + width > 2500) {
        messageApi.open({
          type: "info",
          icon: (
            <IoMdInformation className="text-black bg-white text-xs me-3 rounded-full" />
          ),
          duration: 5,
          content: (
            <div className="bg-theme-primary text-white text-sm flex items-center">
              {
                "Please note, the total height and width of the shelf unit should not exceed 2.5 meters. Kindly adjust your configuration to stay within these limits."
              }
              <IoCloseOutline
                className="text-white text-lg ms-3 cursor-pointer"
                onClick={() => messageApi.destroy()}
              />
            </div>
          ),
        });
        return;
      } else {
        // configValuesStore.addCuboidAtPosition(raw_index + 1, col_index);
        configValuesStore.addCuboidAtPosition(raw_index, col_index + 1);
      }
      return;
    } else {
      const { height, startHeight } = getCuboidParameters(
        configValuesStore.getAllConfigValues,
        raw_index + 1,
        col_index
      );
      if (startHeight * 10 + 250 + height > 2500) {
        messageApi.open({
          type: "info",
          icon: (
            <IoMdInformation className="text-black bg-white text-xs me-3 rounded-full" />
          ),
          duration: 5,
          content: (
            <div className="bg-theme-primary text-white text-sm flex items-center">
              {
                "Please note, the total height and width of the shelf unit should not exceed 2.5 meters. Kindly adjust your configuration to stay within these limits."
              }
              <IoCloseOutline
                className="text-white text-lg ms-3 cursor-pointer"
                onClick={() => messageApi.destroy()}
              />
            </div>
          ),
        });
        return;
      } else {
        configValuesStore.addCuboidAtPosition(raw_index + 1, col_index);
      }
    }
    return;
  };

  return (
    <Html
      position={position} // Position relative to 3D model
      scale={3.5} // Adjust the size
      center
      zIndexRange={[0, 0]}
    >
      <div
        className="add-icon-container tour-btn-add-cuboid"
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
      {contextHolder}
    </Html>
  );
};

export default CreateButton;
