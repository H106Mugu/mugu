/* eslint-disable no-async-promise-executor */
import domtoimage from "dom-to-image";
import configValuesStore from "../../mobx/stores/configValuesStore";
import { fitCameraToReset, fitCameraToTopView } from "./CameraUtils";

export async function addImages() {
  const camera = configValuesStore.controlRef;
  const groupRef = configValuesStore.groupRef;

  return new Promise(async (resolve) => {
    const canvas = document.querySelector("#canvas");
    if (!canvas || !camera || !groupRef) {
      console.error("Canvas, camera, or groupRef not found");
      return;
    }

    const fitToOptions = {
      cover: false,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      paddingTop: 5,
    };

    // Function to capture a single view and store in the configValuesStore
    const captureView = async (view) => {
      const img = await getBlobURL(canvas);
      configValuesStore.imageUrl[view] = img;
      console.log(`Image captured for ${view}:`, configValuesStore.imageUrl[view]);
    };

    // Step 1: Capture frontView
    await camera.current.fitToBox(groupRef.current, true, fitToOptions);  // Fit camera to frontView
    await captureView('frontView');  // Capture frontView

    // Step 2: Capture isometricView
    await fitCameraToReset();  // Adjust camera for isometric view
    await captureView('isometricView');  // Capture isometricView


    // Step 3: Capture sideView
    await fitCameraToTopView();  // Adjust camera for Top view
    await captureView('topView');  // Capture topView

    // Resolve when both views have been captured
    resolve();
  });
}

function getBlobURL(inNode) {
  return new Promise((resolve) => {
    domtoimage.toBlob(inNode).then((data) => {
      const dataUrl = URL.createObjectURL(data);
      resolve(dataUrl); // Resolve the promise with the Blob URL
    });
  });
}
