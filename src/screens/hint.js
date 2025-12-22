import { tweens } from '@alexfdr/three-game-components';
import { Container } from 'pixi.js';
import { PointerTap } from '../helpers/ui/pointer-tap';

export class HintScreen {
    constructor({ parent, visible }) {
        this.group = new Container({ parent, visible });
        this.pointer = new PointerTap({ parent: this.group });
    }

    setupPointer(tapPositions = []) {
        this.pointer.tapPositions = tapPositions;
        this.pointer.setPositionByIndex(0);
    }

    show() {
        if (!this.pointer.status.active) {
            return;
        }

        this.group.visible = true;
        tweens.fadeIn(this.group, { time: 300 });

        this.pointer.setPositionByIndex(0);
        this.pointer.tap();
    }

    hide(keepActive = true) {
        this.group.visible = false;
        this.pointer.stopAnimation();
        this.pointer.status.active = keepActive;
    }

    handlePortrait() {
        this.group.scale.set(1);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
    }
}
