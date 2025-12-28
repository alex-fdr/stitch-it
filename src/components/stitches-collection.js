import { events, tweens } from '@alexfdr/three-game-components';
import { Object3D, Raycaster, Vector3 } from 'three';
import { Stitch } from './stitch';
import { getMaterialByColor } from '../helpers/utils/get-material-by-color';
import { utils2d } from '../helpers/utils2d';
import { WRONG_COLOR } from '../data/game-const';

export class StitchesCollection {
    constructor({ parent, correctColor, totalStitches }) {
        this.parent = parent;
        this.correctColor = correctColor;
        this.totalStitches = totalStitches;

        this.group = new Object3D();
        this.group.name = 'stitches-collection';
        this.parent.add(this.group);

        this.step = 1 / this.totalStitches;
        this.localProgress = 0;
        this.stitches = [];
        this.correctColored = [];
        this.incorrectColored = [];

        this.raycaster = new Raycaster();
        this.raycaster.near = 0;
        this.raycaster.far = 10;

        // this.onWrongColor = new signals.Signal()
    }

    addStitch(position, shouldSkip) {
        const stitch = new Stitch({
            parent: this.group,
            material: getMaterialByColor(this.stitchColor),
            position,
        });
        this.stitches.push(stitch);

        if (shouldSkip) {
            // stitch.group.visible = false
            stitch.group.position.y -= 0.5;
        }

        if (this.stitchColor === this.correctColor) {
            this.correctColored.push(stitch);
        } else {
            this.incorrectColored.push(stitch);
            // this.onWrongColor.dispatch()
            events.emit(WRONG_COLOR);
        }
    }

    setColor(stitchColor) {
        this.stitchColor = stitchColor;
    }

    fallOffIncorrectColored(callback = () => {}) {
        this.incorrectColored.forEach((stitch) => {
            const el = stitch.model;
            const { x, y, z } = el.position;
            const time = 500;
            const angle = Math.atan2(z, x);
            const dx = Math.cos(angle) * 3;
            const dz = Math.sin(angle) * 3;
            const dy = 3;
            const delay = utils2d.randomInt(0, 100);

            tweens.add(el.position, { to: { x: x + dx, z: z + dz }, time, delay });
            tweens.add(el.position, {
                to: { y: y + dy },
                time: time * 0.5,
                delay,
                onComplete: () => {
                    tweens.zoomOut3(el, { scaleTo: 0.01, time: time * 0.4, easing: 'sineOut' });
                    tweens.add(el.position, {
                        to: { y: y - dy },
                        time: time * 0.5,
                        onComplete: () => {
                            callback();
                            stitch.group.visible = false;
                        },
                    });
                },
            });
        });
    }

    checkObjectsToSkip(origin, objectsToSkip) {
        const pos = new Vector3().copy(origin);
        pos.y = 5;
        const direction = new Vector3(0, 1, 0);
        this.raycaster.set(origin, direction);

        const intersections = this.raycaster.intersectObjects(objectsToSkip, true);
        return intersections.length > 0;
    }

    update(pathFollower, objectsToSkip = []) {
        if (pathFollower.progress - this.localProgress > this.step) {
            this.localProgress = this.step * (this.stitches.length + 1);
            this.localProgress = Math.min(this.localProgress, 1);

            const spawnPoint = pathFollower.pathCurve.getPointAt(this.localProgress);
            const shouldSkip = this.checkObjectsToSkip(spawnPoint, objectsToSkip);
            this.addStitch(spawnPoint, shouldSkip);
        }
    }
}
