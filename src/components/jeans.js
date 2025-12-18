import { assets } from '@alexfdr/three-game-core';
import { DoubleSide, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from 'three';

export class Jeans {
    constructor() {
        this.parent = null;
        this.group = new Object3D();
        this.size = 50;
    }

    init(parent) {
        this.parent = parent;
        this.parent.add(this.group);

        this.addModel();
        this.applyTransform();
    }

    addModel() {
        const geometry = new PlaneGeometry(1, 1);
        const texture = assets.textures.get('jeans', { repeatX: 2, repeatY: 2 });
        const material = new MeshLambertMaterial({
            map: texture,
            side: DoubleSide
        });
        const mesh = new Mesh(geometry, material);

        this.model = mesh;
        this.group.add(this.model);
    }

    applyTransform() {
        this.model.position.z = -1;
        this.model.rotateX(Math.PI * 0.5);
        this.model.scale.multiplyScalar(this.size);
    }
}