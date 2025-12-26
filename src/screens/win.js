import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Sprite, TilingSprite } from 'pixi.js';
import { ParticlesEmitter } from '../helpers/particles2d/particles-emitter';
import { Button } from '../helpers/ui/button';

export class WinScreen {
    constructor({ parent, visible = false }) {
        this.overlay = new TilingSprite({
            texture: Assets.get('dummy-white'),
            width: 1024,
            height: 1024,
            alpha: 0.7,
            tint: 0x000000,
            anchor: 0.5,
        });

        this.mark = new Sprite({
            texture: Assets.get('mark-green'),
            scale: 0.7,
            anchor: 0.5,
        });

        this.button = new Button('button', 'nextPatch', { fill: '#ffffff' });
        this.button.text.position.set(0, 2);
        this.button.text.style.dropShadow = {
            alpha: 0.5,
            distance: 2,
            angle: 45,
            color: 0x222222,
        };

        this.addParticles();

        this.group = new Container({
            parent,
            visible,
            label: 'win',
            children: [
                this.overlay,
                this.particlesLeft.group,
                this.particlesRight.group,
                this.mark,
                this.button.group,
            ],
        });
    }

    addParticles() {
        const props = {
            keys: ['particle-blue', 'particle-orange', 'particle-purple', 'particle-green'],
            total: 50,
            lifetime: 800,
            rangeX: [-320],
            rangeY: [200, 300],
            velocityX: [4, 8],
            velocityY: [-10, -20],
            gravity: [0.2, 0.5],
            angularVelocity: [5, 15],
            hideTween: true,
        };

        this.particlesLeft = new ParticlesEmitter();
        this.particlesLeft.init(props);

        this.particlesRight = new ParticlesEmitter();
        this.particlesRight.init({
            ...props,
            velocityX: [-4, -8],
            rangeX: [320],
        });
    }

    show() {
        this.group.visible = true;

        tweens.fadeIn(this.group, { time: 400 });
        tweens.zoomIn(this.mark, { scaleFrom: 0.5, time: 500, easing: 'back' });

        this.button.group.alpha = 0;
        tweens.fadeIn(this.button.group, { time: 300, delay: 1000 });
        tweens.pulse(this.button.group, { scaleTo: 1.1, time: 800, repeat: -1 });

        const amount = 50;
        const time = 500;
        this.particlesLeft.emitMultiple(amount, time);
        this.particlesRight.emitMultiple(amount, time);
    }

    hide() {
        this.group.visible = false;
    }

    handlePortrait() {
        this.group.scale.set(1);
        this.overlay.scale.set(1);

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.overlay.scale.set(1 / this.group.scale.x);

        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }
}
