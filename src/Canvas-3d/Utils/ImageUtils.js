import domtoimage from 'dom-to-image';
import configValuesStore from '../../mobx/stores/configValuesStore';

export async function addImage(view) {
    const camera = configValuesStore.controlRef;
    const groupRef = configValuesStore.groupRef;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async () => {
        const canvas = document.querySelector('#canvas');
        console.log('canvas', canvas);
        const parent = canvas.parentElement;
        console.log('parent', parent);

        // if (camera && groupRef) {
        //     parent.style.height = IMG_HEIGHT;
        //     parent.style.width = IMG_WIDTH;
        //     // parent.style.transform = 'translate (50%, 50%)';

        //     await wait(100);
        // }
        const fitToOptions = {
            cover: false,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
            paddingTop: 5,
        };

        // Fit the camera to the groupRef's bounding box
        if (camera && groupRef) {
            await camera.current.fitToBox(groupRef.current, true, fitToOptions);
            console.log('camera', camera);
        }
        const img = await getBlobURL(canvas);

        // Store.imageURL = [...Store.imageURL, img];
        configValuesStore.imageUrl[view] = img;
        console.log('img', configValuesStore.imageUrl[view]);
        // if (camera && groupRef) {
        //     parent.style.width = CANVAS_WIDTH;
        //     parent.style.height = CANVAS_HEIGHT;
        //     resolve();
        // }
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

// function wait(inWaitTime) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, inWaitTime);
//     });
// }