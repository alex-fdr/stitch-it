import { events } from '@alexfdr/three-game-components';
import { PathFollower } from './path-follower';
import { StitchesCollection } from './stitches-collection';
import { COLORS, PATCH_COMPLETE } from '../data/game-const';

export class Patch {
    constructor({ parent, routeData, moveSpeed }) {
        this.parent = parent;
        this.isComplete = false;

        const { correctColor: colorName, totalStitches, points } = routeData;
        const color = COLORS[colorName];
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
        this.pathFollower = new PathFollower({
            points: routePoints,
            speed,
            reverseOnComplete: false,
            rotationOnMove: false,
        });
    }

    addStitchesCollection(correctColor, totalStitches) {
        this.stitchesCollection = new StitchesCollection({
            parent: this.parent,
            correctColor,
            totalStitches,
        });
    }

    checkFinalResult() {
        const { incorrectColored } = this.stitchesCollection;
        const isAllStitchesCorrectColor = incorrectColored.length === 0;
        events.emit(PATCH_COMPLETE, isAllStitchesCorrectColor);
    }

    update(objectToMove, objectsToSkip, dt) {
        if (this.pathFollower.finished && !this.isComplete) {
            this.isComplete = true;
            this.checkFinalResult();
            console.log('path complete');
        }

        this.pathFollower.update(objectToMove, dt);
        this.stitchesCollection.update(this.pathFollower, objectsToSkip);
    }
}
