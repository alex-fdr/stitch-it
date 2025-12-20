import { tweens } from '@alexfdr/three-game-components';
import { Signal } from '@alexfdr/three-game-core';
import { AnimatedSprite, Assets, Container } from 'pixi.js';

// TODO: Rewrite hint logic, make code looks less ugly

export class HintTap {
    constructor({ parent, visible = false }) {
        this.pointer = new AnimatedSprite({
            anchor: 0.5,
            scale: 0.8,
            animationSpeed: 0.7,
            loop: false,
            autoPlay: false,
            textures: [0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0].map((v) =>
                Assets.get(`tap-pointer0${v}`),
            ),
        });

        this.group = new Container({
            parent,
            visible,
            children: [this.pointer],
        });

        this.onPress = new Signal();
        this.onStop = new Signal();

        this.tapPositions = [];
        this.tapOffset = { x: 50, y: 70 };
        this.tapIndex = 0;

        this.holdTime = 1000;

        this.status = {
            playing: false,
            stopped: false,
            active: true,
        };
    }

    show() {
        if (!this.status.active) {
            return;
        }

        this.group.visible = true;
        this.moveToStart();
        this.animate();
    }

    hide() {
        this.group.visible = false;
        this.stopAnimation();
    }

    deactivate() {
        this.hide();
        this.status.active = false;
    }

    animate() {
        tweens.fadeIn(this.group, { time: 300 });

        this.status.stopped = false;

        this.tap();

        this.pointer.onFrameChange = (frame) => {
            // pointer holding btn for some time
            if (frame === 8 && this.status.playing) {
                this.hold();
            }
        };

        this.pointer.onComplete = () => {
            this.moveToNextItem(() => {
                if (this.status.playing) {
                    this.tap();
                }
            });
        };
    }

    tap() {
        this.status.playing = true;
        this.pointer.gotoAndPlay(0);
        this.onPress.dispatch(this.tapIndex);
    }

    hold() {
        this.pointer.stop();
        tweens.wait(this.holdTime).then(() => {
            if (this.status.playing && !this.status.stopped) {
                this.pointer.play();
            }
        });
    }

    stopAnimation() {
        this.status.playing = false;
        this.status.stopped = true;
        this.pointer.onComplete = () => {};
        this.pointer.onFrameChange = () => {};
        this.onStop.dispatch(this.tapIndex);
        this.tapIndex = 0;
        this.pointer.gotoAndStop(0);

        if (this.moveTween) {
            tweens.remove(this.moveTween);
            this.moveTween.stop();
            this.moveTween = null;
        }
    }

    moveToNextItem(callback) {
        this.tapIndex = (this.tapIndex + 1) % this.tapPositions.length;

        const tween = tweens.add(this.pointer.position, {
            to: this.getPositionByIndex(this.tapIndex),
            time: 200,
            easing: 'sineOut',
        });

        this.moveTween = tween.onComplete(() => callback());
    }

    moveToStart() {
        this.setPositionByIndex(0);
    }

    handlePortrait() {
        this.group.scale.set(1);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
    }

    setPosition(x, y) {
        this.pointer.position.set(x, y);
    }

    setPositionByIndex(index) {
        const { x, y } = this.tapPositions[index];
        const { x: dx, y: dy } = this.tapOffset;
        this.pointer.position.set(x + dx, y + dy);
    }

    getPositionByIndex(index) {
        const { x, y } = this.tapPositions[index];
        const { x: dx, y: dy } = this.tapOffset;
        return { x: x + dx, y: y + dy };
    }

    setTapPositions(positions) {
        this.tapPositions = positions;
    }
}
