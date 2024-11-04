/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
import configValuesStore from "../../mobx/stores/configValuesStore";
import { fitCameraToReset, fitCameraToSideView } from "./CameraUtils";

export async function addImages() {
  const camera = configValuesStore.controlRef;
  const groupRef = configValuesStore.groupRef;

  const canvas = document.getElementById("canvas");
  const parent = canvas.parentElement;

  const dimensionState = configValuesStore.getShowDimensions;

  if (!canvas || !camera || !groupRef) {
    // console.error("Canvas, camera, or groupRef not found");
    return;
  }

  configValuesStore.selectedCuboid = {
    rawIndex: null,
    colIndex: null,
  };

  configValuesStore.setShowHoveredEdges();
  configValuesStore.selectedPanel.rawIndex = null;

  // console.log("dimensionState: ", dimensionState);
  if (dimensionState) {
    configValuesStore.setShowDimensions(false);
  }

  // Step 1: Capture isometricView
  await captureSingleView(
    "isometricView",
    canvas,
    camera,
    groupRef,
    parent,
    0.92
  );


  configValuesStore.setShowHoveredEdges();
  if (dimensionState) {
    configValuesStore.setShowDimensions(true);
  }

  // 2.8 for 3 images
  // 0.92 for 1 image

  // configValuesStore.setIs2D(true);
  // await wait(50);

  // // Step 2: Capture frontView
  // await captureSingleView("frontView", canvas, camera, groupRef, parent, 1.8);

  // // Step 3: Capture sideView
  // await captureSingleView("sideView", canvas, camera, groupRef, parent, 0.6);

  // configValuesStore.setIs2D(false);
}

// New function that handles capturing a specific view
async function captureSingleView(view, canvas, camera, groupRef, parent) {
  const fitToOptions = {
    cover: false,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 20,
  };

  // const { width, height } = getCanvasSize(aspectRatio, canvas); // Adjust aspect ratio for different views
  parent.style.width = "920px"; // Add 'px' to width
  parent.style.height = "1000px"; // Add 'px' to height

  await wait(100);

  switch (view) {
    case "isometricView":
      await fitCameraToReset(); // Adjust camera for isometric view
      break;
    case "frontView":
      await camera.current.fitToBox(groupRef.current, true, fitToOptions); // Fit camera to front view
      // resolve();
      break;
    case "sideView":
      await fitCameraToSideView(); // Adjust camera for top view
      break;
    default:
      // console.error("Invalid view type");
      return;
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));

  const img = await getBlobURL(canvas);
  configValuesStore.imageUrl[view] = img;
  // console.log(`Image captured for ${view}:`, configValuesStore.imageUrl[view]);

  // Reset parent size to full window after capturing
  parent.style.width = "100%";
  parent.style.height = "100%";

  await wait(100);
}

function getBlobURL(inNode) {
  return new Promise((resolve) => {
    inNode.toBlob((data) => {
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
  // console.log(windowWidth, windowHeight);

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
