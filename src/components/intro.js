import { tweens } from '@alexfdr/three-game-components';
import { Signal } from '@alexfdr/three-game-core';

export class Intro {
    constructor() {
        this.onStart = new Signal();
        this.onComplete = new Signal();
    }

    init(data = {}) {
        const { time = 1000, progress = 0.065 } = data;
        this.time = time;
        this.progress = progress;
    }

    start(pathFollower) {
        this.onStart.dispatch();

        const from = { x: 0 };
        const tw = tweens.add(from, {
            to: { x: this.progress },
            easing: 'linear',
            time: this.time,
        });

        tw.onUpdate((obj) => {
            pathFollower.progress = obj.x;
        });

        tw.onComplete(() => {
            this.onComplete.dispatch();
        });
    }
}
