import { events } from '@alexfdr/three-game-components';
import { PathFollower } from './path-follower';
import { StitchesCollection } from './stitches-collection';
import { colors } from '../data/colors';
import { PATCH_COMPLETE } from '../data/game-const';

export class Patch {
    constructor() {
        this.status = {
            complete: false,
        };
    }

    init(parent, routeData, moveSpeed) {
        this.parent = parent;

        const { correctColor: colorName, totalStitches, points } = routeData;
        const color = colors[colorName];

        this.addPathFollower(points, moveSpeed);
        this.addStitchesCollection(color, totalStitches);
    }

    debug(objectsToSkip = []) {
        const total = 120;
        const step = 1 / total;

        this.stitchesCollection.setColor('green');

        for (let i = 0; i < total - 1; i++) {
            this.pathFollower.progress += step;
            this.pathFollower.progress = Math.min(this.pathFollower.progress, 1);
            this.stitchesCollection.update(this.pathFollower, objectsToSkip);
        }

        if (!this.once) {
            this.once = false;
            this.pathFollower.debug();
        }
    }

    moveOnStart(objectToMove) {
        this.pathFollower.updatePosition(objectToMove);
    }

    addPathFollower(routePoints, speed) {
        this.pathFollower = new PathFollower();
        this.pathFollower.init(routePoints, {
            speed,
            reverseOnComplete: false,
            rotationOnMove: false,
        });
    }

    addStitchesCollection(correctColor, totalStitches) {
        this.stitchesCollection = new StitchesCollection();
        this.stitchesCollection.init(this.parent, { correctColor, totalStitches });
    }

    checkFinalResult() {
        const { incorrectColored } = this.stitchesCollection;
        const isAllStitchesCorrectColor = incorrectColored.length === 0;
        events.emit(PATCH_COMPLETE, isAllStitchesCorrectColor);
    }

    update(objectToMove, objectsToSkip, dt) {
        if (this.pathFollower.finished && !this.status.complete) {
            this.status.complete = true;
            this.checkFinalResult();
            console.log('path complete');
        }

        this.pathFollower.update(objectToMove, dt);
        this.stitchesCollection.update(this.pathFollower, objectsToSkip);
    }
}
