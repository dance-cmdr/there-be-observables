import { Mesh, SphereGeometry, MeshPhongMaterial, Texture, DoubleSide } from 'three';

export const athmoshpereCloudsFactory = (
  planetRadius: number,
  atmoshpereMap: string,
  atmoshpereTransMap: string,
): Mesh => {
  // create destination canvas
  var canvasResult = document.createElement('canvas');
  canvasResult.width = 1024;
  canvasResult.height = 512;
  var contextResult = canvasResult.getContext('2d');

  // load earthcloudmap
  var imageMap = new Image();
  imageMap.addEventListener(
    'load',
    function(): void {
      // create dataMap ImageData for earthcloudmap
      var canvasMap = document.createElement('canvas');
      canvasMap.width = imageMap.width;
      canvasMap.height = imageMap.height;
      var contextMap = canvasMap.getContext('2d');
      contextMap.drawImage(imageMap, 0, 0);
      var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

      // load earthcloudmaptrans
      var imageTrans = new Image();
      imageTrans.addEventListener('load', function(): void {
        // create dataTrans ImageData for earthcloudmaptrans
        var canvasTrans = document.createElement('canvas');
        canvasTrans.width = imageTrans.width;
        canvasTrans.height = imageTrans.height;
        var contextTrans = canvasTrans.getContext('2d');
        contextTrans.drawImage(imageTrans, 0, 0);
        var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
        // merge dataMap + dataTrans into dataResult
        var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
        for (var y = 0, offset = 0; y < imageMap.height; y++) {
          for (var x = 0; x < imageMap.width; x++, offset += 4) {
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

  var geometry = new SphereGeometry(planetRadius * 1.03, 32, 32);
  var material = new MeshPhongMaterial({
    map: new Texture(canvasResult),
    side: DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  var mesh = new Mesh(geometry, material);

  return mesh;
};

export const athmoshpereFactory = (
  planetRadius: number,
  atmoshpereMap: string,
  atmoshpereTransMap: string,
): Mesh => {
  var geometry = new SphereGeometry(planetRadius * 1.04, 32, 32);
  var material = new MeshPhongMaterial({
    side: DoubleSide,
    transparent: true,
    opacity: 0.1,
    color: 'cyan',
  });

  const mesh = new Mesh(geometry, material);

  return mesh;
};
