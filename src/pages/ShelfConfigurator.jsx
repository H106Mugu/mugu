/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import ShelfSidebar from "../components/ShelfSidebar";
import { useStores } from "../mobx/context/StoreContext";
import { Modal, Button, Radio } from "antd";
import useBreakpoints from "../hooks/useBreakpoints";
import { observer } from "mobx-react-lite";
import CustomCheckbox from "../components/CustomCheckbox";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCube3dSphere } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import Canvas_3d from "../Canvas-3d/Canvas_3d";
import { IoArrowBackOutline } from "react-icons/io5";
import SubmitFormModal from "../components/SubmitFormModal";
import { shouldDisplayRemoveButton } from "../Canvas-3d/Utils/ModelUtils";
import { fitCameraToReset } from "../Canvas-3d/Utils/CameraUtils";
import Loader from "../components/Loader";

const ShelfConfigurator = observer(() => {
  const { modalStore, submitFormStore, configValuesStore, loadingStore } =
    useStores();
  const breakpoint = useBreakpoints();
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setIsMobile(breakpoint === "xs" || breakpoint === "sm");
  }, [breakpoint]);

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked); // Toggle the checked state
    configValuesStore.setShowDimensions();
  };

  const onConfigTypeChange = (e) => {
    configValuesStore.setCurrentConfigType(e.target.value);
  };

  // Handle removing cuboid using values from selectedCuboid
  const handleRemoveCuboid = () => {
    const { rawIndex, colIndex } = configValuesStore.selectedCuboid;

    if (rawIndex !== null && colIndex !== null) {
      configValuesStore.removeCuboid(rawIndex, colIndex); // Call the store's removeCuboid function
    } else {
      console.warn("No cuboid is selected");
    }
  };

  const handleFitCamera = () => {
    console.log("handleFitCamera");
    fitCameraToReset();
  };
  useEffect(() => {
    loadingStore.setLoader(true, "Loading...");

    setTimeout(() => {
      loadingStore.setLoader(false, "Loading...");
    }, 2000);
  }, []);

  return (
    <>
      <Loader
        loader={{
          isLoading: loadingStore.getLoader.isLoading,
          message: loadingStore.getLoader.message,
        }}
      />
      <div className="flex flex-col md:flex-row h-[100dvh] relative">
        <div className="relative bg-gray-100 w-full md:w-[66%] h-[75%] md:h-full flex justify-center items-center">
          <div className="absolute top-3 left-2 flex items-center z-30">
            <Button
              type="link"
              className="gap-1 group !px-0 !py-0 text-theme-primary/70 hover:!text-theme-primary"
            >
              <IoArrowBackOutline className="text-lg group-hover:-ms-px transition-all" />
              <span className="text-[14px] group-hover:ms-px transition-all">
                Back
              </span>
            </Button>
          </div>
          <div className="absolute top-[53px] left-0 right-0 flex items-center z-30 w-full h-px bg-theme-primary" />

          <div className="absolute top-[70px] left-4 flex items-center gap-2 z-30">
            <CustomCheckbox
              checked={checked}
              onChange={handleCheckboxChange}
              label="Dimensions"
              icon={<RxRulerHorizontal />}
            />
            <Button onClick={handleFitCamera} >
              <TbCube3dSphere className="text-theme-primary" />
              Reset cam
            </Button>
          </div>

          {/* <div className="absolute top-[5px] lg:top-[75px] right-4 flex flex-col lg:flex-row items-center gap-0 z-30 transition-top duration-200 pointer-events-none opacity-0 md:opacity-100 md:pointer-events-auto">
            <div className="me-4">Options:</div>
            <Radio.Group
              value={configValuesStore.selectionType}
              onChange={(e) =>
                configValuesStore.setSelectionType(e.target.value)
              }
              optionType="default"
              className="flex flex-row justify-center items-start  gap-1"
            >
              <Radio.Button value="element">Element</Radio.Button>
              <Radio.Button value="panel">Panel</Radio.Button>
            </Radio.Group>
          </div> */}

          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-8 flex items-center gap-2 z-30">
            {shouldDisplayRemoveButton() && (
                <Button onClick={handleRemoveCuboid}>
                  <RiDeleteBinLine className="text-theme-primary" />
                  Remove selected element{" "}
                </Button>
              )}
          </div>

          <div
            className={`absolute  z-30 left-4 flex items-center gap-3 transition-all duration-500
            ${checked ? "opacity-100 top-[110px]" : "opacity-0 top-[100px]"}
            `}
          >
            <div className="flex shadow">
              <div className="border border-gray-300 bg-white p-1 px-2 rounded-l-md text-sm border-r-0">
                <span className="">W</span>:{" "}
                {configValuesStore.totalLength.width.toFixed(0)}
                {" mm "}
              </div>
              <div className="border border-gray-300 bg-white p-1 px-2 text-sm border-r-0">
                <span className="">H</span>:{" "}
                {configValuesStore.totalLength.height.toFixed(0)}
                {" mm "}
              </div>
              <div className="border border-gray-300 bg-white p-1 px-2 rounded-r-md text-sm">
                <span className="">D</span>:{" "}
                {configValuesStore.totalDepth.toFixed(0)}
                {" mm"}
              </div>
            </div>
          </div>
          <Canvas_3d />
        </div>
        <div className="w-full md:w-[34%] h-[240px] md:h-full md:min-w-[450px] p-0 md:p-6 bg-[#fbfbfc] overflow-auto select-none">
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
          Start customising your shelf in just a few easy steps.
        </div>
        <div className="font-[500] text-sm">
          Choose your materials, adjust the dimensions, and select colours to
          create your perfect shelf. Once you're finished, request a quote and
          our team will follow up with pricing.
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
