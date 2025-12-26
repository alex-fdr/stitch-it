import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Sprite } from 'pixi.js';
import { Button } from '../helpers/ui/button';

export class LoseScreen {
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
        this.button.text.position.set(0, 2);
        this.button.text.style.dropShadow = {
            alpha: 0.5,
            distance: 2,
            angle: 45,
            color: 0x222222,
        };

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

    handlePortrait() {
        this.group.scale.set(1);
        this.overlay.width = 1024;

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.overlay.width = 1024 / this.group.scale.x;

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }
}
