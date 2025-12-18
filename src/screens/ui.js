import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../helpers/pixi/pixi-factory';
import { RedOverlay } from '../helpers/ui/red-overlay';

export class UI {
    constructor(visible = false) {
        this.group = factory.group([], visible);

        this.addRedOverlay();
    }

    addRedOverlay() {
        this.redOverlay = new RedOverlay();
        this.redOverlay.init({ time: 500, delay: 200 });
        this.group.addChild(this.redOverlay.group);
    }

    show() {
        this.group.visible = true;
    }

    hide() {
        this.group.visible = false;
    }

    animate() {
        tweens.fadeIn(this.group, 300);
    }

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);

        this.redOverlay.sprite.width = 960;

        this.group.position.set(cx, cy);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);

        this.redOverlay.sprite.width = 960 / this.group.scale.x;

        this.group.position.set(cx, cy);
    }
}