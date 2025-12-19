import { tweens } from '@alexfdr/three-game-components';
import { factory } from '../../helpers/pixi/pixi-factory';

export class Button {
    constructor(spriteKey, textKey, textStyle) {
        this.sprite = factory.sprite(spriteKey);
        this.text = factory.text(textKey, textStyle);
        this.group = factory.group([this.sprite, this.text]);
    }

    getPosition() {
        return this.group.position;
    }

    setPosition(x = 0, y = 0) {
        this.group.position.set(x, y);
    }

    setScale(sx = 1, sy = sx) {
        this.group.scale.set(sx, sy);
    }

    setTextShadow(alpha = 0.5, distance = 2, angle = 45) {
        factory.textShadow(this.text, 0x222222, alpha, distance, angle);
    }

    setInputHandler(handler) {
        this.sprite.interactive = true;
        this.sprite.once('pointerup', handler);
    }

    showPressEffect() {
        this.tween = tweens.pulse(this.group, { scaleTo: 0.9, time: 300 });
    }

    expandClickArea(props = {}) {
        const { width = 480, height = 960, positionX = 0, positionY = 0 } = props;
        const area = factory.tilesprite('dummy-white', width, height);
        area.position.set(positionX, positionY);
        area.anchor.set(0.5);
        area.alpha = 0.5;
        this.group.add(area);
    }
}
