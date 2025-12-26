import { Assets, Container, Sprite, Text, TilingSprite } from 'pixi.js';
import { locale } from '../../data/locale';

export class Button {
    constructor(spriteKey, textKey, textStyle) {
        this.sprite = new Sprite({
            texture: Assets.get(spriteKey),
            anchor: 0.5,
        });

        this.text = new Text({
            text: locale[textKey].text,
            anchor: 0.5,
            style: {
                fontSize: locale[textKey].fontSize,
                ...textStyle,
            },
        });

        this.group = new Container({
            label: 'button',
            children: [this.sprite, this.text],
        });
    }

    setPosition(x = 0, y = 0) {
        this.group.position.set(x, y);
    }

    setScale(sx = 1, sy = sx) {
        this.group.scale.set(sx, sy);
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
        return new TilingSprite({
            width,
            height,
            anchor: 0.5,
            alpha: 0.5,
            position: { x: positionX, y: positionY },
            texture: Assets.get('dummy-white'),
            parent: this.group,
        });
    }
}
