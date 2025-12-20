import { tweens } from '@alexfdr/three-game-components';
import { assets, Signal } from '@alexfdr/three-game-core';
import { Object3D } from 'three';

export class SewingMachine {
    constructor({ parent, data }) {
        this.parent = parent;
        this.group = new Object3D();
        this.group.name = 'sewing-machine-group';
        this.parent.add(this.group);
        this.onPathComplete = new Signal();

        this.status = {
            active: false,
            pathComplete: false,
        };

        this.addModel();
        this.setupMaterials();
        this.applyTransform(data);
    }

    addModel() {
        this.model = assets.models.get('sewing-machine');
        this.model.name = 'sewing-machine';
        this.group.add(this.model);

        this.needle = this.model.getObjectByName('needle');
        this.needle.name = 'needle';
    }

    setupMaterials() {
        this.needle.material.color.setHex(0xffffff);
    }

    applyTransform(props = {}) {
        const { position = {} } = props;
        const { x = 0, y = 0, z = 0 } = position;
        this.model.position.set(x, y, z);
    }

    setColor(color) {
        const colorPart1 = this.model.getObjectByName('color_change');
        const colorPart2 = this.model.getObjectByName('color_change2');
        colorPart1.material.color.setHex(color);
        colorPart2.material.color.setHex(color);
    }

    activate() {
        this.status.active = true;
        this.animateNeedle();
    }

    deactivate() {
        this.status.active = false;
        this.stopNeedle();
    }

    hide() {
        this.group.visible = false;
    }

    checkFinalResult() {
        const { correctColored, incorrectColored } = this.stitchesCollection;
        const isAllStitchesCorrectColor = incorrectColored.length === 0;
        console.log(correctColored.length, incorrectColored.length, isAllStitchesCorrectColor);

        this.onPathComplete.dispatch(isAllStitchesCorrectColor);
    }

    animateNeedle() {
        this.tweenNeedle = tweens.add(this.needle.position, {
            time: 50,
            to: { y: 0.5 },
            yoyo: true,
            repeat: Infinity,
        });
    }

    stopNeedle() {
        if (this.tweenNeedle) {
            tweens.remove(this.tweenNeedle);
            this.tweenNeedle.stop();
            this.tweenNeedle = null;
        }

        this.needle.position.y = 0;
    }

    update() {}
}
