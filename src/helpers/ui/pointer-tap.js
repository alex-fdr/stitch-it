import { tweens } from '@alexfdr/three-game-components';
import { Signal } from '@alexfdr/three-game-core';
import { AnimatedSprite, Assets } from 'pixi.js';

// TODO: Rewrite hint logic, make code looks less ugly

export class PointerTap {
    constructor({ parent }) {
        this.pointer = new AnimatedSprite({
            parent,
            anchor: 0.5,
            scale: 0.8,
            animationSpeed: 0.7,
            loop: false,
            autoPlay: false,
            textures: [0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0].map((v) =>
                Assets.get(`tap-pointer0${v}`),
            ),
        });

        this.onPress = new Signal();
        this.onStop = new Signal();

        this.tapPositions = [];
        this.tapOffsetX = 50;
        this.tapOffsetY = 70;
        this.holdTime = 1000;
        this.moveTime = 200;
        this.currentTargetIndex = 0;
        this.holdFrameIndex = 8;

        this.status = {
            playing: false,
            active: true,
        };

        this.pointer.onFrameChange = this.onFrameChange.bind(this);
        this.pointer.onComplete = this.moveToNextItem.bind(this);
    }

    onFrameChange(frame) {
        // pointer holding btn for some time
        if (this.status.playing && frame === this.holdFrameIndex) {
            this.hold();
        }
    }

    moveToNextItem() {
        this.currentTargetIndex = (this.currentTargetIndex + 1) % this.tapPositions.length;

        this.moveTween = tweens.add(this.pointer.position, {
            to: this.getPositionByIndex(this.currentTargetIndex),
            time: this.moveTime,
            easing: 'sineOut',
            onComplete: () => {
                if (this.status.playing) {
                    this.tap();
                }
            },
        });
    }

    tap() {
        this.status.playing = true;
        this.pointer.gotoAndPlay(0);
        this.onPress.dispatch(this.currentTargetIndex);
    }

    hold() {
        this.pointer.stop();
        tweens.wait(this.holdTime).then(() => {
            if (this.status.playing) {
                this.pointer.play();
            }
        });
    }

    stopAnimation() {
        this.status.playing = false;
        this.pointer.onComplete = () => {};
        this.pointer.onFrameChange = () => {};
        this.pointer.gotoAndStop(0);
        this.currentTargetIndex = 0;
        this.onStop.dispatch(this.currentTargetIndex);

        if (this.moveTween) {
            tweens.remove(this.moveTween);
            this.moveTween = null;
        }
    }

    setPositionByIndex(index) {
        const { x, y } = this.getPositionByIndex(index);
        this.pointer.position.set(x, y);
    }

    getPositionByIndex(index) {
        const pos = this.tapPositions[index];
        return {
            x: pos.x + this.tapOffsetX,
            y: pos.y + this.tapOffsetY,
        };
    }
}
