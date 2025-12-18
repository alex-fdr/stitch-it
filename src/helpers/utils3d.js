import threeAssets from '@components/three-assets'

function repeatTexture(texture, x, y) {
  texture.repeat.set(x, y);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

class Utils3D {
  // constructor() {

  // }

  getMeshFromModel(key, name) {
    const base = threeAssets.models[key];
    const model = base.scene;
    const mesh = name ? model.getObjectByName(name) : model;
  
    if (model.getObjectByProperty('type', 'SkinnedMesh')) {
      return THREE.SkeletonUtils.clone(mesh);
    }
  
    return mesh.clone();
  }

  getTexture(key, repeatX, repeatY = repeatX, clone = false) {
    let texture = threeAssets.textures[key]
    texture = clone ? texture.clone() : texture

    if (!repeatX) {
      return texture
    }
    
    return repeatTexture(texture, repeatX, repeatY, THREE.RepeatWrapping)
  }

  getObjectSize(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    return size;
  }
}

export const utils3d = new Utils3D()