import { assets } from '@alexfdr/three-game-core';
import { DoubleSide, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from 'three';

export class Jeans {
    constructor({ parent }) {
        this.parent = parent;
        this.group = new Object3D();
        this.group.name = 'jeans-group';
        this.parent.add(this.group);
        this.size = 50;

        this.addModel();
        this.applyTransform();
    }

    addModel() {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshLambertMaterial({
            map: assets.textures.get('jeans', {
                repeatX: 2,
                repeatY: 2,
            }),
            side: DoubleSide,
        });
        this.model = new Mesh(geometry, material);
        this.model.name = 'jeans-mesh';
        this.group.add(this.model);
    }

    applyTransform() {
        this.model.position.z = -1;
        this.model.rotateX(Math.PI * 0.5);
        this.model.scale.multiplyScalar(this.size);
    }
}
