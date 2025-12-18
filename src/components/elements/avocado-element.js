import { assets } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { materials } from '../../helpers/materials';

export class AvocadoElement {
    constructor() {
        this.parent = null;
        this.model = null;
        this.group = new Object3D();
        this.group.name = 'avocado-group';
        this.objectsToSkip = [];
    }

    init(parent, data = {}) {
        this.parent = parent;
        this.parent.add(this.group);

        this.addModel(data);
        this.setupMaterials();
        this.applyTransform();
        this.defineObjectsToSkip();
    }

    addModel(data) {
        this.model = assets.models.get('avocado');
        this.model.name = 'avocado-model';
        this.group.add(this.model);
    }

    debug() {
        const roundTo = (x, digits = 2) => parseFloat(x.toFixed(digits), 10);

        const path = this.model.getObjectByName('path');
        const points = path.children.map((child) => {
            const { x, z } = child.position;
            return { x: roundTo(-x, 2), y: 0, z: roundTo(-z, 2) };
        });
        points.push(points[0]);
        console.log(points);
    }

    setupMaterials() {
        materials.replace(this.model, 'phong');
    }

    applyTransform() {
        this.model.position.set(0, 0, 0);
        this.model.rotation.set(0, Math.PI, 0);
    }

    defineObjectsToSkip() {
        this.objectsToSkip = [
            this.model.getObjectByName('cheeks'),
            this.model.getObjectByName('belly1'),
            this.model.getObjectByName('belly2'),
            this.model.getObjectByName('Mesh005'),
        ];

        // adjust belly size so it will looks always above new stitches
        this.model.getObjectByName('belly1').scale.y *= 2;
    }
}
