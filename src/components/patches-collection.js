import { events } from '@alexfdr/three-game-components';
import { Patch } from './patch';
import { cfg } from '../data/cfg';
import { PATCHES_COMPLETE_ALL } from '../data/game-const';

export class PatchesCollection {
    constructor() {
        this.patches = [];
        this.currentPatch = null;
        this.currentPatchId = 0;

        this.status = {
            correct: [],
            completed: [],
        };
    }

    init(parent, data) {
        this.parent = parent;

        const { routes } = data;
        const speed = cfg.get('sewingMachine.speed', data.speed);
        routes.forEach((routeData) => {
            this.addPatch(routeData, speed);
        });

        this.currentPatch = this.patches[this.currentPatchId];
    }

    addPatch(routeData, speed) {
        const patch = new Patch();
        patch.init(this.parent, routeData, speed);
        this.patches.push(patch);
    }

    nextPatch(objectToMove) {
        console.log('next patch');
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

        this.status.correct.forEach((isCorrect) => {
            if (!isCorrect) {
                isAllPatchesCorrect = false;
            }
        });

        events.emit(PATCHES_COMPLETE_ALL, isAllPatchesCorrect);
    }

    fallOffIncorrectColoredPatches(callback) {
        this.status.correct.forEach((isCorrect, index) => {
            if (!isCorrect) {
                this.patches[index].stitchesCollection.fallOffIncorrectColored(() => {
                    callback();
                });
            }
        });
    }

    update(objectToMove, objectsToSkip, dt) {
        this.currentPatch.update(objectToMove, objectsToSkip, dt);
    }
}
