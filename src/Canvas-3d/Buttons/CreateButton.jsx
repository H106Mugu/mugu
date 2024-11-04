import { Html } from "@react-three/drei"; // Use Sphere from drei for 3D clickable buttons
import { useStores } from "../../mobx/context/StoreContext";
import { message } from "antd";
import { getCuboidParameters } from "../Utils/CuboidUtils";
import { IoMdInformation } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const CreateButton = ({ position, raw_index, col_index, direction }) => {
  const { configValuesStore } = useStores();
  const [messageApi, contextHolder] = message.useMessage();

  const openMessage = () =>
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

  const handleAddCuboid = (width, height, startWidth, startHeight) => {
    let exceedsLimit;

    if (direction === "right") {
      exceedsLimit = (startWidth + 20) * 10 + width + 15 * (col_index + 2) > 2500;
    } else if (direction === "top") {
      exceedsLimit = (startHeight + 25) * 10 + height - 10 + 15 * (raw_index + 2) > 2500;
    }

    if (exceedsLimit) {
      openMessage();
      return;
    }

    const [newRawIndex, newColIndex] = direction === "right"
    ? [raw_index, col_index + 1]
    : direction === "top"
      ? [raw_index + 1, col_index]
      : direction === "left"
        ? [raw_index, col_index - 1]
        : [raw_index, col_index]; // Default case, should not happen
    configValuesStore.addCuboidAtPosition(newRawIndex, newColIndex);
  };

  const onClick = () => {
    const params = getCuboidParameters(
      configValuesStore.getAllConfigValues,
      direction === "top" ? raw_index + 1 : raw_index,
      direction === "right" ? col_index + 1 : (direction === "left" ? col_index - 1 : col_index)
    );

    handleAddCuboid(
      params.width,
      params.height,
      params.startWidth,
      params.startHeight
    );
  };

  return (
    <Html
      position={position}
      scale={3.5}
      center
      zIndexRange={[0, 0]}
      name="Button"
    >
      <div
        className="add-icon-container tour-btn-add-cuboid"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/Vector.svg"
          alt=""
          style={{ width: "25px", height: "25px" }}
          onMouseEnter={() => (document.body.style.cursor = "pointer")}
          onMouseLeave={() => (document.body.style.cursor = "auto")}
        />
      </div>
      {contextHolder}
    </Html>
  );
};

export default CreateButton;
