import { tweens } from '@alexfdr/three-game-components';
import { Signal } from '@alexfdr/three-game-core';

export class Intro {
    constructor({ time = 500, progress = 0.1 }) {
        this.time = time;
        this.progress = progress;

        this.onStart = new Signal();
        this.onComplete = new Signal();

        this.tween = null;
    }

    start(pathFollower) {
        this.onStart.dispatch();

        const dummyTarget = { x: 0 };

        this.tween = tweens.add(dummyTarget, {
            to: { x: this.progress },
            easing: 'linear',
            time: this.time,
        });

        this.tween.onUpdate((obj) => {
            pathFollower.progress = obj.x;
        });

        this.tween.onComplete(() => {
            this.onComplete.dispatch();
        });
    }
}
