/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
import domtoimage from "dom-to-image";
import configValuesStore from "../../mobx/stores/configValuesStore";
import { fitCameraToReset, fitCameraToSideView } from "./CameraUtils";

export async function addImages() {
  const camera = configValuesStore.controlRef;
  const groupRef = configValuesStore.groupRef;

  const canvas = document.querySelector("#canvas");
  const parent = canvas.parentElement;
  
  if (!canvas || !camera || !groupRef) {
    console.error("Canvas, camera, or groupRef not found");
    return;
  }

  // Step 1: Capture isometricView
  await captureSingleView("isometricView", canvas, camera, groupRef, parent, 1.46);

  configValuesStore.setIs2D(true);
  await wait(50);

  // Step 2: Capture frontView
  await captureSingleView("frontView", canvas, camera, groupRef, parent, 0.96);

  // Step 3: Capture topView
  await captureSingleView("topView", canvas, camera, groupRef, parent, 0.46);

  configValuesStore.setIs2D(false);
}

// New function that handles capturing a specific view
async function captureSingleView(view, canvas, camera, groupRef, parent, aspectRatio) {
  const fitToOptions = {
    cover: false,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  };

  const { width, height } = getCanvasSize(aspectRatio, canvas);  // Adjust aspect ratio for different views
  parent.style.width = `${width}px`; // Add 'px' to width
  parent.style.height = `${height}px`; // Add 'px' to height

  await wait(100);

  switch (view) {
    case "isometricView":
      await fitCameraToReset(); // Adjust camera for isometric view
      break;
    case "frontView":
      await camera.current.fitToBox(groupRef.current, true, fitToOptions); // Fit camera to front view
      // resolve();
      break;
    case "topView":
      await fitCameraToSideView(); // Adjust camera for top view
      break;
    default:
      console.error("Invalid view type");
      return;
  }

  const img = await getBlobURL(canvas);
  configValuesStore.imageUrl[view] = img;
  console.log(`Image captured for ${view}:`, configValuesStore.imageUrl[view]);

  // Reset parent size to full window after capturing
  parent.style.width = '100%';
  parent.style.height = '100%';

  await wait(100);
}

function getBlobURL(inNode) {
  return new Promise((resolve) => {
    domtoimage.toBlob(inNode).then((data) => {
      const dataUrl = URL.createObjectURL(data);
      resolve(dataUrl); // Resolve the promise with the Blob URL
    });
  });
}

function wait(inWaitTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, inWaitTime);
  });
}

function getCanvasSize(aspectRatio = 1.4) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  console.log(windowWidth, windowHeight);

  // Check if the window's width or height should be used based on the aspect ratio
  if (windowWidth / windowHeight > aspectRatio) {
    // Use window height to calculate the width
    const height = windowHeight;
    const width = height * aspectRatio;
    return { width, height };
  } else {
    // Use window width to calculate the height
    const width = windowWidth;
    const height = width / aspectRatio;
    return { width, height };
  }
}



window.getCanvasSize = getCanvasSize;
