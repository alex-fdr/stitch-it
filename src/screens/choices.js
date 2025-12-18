import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../helpers/pixi/pixi-factory';
import { ButtonIcon } from '../helpers/ui/button-icon';

// const BTN_POSITIONS = [
//   { x: -120, y: 260 },
//   { x: 120, y: 260 },
// ]


export class Choices {
    constructor(visible = false, type = 'yarn', colors = []) {
        this.type = type;
        this.colors = colors;
        this.group = factory.group([], visible, 'choices');

        this.onBtnPress = new signals.Signal();
        this.addAllButtons();

        this.showTime = 1;
        this.showTween = null;

        this.hideTime = 1000;
        this.hideTween = null;

        this.status = {
            enabled: true
        };
    }

    addAllButtons() {
        this.buttons = [
            this.addButton(this.type, this.colors[0], -1),
            this.addButton(this.type, this.colors[1], 1),
        ];
    }

    addButton(type, color, offsetIndex = 0) {
        const btn = new ButtonIcon('button-base', `${type}-${color}`);
        const offsetX = type === 'yarn' ? 15 : 5;
        const offsetY = type === 'yarn' ? 0 : 5;
        const scaleTo = type === 'yarn' ? 0.7 : 0.6;
        btn.icon.scale.set(scaleTo);
        btn.icon.position.set(offsetX, offsetY);
        btn.setInputHandler(() => {
            this.onBtnPress.dispatch(type, color);
        });
        // btn.expandClickArea({ width: 480, positionX: 120 * offsetIndex, positionY: -260 })
        this.group.addChild(btn.group);
        return btn;
    }

    show() {
        if (!this.status.enabled) {
            return;
        }

        if (this.hideTween) {
            this.hideTween.stop();
            this.hideTween = null;
        }

        this.group.visible = true;
        this.showTween = tweens.fadeIn(this.group, this.showTime);
    }

    hide() {
        if (this.showTween) {
            this.showTween.stop();
            this.showTween = null;
        }

        this.hideTween = tweens.fadeOut(this.group, this.hideTime);
        this.hideTween.onComplete(() => {
            this.group.visible = false;
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

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);

        this.group.position.set(cx, cy);
        this.buttons[0].setPosition(-120, 260);
        this.buttons[1].setPosition(120, 260);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);

        this.group.position.set(cx, cy);
        this.buttons[0].setPosition(-120, 260);
        this.buttons[1].setPosition(120, 260);
    }

    getBtnPositions() {
        return this.buttons.map((btn) => btn.group.position);
    }
}