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
import Tour from "reactour";
import {
  getNumberOfConnectors,
  getNumberofFrames,
  getNumberOfPanels,
} from "../Canvas-3d/Utils/CuboidUtils";
import { get } from "mobx";

let wasCubeSelectedBeforeTour = false;

const ShelfConfigurator = observer(() => {
  // const steps = [
  //   {
  //     title: "Step 1/4: Type",
  //     description: "Choose the base shelf type to begin your configuration.",
  //     target: () => typeBtnRef.current,
  //   },
  //   {
  //     title: "Step 2a/4: Structure",
  //     description:
  //       "Select the structure element and customise its dimensions to fit your needs.",
  //     target: () => structureBtnRef.current,
  //   },
  //   {
  //     title: "Step 2b/4: Shelf Design",
  //     description:
  //       "Add adjacent elements and design your shelf layout exactly how you want.",
  //     target: () => canvasRef.current,
  //   },
  //   {
  //     title: "Step 3/4: Colour",
  //     description:
  //       "Pick a panel and personalise it by selecting the desired colour.",
  //     target: () => colorBtnRef.current,
  //   },
  // ];

  const { modalStore, submitFormStore, configValuesStore, loadingStore } =
    useStores();
  const breakpoint = useBreakpoints();
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);
  const [quantityPanel, setQuantityPanel] = useState("");
  const [quantityConnector, setQuantityConnector] = useState("");
  const [quantityFrame, setQuantityFrame] = useState("");

  const [isTourOpen, setTourOpen] = useState(false);
  const [tourCurrentStep, setTourCurrentStep] = useState(1);
  const accentColor = "#000000";

  useEffect(() => {
    setIsMobile(breakpoint === "xs" || breakpoint === "sm");
  }, [breakpoint]);

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked); // Toggle the checked state
    if (configValuesStore.getShowDimensions) {
      configValuesStore.setShowDimensions(false);
    } else {
      configValuesStore.setShowDimensions(true);
    }
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
    fitCameraToReset();
  };

  const showQuantity = () => {
    setQuantityPanel(getNumberOfPanels());
    setQuantityConnector(getNumberOfConnectors());
    setQuantityFrame(getNumberofFrames());
  };

  useEffect(() => {
    loadingStore.setLoader(true, "Loading");

    setTimeout(() => {
      loadingStore.setLoader(false, "Loading");
    }, 2000);
  }, []);

  const tourConfig = [
    {
      selector: isMobile ? ".tour-btn-type" : ".tour-btn-type-desktop",
      content: ({ goTo }) => (
        <div>
          <div className="mb-2 text-sm font-[700]">Step 1/4: Type</div>
          <div className="text-sm leading-[17px]">
            Choose the base shelf type to begin your configuration.
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Button onClick={() => setTourOpen(false)}>
                <span className="text-[14px]">Skip</span>
              </Button>
            </div>
            <div>
              <Button onClick={() => goTo(1)} type="primary">
                <span className="text-[14px]">Next</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      selector: isMobile
        ? ".tour-btn-structure"
        : ".tour-btn-structure-desktop",
      highlightedSelectors: !isMobile && [
        ".tour-btn-dimension-desktop-width",
        ".tour-btn-dimension-desktop-depth",
        ".tour-btn-dimension-desktop-height",
      ],
      content: ({ goTo }) => (
        <div>
          <div className="mb-2 text-sm font-[700]">Step 2a/4: Structure</div>
          <div className="text-sm leading-[17px]">
            Select the structure element and customise its dimensions to fit
            your needs.
          </div>
          <div className="flex items-center justify-between mt-5">
            <div>
              <Button onClick={() => setTourOpen(false)}>
                <span className="text-[14px]">Skip</span>
              </Button>
            </div>
            <div className="flex items-center gap-[10px]">
              <Button onClick={() => goTo(0)}>
                <span className="text-[14px]">Back</span>
              </Button>
              <Button onClick={() => goTo(2)} type="primary">
                <span className="text-[14px]">Next</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      selector: ".tour-btn-add-cuboid",
      content: ({ goTo }) => (
        <div>
          <div className="mb-2 text-sm font-[700]">Step 2b/4: Shelf Design</div>
          <div className="text-sm leading-[17px]">
            Add adjacent elements and design your shelf layout exactly how you
            want.
          </div>
          <div className="flex items-center justify-between mt-5">
            <div>
              <Button onClick={() => setTourOpen(false)}>
                <span className="text-[14px]">Skip</span>
              </Button>
            </div>
            <div className="flex items-center gap-[10px]">
              <Button onClick={() => goTo(1)}>
                <span className="text-[14px]">Back</span>
              </Button>
              <Button onClick={() => goTo(3)} type="primary">
                <span className="text-[14px]">Next</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      selector: isMobile ? ".tour-btn-color" : ".tour-btn-color-desktop",
      content: ({ goTo }) => (
        <div>
          <div className="mb-2 text-sm font-[700]">Step 3/4: Colour</div>
          <div className="text-sm leading-[17px]">
            Pick a panel and personalise it by selecting the desired colour.
          </div>
          <div className="flex items-center justify-between mt-5">
            <div>
              <Button onClick={() => setTourOpen(false)}>
                <span className="text-[14px]">Skip</span>
              </Button>
            </div>
            <div className="flex items-center gap-[10px]">
              <Button onClick={() => goTo(2)}>
                <span className="text-[14px]">Back</span>
              </Button>
              <Button onClick={() => goTo(4)} type="primary">
                <span className="text-[14px]">Next</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      selector: isMobile ? ".tour-btn-submit" : ".tour-btn-submit-desktop",
      content: ({ goTo }) => (
        <div>
          <div className="mb-2 text-sm font-[700]">Step 4/4: Quotation</div>
          <div className="text-sm leading-[17px]">
            Once your shelf design is complete, submit your configuration for a
            quotation.{" "}
          </div>
          <div className="flex items-center justify-between mt-5">
            <div>
              <Button onClick={() => goTo(0)}>
                <span className="text-[14px]">Start again</span>
              </Button>
            </div>
            <div className="flex items-center gap-[10px]">
              <Button onClick={() => goTo(3)}>
                <span className="text-[14px]">Back</span>
              </Button>
              <Button onClick={() => setTourOpen(false)} type="primary">
                <span className="text-[14px]">Got it</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const closeTour = () => {
    setTourOpen(false);
  };
  const openTour = () => {
    setTourOpen(true);
  };

  useEffect(() => {
    let isCuboidNotSelected =
      configValuesStore.getSelectedCuboidIndex.colIndex === null &&
      configValuesStore.getSelectedCuboidIndex.rawIndex === null;

    if (isTourOpen) {
      if (isCuboidNotSelected) {
        wasCubeSelectedBeforeTour = false;
        configValuesStore.setSelectedCuboid(0, 0);
      } else {
        wasCubeSelectedBeforeTour = true;
      }
    } else {
      setTourCurrentStep(1);
      if (!wasCubeSelectedBeforeTour) {
        configValuesStore.setSelectedCuboid(null, null);
      }
    }
  }, [isTourOpen]);

  useEffect(() => {
    if (isMobile) {
      switch (tourCurrentStep) {
        case 1:
          configValuesStore.setCurrentConfigType("type");
          break;
        case 2:
          configValuesStore.setCurrentConfigType("structure");
          break;
        case 4:
          configValuesStore.setCurrentConfigType("color");
          break;
        default:
          break;
      }
    }
  }, [tourCurrentStep]);

  return (
    <>
      <Loader
        loader={{
          isLoading: loadingStore.getLoader.isLoading,
          message: loadingStore.getLoader.message,
        }}
      />
      <div className="flex flex-col md:flex-row h-[100dvh] relative">
        <div className="relative bg-gray-100 w-full md:w-[66%] flex-1 md:h-full flex justify-center items-center">
          <div className="absolute top-3 left-2 flex items-center z-30">
            <Button
              type="link"
              className="gap-1 group !px-0 !py-0 text-theme-primary/70 hover:!text-theme-primary"
              onClick={() =>
                window.parent.postMessage("https://mugu.com.au", "*")
              }
            >
              <IoArrowBackOutline className="text-lg group-hover:-ms-px transition-all" />
              <span className="text-[14px] group-hover:ms-px transition-all">
                Back
              </span>
            </Button>
          </div>
          <div className="absolute top-[53px] left-0 right-0 flex items-center z-30 w-full h-px bg-theme-primary md:hidden" />

          <div className="absolute top-[70px] md:top-[50px] left-4 flex items-center gap-2 z-30 transition-all duration-300">
            <CustomCheckbox
              checked={checked}
              onChange={handleCheckboxChange}
              label="Dimensions"
              icon={<RxRulerHorizontal />}
            />
            <Button onClick={handleFitCamera}>
              <TbCube3dSphere className="text-theme-primary" />
              Reset cam
            </Button>
            {/* <Button onClick={showQuantity}>Update Quantity</Button> */}
          </div>

          {/* <div className="absolute top-[90px] right-4 z-30 text-xs font-medium text-theme-primary">
            <div>Frame Qunantity: {quantityFrame}</div>
            <div>Panel Quantity: {quantityPanel}</div>
            <div>Connector Quantity: {quantityConnector}</div>
          </div> */}

          <div className="select-none absolute w-[140px] md:w-[200px] -left-[60px] md:-left-[85px] top-1/2 transform -translate-y-1/2 -rotate-90 origin-center flex justify-center items-center gap-2 z-30 transition-all duration-300">
            <span className="text-gray-500 text-[8px] md:text-xs">
              © Mugu. All rights reserved.
            </span>
          </div>

          <div className="absolute bottom-4 md:bottom-6 left-4 flex items-center gap-2 z-30 transition-all duration-300">
            <Button
              type="primary"
              onClick={() => {
                openTour();
              }}
            >
              <span className="pt-1">Tour</span>
            </Button>
          </div>

          <div className="absolute bottom-4 md:bottom-6 right-4 flex items-center gap-2 z-30">
            {shouldDisplayRemoveButton(breakpoint) && (
              <Button onClick={handleRemoveCuboid}>
                <RiDeleteBinLine className="text-theme-primary" />
                Remove selected element{" "}
              </Button>
            )}
          </div>

          <div
            className={`absolute z-30 left-4 flex items-center gap-3 transition-all duration-500 ease-in-out
            ${
              checked
                ? "opacity-100 top-[110px] md:top-[90px]"
                : "opacity-0 top-[100px] md:top-[80px]"
            }
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
        <div className="w-full md:w-[34%] h-[217px] md:h-full md:min-w-[450px] p-0 md:py-6 bg-[#fbfbfc] overflow-auto select-none">
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
        footer={
          <div className="flex flex-col gap-5">
            <Button
              type="primary"
              onClick={() => {
                modalStore.setModalState(true);
                openTour();
              }}
              className="w-full"
            >
              <span className="text-sm">Start Tour</span>
            </Button>
            <Button
              type="default"
              onClick={() => modalStore.setModalState(true)}
              className="w-full"
            >
              <span className="text-sm">Get Started</span>
            </Button>
          </div>
        }
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
      <Tour
        startAt={0}
        onRequestClose={closeTour}
        disableInteraction={true}
        steps={tourConfig}
        isOpen={isTourOpen}
        accentColor={accentColor}
        showNavigation={false}
        className="!rounded-none w-[325px] !max-w-[325px] !shadow-tour-helper-shadow !px-4 !py-8"
        maskClassName="opacity-40"
        showNumber={false}
        highlightedMaskClassName="opacity-0"
        showCloseButton={false}
        showButtons={false}
        maskSpace={5}
        rounded={
          isMobile && [1, 2, 4].includes(tourCurrentStep)
            ? 20
            : [3].includes(tourCurrentStep)
            ? 30
            : 2
        }
        getCurrentStep={(curr) => setTourCurrentStep(curr + 1)}
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
      <Radio.Button className="z-10 tour-btn-type" value="type">
        <span className="tour-btn-type-child">Type</span>
      </Radio.Button>

      <div className="absolute left-0 right-0 h-px bg-black" />

      <Radio.Button className="z-10 tour-btn-structure" value="structure">
        Structure
      </Radio.Button>

      <Radio.Button className="z-10 tour-btn-color" value="color">
        Colour
      </Radio.Button>
    </Radio.Group>
  );
};
