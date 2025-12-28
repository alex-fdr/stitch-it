import { events } from '@alexfdr/three-game-components';
import { PathFollower } from './path-follower';
import { StitchesCollection } from './stitches-collection';
import { COLORS, PATCH_COMPLETE } from '../data/game-const';

export class Patch {
    constructor({ parent, routeData, speed }) {
        this.parent = parent;
        this.isComplete = false;

        const { correctColor, totalStitches, points } = routeData;

        this.pathFollower = new PathFollower({
            points,
            speed,
            reverseOnComplete: false,
            rotationOnMove: false,
        });

        this.stitchesCollection = new StitchesCollection({
            totalStitches,
            parent: this.parent,
            correctColor: COLORS[correctColor],
        });
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

    checkFinalResult() {
        const { incorrectColored } = this.stitchesCollection;
        const isAllStitchesCorrectColor = incorrectColored.length === 0;
        events.emit(PATCH_COMPLETE, isAllStitchesCorrectColor);
    }

    update(objectToMove, objectsToSkip, dt) {
        if (this.pathFollower.finished && !this.isComplete) {
            this.isComplete = true;
            this.checkFinalResult();
        }

        this.pathFollower.update(objectToMove, dt);
        this.stitchesCollection.update(this.pathFollower, objectsToSkip);
    }
}
