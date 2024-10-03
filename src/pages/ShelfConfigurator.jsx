import React, { useEffect, useState } from "react";
import ShelfSidebar from "../components/ShelfSidebar";
import { useStores } from "../mobx/context/StoreContext";
import { Modal, Button, Radio } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { observer } from "mobx-react-lite";
import CustomCheckbox from "../components/CustomCheckbox";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCube3dSphere } from "react-icons/tb";
import Canvas_3d from "../Canvas-3d/Canvas_3d";

const ShelfConfigurator = observer(() => {
  const { modalStore } = useStores();
  const breakpoint = useBreakpoints();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(breakpoint === "xs" || breakpoint === "sm");
  }, [breakpoint]);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked); // Toggle the checked state
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen relative">
        <div className="bg-gray-100 w-full md:w-[75%] h-[75%] md:h-full flex justify-center items-center">
          <div className="absolute top-16 md:top-4 left-4 flex items-center gap-3 z-10">
            <CustomCheckbox
              checked={checked}
              onChange={handleCheckboxChange}
              label="Dimensions"
              icon={<RxRulerHorizontal />}
            />
            <Button>
              <TbCube3dSphere />
              Reset cam
            </Button>
          </div>
          <Canvas_3d />
        </div>
        <div className="w-full md:w-[25%] h-[25%] md:h-full md:min-w-[400px] p-6">
          <ShelfSidebar />
        </div>
        {isMobile && (
          <>
            <div className="absolute right-3 top-3">
              <StructureOrColorRadioGroup />
            </div>
            <div className="absolute right-0 left-0 bottom-0 flex py-3 px-4">
              <div className="font-medium">Submit the design for a quote</div>
              <Button size="small" type="primary" className="ms-auto">
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
      <Modal
        centered
        title="Modal Heading"
        open={!modalStore.getModalState}
        onCancel={() => modalStore.setModalState(true)}
        footer={[
          <Button
            key="start"
            type="primary"
            onClick={() => modalStore.setModalState(true)}
          >
            Get Started
          </Button>,
        ]}
      >
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Modal>
    </>
  );
});

export default ShelfConfigurator;

const StructureOrColorRadioGroup = ({ onChange }) => {
  return (
    <Radio.Group onChange={onChange} buttonStyle="solid" className="flex gap-4">
      <Radio.Button value="structure">Structure</Radio.Button>
      <Radio.Button value="color">Color</Radio.Button>
    </Radio.Group>
  );
};
