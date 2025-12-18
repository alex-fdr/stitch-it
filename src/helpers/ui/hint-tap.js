import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../../helpers/pixi/pixi-factory';

// TODO: Rewrite hint logic, make code looks less ugly

export class HintTap {
    constructor(visible = false) {
        this.pointer = factory.animatedSprite({
            key: 'tap-pointer',
            speed: 0.8,
            loop: false,
            yoyo: true,
            autostart: false,
            frames: { from: 0, to: 7, digits: 2 },
            // remapFrames: { 1: [9], 2: [8], 3: [7], 4: [6] }
        });

        this.pointer.scale.set(0.8);

        this.group = factory.group([this.pointer], visible);

        this.onPress = new signals.Signal();
        this.onStop = new signals.Signal();

        this.tapPositions = [];
        this.tapOffset = { x: 50, y: 70 };
        this.tapIndex = 0;

        this.holdTime = 1000;

        this.status = {
            playing: false,
            stopped: false,
            active: true
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
        tweens.fadeIn(this.group, 300);

        this.status.stopped = false;

        this.tap();

        this.pointer.onFrameChange = (frame) => {
            // pointer pressing btn for some time
            if (frame === 8 && this.status.playing) {
                this.hold();
            }
        };

        this.pointer.onComplete = () => {
            // tweens.timeout(100, () => {
            this.moveToNextItem(() => {
                if (this.status.playing) {
                    this.tap();
                }
            });
            // })
        };
    }

    tap() {
        // console.log('hint tap', performance.now());

        this.status.playing = true;
        this.pointer.gotoAndPlay(0);
        this.onPress.dispatch(this.tapIndex);
    }

    hold() {
        this.pointer.stop();
        this.holdTween = tweens.timeout(this.holdTime, () => {
            if (this.status.playing && !this.status.stopped) {
                this.pointer.play();
            }
        });
    }

    stopAnimation() {
        this.status.playing = false;
        this.status.stopped = true;
        this.pointer.onComplete = () => { };
        this.pointer.onFrameChange = () => { };
        this.moveTween?.stop();
        this.onStop.dispatch(this.tapIndex);
        this.tapIndex = 0;
        this.pointer.gotoAndStop(0);

        if (this.holdTween) {
            this.holdTween.stop();
            this.holdTween = null;
        }
    }

    moveToNextItem(callback) {
        this.tapIndex = (this.tapIndex + 1) % this.tapPositions.length;

        const dest = this.getPositionByIndex(this.tapIndex);
        const tween = tweens.add(this.pointer.position, dest, 200, { easing: 'sineOut' });

        this.moveTween = tween.onComplete(() => {
            callback();
        });
    }

    moveToStart() {
        this.setPositionByIndex(0);
    }

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.group.position.set(cx, cy);
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