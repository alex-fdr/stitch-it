import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Sprite } from 'pixi.js';
import { Button } from '../helpers/ui/button';

export class Lose {
    constructor({ parent, visible = false }) {
        this.overlay = new Sprite({
            texture: Assets.get('overlay-red'),
            anchor: 0.5,
        });

        this.mark = new Sprite({
            texture: Assets.get('mark-red'),
            anchor: 0.5,
            scale: 0.7,
        });

        this.button = new Button('button', 'tryAgain', { fill: '#ffffff' });
        this.button.setTextShadow(0.5, 2, 45);
        this.button.text.position.set(0, 2);

        this.group = new Container({
            parent,
            visible,
            label: 'lose',
            children: [this.overlay, this.mark, this.button.group],
        });
    }

    show() {
        this.group.visible = true;

        tweens.fadeIn(this.group, { time: 400 });
        tweens.zoomIn(this.mark, { scaleFrom: 0.5, time: 500, easing: 'back' });

        this.button.group.alpha = 0;
        tweens.fadeIn(this.button.group, { time: 300, delay: 700 });
        tweens.pulse(this.button.group, { scaleTo: 1.1, time: 800, repeat: -1 });
    }

    hide() {
        this.group.visible = false;
    }

    orientationPortrait() {
        this.group.scale.set(1);
        this.overlay.width = 1024;

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }

    orientationLandscape(factor) {
        this.group.scale.set(factor);
        this.overlay.width = 1024 / this.group.scale.x;

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }
}
