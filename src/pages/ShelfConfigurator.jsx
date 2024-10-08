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
import { IoArrowBackOutline } from "react-icons/io5";
import SubmitFormModal from "../components/SubmitFormModal";

const ShelfConfigurator = observer(() => {
  const { modalStore, submitFormStore, configValuesStore } = useStores();
  const breakpoint = useBreakpoints();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(breakpoint === "xs" || breakpoint === "sm");
  }, [breakpoint]);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked); // Toggle the checked state
  };

  const onConfigTypeChange = (e) => {
    configValuesStore.setCurrentConfigType(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-[100dvh] relative">
        <div className="bg-gray-100 w-full md:w-[66%] h-[75%] md:h-full flex justify-center items-center">
          <div className="absolute top-3 left-2 flex items-center z-30">
            <Button
              type="link"
              className="gap-1 !px-0 !py-0 text-theme-primary/70 hover:!text-theme-primary"
            >
              <IoArrowBackOutline className="text-lg" />
              <span className="text-md">Back</span>
            </Button>
          </div>
          <div className="absolute top-[53px] left-0 right-0 flex items-center z-30 w-full md:w-[75%] md:hidden h-px bg-theme-primary" />

          <div className="absolute top-[70px] left-4 flex items-center gap-2 z-30">
            <CustomCheckbox
              checked={checked}
              onChange={handleCheckboxChange}
              label="Dimensions"
              icon={<RxRulerHorizontal />}
            />
            <Button>
              <TbCube3dSphere className="text-theme-primary" />
              Reset cam
            </Button>
          </div>
          <div
            className={`absolute top-[110px] z-30 left-4 flex items-center gap-3 transition-all duration-500 ease-in-out
            ${checked ? "opacity-100" : "opacity-0"}
            `}
          >
            W: 400/H:450/D:400
          </div>
          <Canvas_3d />
        </div>
        <div className="w-full md:w-[34%] h-[220px] md:h-full md:min-w-[450px] p-0 md:p-6 bg-[#fbfbfc] overflow-auto">
          <ShelfSidebar />
        </div>
        <div
          className={`absolute top-3 ${
            isMobile ? "opacity-100 right-3" : "right-0 opacity-0"
          } `}
        >
          <StructureOrColorRadioGroup
            value={configValuesStore.currentConfigType}
            onChange={onConfigTypeChange}
          />
        </div>
      </div>
      <Modal
        width={325}
        centered
        title="Welcome to the 3D Configurator"
        open={!modalStore.getModalState}
        onCancel={() => modalStore.setModalState(true)}
        footer={[
          <Button
            key="start"
            type="default"
            onClick={() => modalStore.setModalState(true)}
            className="w-full"
          >
            Get Started
          </Button>,
        ]}
      >
        <div className="font-[700] text-sm mb-[6px]">
          Start customizing your shelf with a few simple steps.
        </div>
        <div className="font-[500] text-sm">
          Choose your materials, adjust dimensions, and select colors to design
          your perfect shelf. When you're done, request a quote, and our team
          will follow up with pricing.
        </div>
      </Modal>
      <SubmitFormModal
        open={submitFormStore.isModalOpen}
        onClose={() => submitFormStore.setModalOpen(false)}
      />
    </>
  );
});

export default ShelfConfigurator;

const StructureOrColorRadioGroup = ({ value, onChange }) => {
  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      buttonStyle="solid"
      className="flex items-center gap-4 relative"
    >
      <Radio.Button className="z-10" value="type">
        Type
      </Radio.Button>

      {/* Line between the radio buttons */}
      <div className="absolute left-0 right-0 h-px bg-black" />

      <Radio.Button className="z-10" value="structure">
        Structure
      </Radio.Button>

      {/* Line between the radio buttons */}
      {/* <div className="absolute left-[128px] w-16 h-px bg-black" /> */}

      <Radio.Button className="z-10" value="color">
        Colour
      </Radio.Button>
    </Radio.Group>
  );
};
