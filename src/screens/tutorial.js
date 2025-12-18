import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../helpers/pixi/pixi-factory';

export class TutorialScreen {
    constructor(visible = false) {
        this.text = factory.text('tutorial', {
            color: '#ffffff',
            stroke: '#222222',
            strokeThickness: 5,
            letterSpacing: 2
        });

        this.group = factory.group([
            this.text,
        ], visible, 'tutorial');

        const textVisible = config.get('tutorial.textVisible');
        this.text.visible = textVisible;
    }

    show() {
        this.group.visible = true;
        tweens.fadeIn(this.group);
    }

    hide() {
        if (!this.group.visible) {
            return;
        }

        this.group.visible = false;
    }

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
        this.text.position.set(0, -340);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.group.position.set(cx, cy);
        this.text.position.set(0, -340);
    }
}