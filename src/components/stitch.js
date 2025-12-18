import { assets } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { cfg } from '../data/config';

export class Stitch {
    constructor() {
        this.parent = null;
        this.model = null;
        this.group = new Object3D();
    }

    init(parent, data) {
        this.parent = parent;
        this.parent.add(this.group);

        this.addModel(data);
        this.setupMaterials(data);
        this.applyTransform(data);
    }

    addModel() {
        this.model = assets.models.get('stitch');
        this.group.add(this.model);
    }

    setupMaterials(props) {
        const { material } = props;

        if (material) {
            const stitch = this.model.getObjectByName('stitch');
            stitch.material = material;
        }
    }

    applyTransform(props = {}) {
        const { position } = props;
        const { x, y, z } = position;
        this.model.position.set(x, y, z);
        this.model.scale.multiplyScalar(1.3);

        const scaleY = (cfg.get('levels')[0] === 'penguinLevel') ? 0.6 : 0.4;
        this.model.scale.y *= scaleY;
    }
}