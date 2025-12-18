import { tweens } from '@alexfdr/three-game-components';
import { core } from '@alexfdr/three-game-core';
import { Object3D, Vector3 } from 'three';
import { cfg } from '../../data/config';
import { CAMERA_SETTINGS } from '../../data/game-const';

export class CameraHelper {
    constructor() {
        this.wrapper = new Object3D();
        this.offset = new Vector3();
        this.position = new Vector3();
        this.lerpSpeed = 0.5;
    }

    init() {
        core.camera.following = this.wrapper;
        this.wrapper.add(core.camera);
        core.scene.add(this.wrapper);

        const preset = cfg.get('camera.preset') || 'default';
        const { offset, position, rotation } = CAMERA_SETTINGS[preset];

        core.camera.position.copy(position);
        core.camera.lookAt(0, 0, 0);
        this.offset.copy(offset);

        if (rotation) {
            const { x, y, z } = rotation;
            this.wrapper.rotation.set(x, y, z);
        }

        console.log(this.wrapper);
    }

    update(targetToFollow) {
        if (!targetToFollow) {
            return;
        }

        this.position.copy(targetToFollow.position);
        this.position.add(this.offset);

        this.wrapper.position.lerp(this.position, this.lerpSpeed);
    }

    focusOnTarget(target, time = 1000, callback = () => { }) {
        const to = new Vector3().copy(target.position);
        const camera = this.wrapper.children[0];
        // tweens.add(this.wrapper.position, to, time);
        // tweens.add(this.wrapper.rotation, { x: 0, y: 0, z: 0 }, time);
        // tweens.add(camera.position, { y: 35 }, time).onComplete(() => callback());
    }
}