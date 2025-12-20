import { assets } from '@alexfdr/three-game-core';
import { AvocadoElement } from './avocado-element';

export class PenguinElement extends AvocadoElement {
    addModel() {
        this.model = assets.models.get('penguin');
        this.model.name = 'penguin-model';
        this.group.add(this.model);
    }

    applyTransform() {
        super.applyTransform();
        this.model.position.y = +0.05;
    }

    defineObjectsToSkip() {
        this.objectsToSkip = [
            this.model.getObjectByName('black'),
            // this.model.getObjectByName('heart'),
            this.model.getObjectByName('face'),
        ];

        const face = this.model.getObjectByName('face');
        face.scale.y *= 1.2;

        // const heart = this.model.getObjectByName('heart');
        // heart.scale.y *= 2

        const black = this.model.getObjectByName('black');
        black.scale.y *= 4;
    }
}
