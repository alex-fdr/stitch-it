import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Rectangle, Sprite } from 'pixi.js';

export class ButtonIcon {
    constructor(baseKey, iconKey) {
        this.base = new Sprite({
            texture: Assets.get(baseKey),
            anchor: 0.5,
            interactive: true,
        });
        this.icon = new Sprite({
            texture: Assets.get(iconKey),
            anchor: 0.5,
        });
        this.group = new Container({
            children: [this.base, this.icon],
        });
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

    setInputHandler(handler) {
        this.base.eventMode = 'static';
        this.base.cursor = 'pointer';
        this.base.on('pointerdown', handler);
    }

    showPressEffect(holdTime = 0) {
        this.tween = tweens.pulse(this.group, 0.85, 300, { repeatDelay: holdTime });
    }

    reset() {
        this.tween?.stop();
        this.group.scale.set(1, 1);
    }

    expandClickArea(props = {}) {
        const { width = 480, height = 960, positionX = 0, positionY = 0 } = props;
        const area = factory.tilesprite('dummy-white', width, height);
        area.position.set(positionX, positionY);
        area.anchor.set(0.5);
        area.alpha = 0;
        this.group.addChild(area);

        // reset input handler to the extended area
        if (this.base.interactive) {
            this.base.interactive = false;
            const eventName = 'pointerdown';
            const handler = this.base.listeners(eventName)[0];
            this.base.off(eventName);

            area.interactive = true;
            area.on(eventName, handler);
        }
    }
}
