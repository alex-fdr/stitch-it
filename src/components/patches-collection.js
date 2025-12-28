import { events } from '@alexfdr/three-game-components';
import { Patch } from './patch';
import { cfg } from '../data/cfg';
import { PATCHES_COMPLETE_ALL } from '../data/game-const';

export class PatchesCollection {
    constructor({ parent, data }) {
        this.parent = parent;

        this.status = {
            correct: [],
            completed: [],
        };

        const speed = cfg.get('sewingMachine.speed', data.speed);
        this.currentPatchId = 0;
        this.patches = data.routes.map((route) => this.makePatch(route, speed));
        this.currentPatch = this.patches[this.currentPatchId];
    }

    makePatch(routeData, speed) {
        return new Patch({
            parent: this.parent,
            routeData,
            speed,
        });
    }

    nextPatch(objectToMove) {
        this.currentPatchId += 1;

        if (this.currentPatchId >= this.patches.length) {
            this.checkFinalResult();
            return;
        }

        this.currentPatch = this.patches[this.currentPatchId];
        this.currentPatch.moveOnStart(objectToMove);
    }

    setStatus(isPatchCorrect) {
        this.status.correct[this.currentPatchId] = isPatchCorrect;
        this.status.completed[this.currentPatchId] = true;
    }

    getPathFollower() {
        return this.currentPatch.pathFollower;
    }

    getStitchesCollection() {
        return this.currentPatch.stitchesCollection;
    }

    checkFinalResult() {
        let isAllPatchesCorrect = true;

        for (const isCorrect of this.status.correct) {
            if (!isCorrect) {
                isAllPatchesCorrect = false;
            }
        }

        events.emit(PATCHES_COMPLETE_ALL, isAllPatchesCorrect);
    }

    fallOffIncorrectColoredPatches(callback) {
        this.status.correct.forEach((isCorrect, index) => {
            if (!isCorrect) {
                const patch = this.patches[index];
                const stitches = patch.stitchesCollection;
                stitches.fallOffIncorrectColored(callback);
            }
        });
    }

    update(objectToMove, objectsToSkip, dt) {
        this.currentPatch.update(objectToMove, objectsToSkip, dt);
    }
}
