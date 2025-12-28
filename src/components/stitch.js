import { assets } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { cfg } from '../data/cfg';

export class Stitch {
    constructor({ parent, material, position }) {
        this.parent = parent;
        this.model = null;

        this.group = new Object3D();
        this.group.name = 'stitch-group';
        this.parent.add(this.group);

        this.addModel();
        this.setupMaterials(material);
        this.applyTransform(position);
    }

    addModel() {
        this.model = assets.models.get('stitch');
        this.model.name = 'stitch-model';
        this.group.add(this.model);
    }

    setupMaterials(material) {
        if (material) {
            const stitch = this.model.getObjectByName('stitch');
            stitch.material = material;
        }
    }

    applyTransform(position) {
        const { x, y, z } = position;
        this.model.position.set(x, y, z);
        this.model.scale.multiplyScalar(1.3);

        const scaleY = cfg.get('levels')[0] === 'penguinLevel' ? 0.6 : 0.4;
        this.model.scale.y *= scaleY;
    }
}
