import { Mesh, SphereGeometry, MeshPhongMaterial, Texture, DoubleSide } from 'three';

export const athmoshpereCloudsFactory = (
  planetRadius: number,
  atmoshpereMap: string,
  atmoshpereTransMap: string,
): Mesh => {
  // create destination canvas
  const canvasResult = document.createElement('canvas');
  canvasResult.width = 1024;
  canvasResult.height = 512;
  const contextResult = canvasResult.getContext('2d');

  // Declare material early so it can be referenced in async callbacks
  // eslint-disable-next-line prefer-const
  let material: MeshPhongMaterial;

  // load earthcloudmap
  const imageMap = new Image();
  imageMap.addEventListener(
    'load',
    function(): void {
      // create dataMap ImageData for earthcloudmap
      const canvasMap = document.createElement('canvas');
      canvasMap.width = imageMap.width;
      canvasMap.height = imageMap.height;
      const contextMap = canvasMap.getContext('2d');
      contextMap.drawImage(imageMap, 0, 0);
      const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

      // load earthcloudmaptrans
      const imageTrans = new Image();
      imageTrans.addEventListener('load', function(): void {
        // create dataTrans ImageData for earthcloudmaptrans
        const canvasTrans = document.createElement('canvas');
        canvasTrans.width = imageTrans.width;
        canvasTrans.height = imageTrans.height;
        const contextTrans = canvasTrans.getContext('2d');
        contextTrans.drawImage(imageTrans, 0, 0);
        const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
        // merge dataMap + dataTrans into dataResult
        const dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
        for (let y = 0, offset = 0; y < imageMap.height; y++) {
          for (let x = 0; x < imageMap.width; x++, offset += 4) {
            dataResult.data[offset + 0] = dataMap.data[offset + 0];
            dataResult.data[offset + 1] = dataMap.data[offset + 1];
            dataResult.data[offset + 2] = dataMap.data[offset + 2];
            dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
          }
        }
        // update texture with result
        contextResult.putImageData(dataResult, 0, 0);
        material.map.needsUpdate = true;
      });
      imageTrans.src = atmoshpereTransMap;
    },
    false,
  );
  imageMap.src = atmoshpereMap;

  const geometry = new SphereGeometry(planetRadius * 1.03, 32, 32);
  material = new MeshPhongMaterial({
    map: new Texture(canvasResult),
    side: DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  const mesh = new Mesh(geometry, material);

  return mesh;
};

export const athmoshpereFactory = (
  planetRadius: number,
  atmoshpereMap: string,
  atmoshpereTransMap: string,
): Mesh => {
  const geometry = new SphereGeometry(planetRadius * 1.04, 32, 32);
  const material = new MeshPhongMaterial({
    side: DoubleSide,
    transparent: true,
    opacity: 0.1,
    color: 'cyan',
  });

  const mesh = new Mesh(geometry, material);

  return mesh;
};
