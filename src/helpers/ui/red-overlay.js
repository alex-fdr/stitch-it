import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Sprite } from 'pixi.js';

export class RedOverlay {
    constructor({ parent }) {
        this.sprite = new Sprite({
            texture: Assets.get('overlay-red'),
            visible: false,
            anchor: 0.5,
        });

        this.group = new Container({
            parent,
            children: [this.sprite],
        });

        this.alpha = this.sprite.alpha;
        this.blinkTime = 500;
        this.blinkDelay = 0;
    }

    init(data = {}) {
        const { time = 500, delay = 0, alpha = 1 } = data;
        this.blinkTime = time;
        this.blinkDelay = delay;
        this.alpha = alpha;
    }

    animate() {
        if (this.tween) {
            return;
        }

        this.sprite.visible = true;
        this.sprite.alpha = this.alpha;

        this.tween = tweens.fadeOut(this.sprite, {
            time: this.blinkTime,
            delay: this.blinkDelay,
            repeat: Infinity,
            onComplete: () => {
                this.sprite.visible = false;
                tweens.remove(this.tween);
                this.tween = null;
            },
        });
    }
}
