import { tweens } from '@alexfdr/three-game-components';
import { Container } from 'pixi.js';
import { RedOverlay } from '../helpers/ui/red-overlay';

export class UIScreen {
    constructor({ parent, visible = false }) {
        this.group = new Container({
            parent,
            visible,
            label: 'ui',
            children: [],
        });
        this.addRedOverlay();
    }

    addRedOverlay() {
        this.redOverlay = new RedOverlay({ parent: this.group });
        this.redOverlay.init({
            time: 500,
            delay: 200,
        });
    }

    show() {
        this.group.visible = true;
    }

    hide() {
        this.group.visible = false;
    }

    animate() {
        tweens.fadeIn(this.group, { time: 300 });
    }

    handlePortrait() {
        this.group.scale.set(1);
        this.redOverlay.sprite.width = 1024;
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.redOverlay.sprite.width = 1024 / this.group.scale.x;
        this.redOverlay.sprite.height = 1024;
    }
}
