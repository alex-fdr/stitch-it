import { applyTransform } from './apply-transform';

export function enableShadows(renderer, scene, props = {}) {
  const {
    type = THREE.PCFShadowMap,
    mapSize = 512,
    bias = 0.0001,
    shadowCamera = {},
    debug = false,
  } = props;

  const {
    near = 10,
    far = 500,
    left = -20,
    right = 20,
    top = 20,
    bottom = -20,
  } = shadowCamera;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = type;

  const light = scene.getObjectByProperty('type', 'DirectionalLight');
  light.castShadow = true;

  light.shadow.bias = bias;
  light.shadow.mapSize.width = mapSize;
  light.shadow.mapSize.height = mapSize;

  const { camera } = light.shadow;
  camera.near = near;
  camera.far = far;
  camera.left = left;
  camera.right = right;
  camera.top = top;
  camera.bottom = bottom;

  if (debug) {
    const helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);
  }

  if (!props.shadowPlane || !props.shadowPlane.enabled) {
    return false;
  }

  const {
    color = 0x000000,
    opacity = 0.5,
  } = props.shadowPlane;

  const geometry = new THREE.PlaneBufferGeometry(1, 1);

  const material = new THREE.ShadowMaterial({
    color,
    opacity,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  scene.add(plane);

  applyTransform(plane, props.shadowPlane);

  return plane;
}
