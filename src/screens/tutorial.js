import { tweens } from '@alexfdr/three-game-components';
import { Container, Text } from 'pixi.js';
import { cfg } from '../data/cfg';
import { locale } from '../data/locale';

export class TutorialScreen {
    constructor({ parent, visible }) {
        this.text = new Text({
            text: locale.tutorial.text,
            anchor: 0.5,
            visible: cfg.get('tutorial.textVisible'),
            style: {
                fontSize: locale.tutorial.fontSize,
                fill: '#ffffff',
                letterSpacing: 2,
                stroke: {
                    color: '#222222',
                    width: 5,
                },
            },
        });

        this.group = new Container({
            parent,
            visible,
            children: [this.text],
            label: 'tutorial',
        });
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

    handlePortrait() {
        this.group.scale.set(1);
        this.text.position.set(0, -340);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.text.position.set(0, -340);
    }
}
