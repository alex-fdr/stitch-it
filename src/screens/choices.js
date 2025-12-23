import { tweens } from '@alexfdr/three-game-components';
import { Signal } from '@alexfdr/three-game-core';
import { Container } from 'pixi.js';
import { ButtonWithIcon } from '../helpers/ui/button-with-icon';

export class ChoicesScreen {
    constructor({ parent, visible = false, type = 'yarn', colors = [] }) {
        this.type = type;
        this.colors = colors;

        this.group = new Container({
            parent,
            visible,
            label: 'choices',
            children: [],
        });

        this.onBtnPress = new Signal();

        this.buttons = [
            this.addButton(this.type, this.colors[0], -1),
            this.addButton(this.type, this.colors[1], 1),
        ];

        this.showTime = 1;
        this.showTween = null;

        this.hideTime = 1000;
        this.hideTween = null;

        this.status = {
            enabled: true,
        };
    }

    addButton(type, color, offsetIndex = 0) {
        const btn = new ButtonWithIcon('button-base', `${type}-${color}`);
        const offsetX = type === 'yarn' ? 15 : 5;
        const offsetY = type === 'yarn' ? 0 : 5;
        const scaleTo = type === 'yarn' ? 0.7 : 0.6;
        btn.icon.scale.set(scaleTo);
        btn.icon.position.set(offsetX, offsetY);
        btn.setInputHandler(() => this.onBtnPress.dispatch(type, color));
        // btn.expandClickArea({ width: 480, positionX: 120 * offsetIndex, positionY: -260 })
        this.group.addChild(btn.group);
        return btn;
    }

    show() {
        if (!this.status.enabled) {
            return;
        }

        if (this.hideTween) {
            tweens.remove(this.hideTween);
            this.hideTween = null;
        }

        this.group.visible = true;
        this.showTween = tweens.fadeIn(this.group, { time: this.showTime });
    }

    hide() {
        if (this.showTween) {
            tweens.remove(this.showTween);
            this.showTween = null;
        }

        this.hideTween = tweens.fadeOut(this.group, {
            time: this.hideTime,
            onComplete: () => {
                this.group.visible = false;
            },
        });
    }

    disable() {
        this.status.enabled = false;
        this.group.visible = false;
    }

    pressBtn(index, holdTime) {
        this.buttons[index].showPressEffect(holdTime);
    }

    resetBtn(index) {
        this.buttons[index].reset();
    }

    handlePortrait() {
        this.group.scale.set(1);
        this.buttons[0].setPosition(-120, 260);
        this.buttons[1].setPosition(120, 260);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.buttons[0].setPosition(-120, 260);
        this.buttons[1].setPosition(120, 260);
    }

    getBtnPositions() {
        return this.buttons.map((btn) => btn.group.position);
    }
}
