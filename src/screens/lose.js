import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../helpers/pixi/pixi-factory';
import { Button } from '../helpers/ui/button';

export class Lose {
    constructor(visible = false) {
        this.overlay = factory.sprite('overlay-red');

        this.mark = factory.sprite('mark-red');
        this.mark.scale.set(0.7);

        this.button = new Button('button', 'tryAgain', { color: '#ffffff' });
        this.button.setTextShadow(0.5, 2, 45);
        this.button.text.position.set(0, 2);

        this.group = factory.group([this.overlay, this.mark, this.button.group], visible, 'lose');
    }

    show() {
        this.group.visible = true;

        tweens.fadeIn(this.group, 400);
        tweens.zoomIn(this.mark, 0.5, 500, { easing: 'back' });

        this.button.group.alpha = 0;
        tweens.fadeIn(this.button.group, 300, { delay: 700 });
        tweens.pulse(this.button.group, 1.1, 800, { repeat: -1 });
    }

    hide() {
        this.group.visible = false;
    }

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);
        this.overlay.width = 960;

        this.group.position.set(cx, cy);
        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.overlay.width = 960 / this.group.scale.x;

        this.group.position.set(cx, cy);
        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }
}