import React, { useEffect, useState } from "react";
import ShelfSidebar from "../components/ShelfSidebar";
import { useStores } from "../mobx/context/StoreContext";
import { Modal, Button, Radio } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { observer } from "mobx-react-lite";
import CustomCheckbox from "../components/CustomCheckbox";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCube3dSphere } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import SubmitFormModal from "../components/SubmitFormModal";

const ShelfConfigurator = observer(() => {
  const { modalStore, submitFormStore } = useStores();
  const breakpoint = useBreakpoints();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(breakpoint === "xs" || breakpoint === "sm");
  }, [breakpoint]);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked); // Toggle the checked state
  };

  console.log(
    "ShelfConfigurator -> submitFormStore",
    submitFormStore.getFormFields
  );
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen relative">
        <div className="bg-gray-100 w-full md:w-[75%] h-[75%] md:h-full flex justify-center items-center">
          <div className="absolute top-3 left-4 flex items-center">
            <Button type="link" className="gap-1 !px-0 !py-0">
              <IoArrowBackOutline className="text-xl text-theme-primary font-semibold" />
              <span className="text-md text-theme-primary font-semibold">
                Back
              </span>
            </Button>
          </div>
          <div className="absolute top-[55px] left-4 flex items-center gap-3">
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
          <div
            className={`absolute top-[95px] left-4 flex items-center gap-3 transition-all duration-500 ease-in-out
            ${checked ? "opacity-100" : "opacity-0"}
            `}
          >
            W: 400/H:450/D:400
          </div>
          3d canvas
        </div>
        <div className="w-full md:w-[25%] min-h-[260px] h-[25%] md:h-full md:min-w-[400px] p-6">
          <ShelfSidebar />
        </div>
        <div
          className={`absolute top-3 ${
            isMobile ? "opacity-100 right-3" : "right-0 opacity-0"
          } `}
        >
          <StructureOrColorRadioGroup />
        </div>
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
      <SubmitFormModal
        open={submitFormStore.isModalOpen}
        onClose={() => submitFormStore.setModalOpen(false)}
      />
    </>
  );
});

export default ShelfConfigurator;

const StructureOrColorRadioGroup = ({ onChange }) => {
  return (
    <Radio.Group
      defaultValue={"structure"}
      onChange={onChange}
      buttonStyle="solid"
      className="flex gap-4"
    >
      <Radio.Button value="structure">Structure</Radio.Button>
      <Radio.Button value="color">Color</Radio.Button>
    </Radio.Group>
  );
};
