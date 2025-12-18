import { tweens } from '@alexfdr/three-game-components';
import { ParticlesEmitter } from '../helpers/particles2d/particles-emitter';
import { factory } from '../helpers/pixi/pixi-factory';
import { Button } from '../helpers/ui/button';

export class Win {
    constructor(visible = false) {
        this.overlay = factory.tilesprite('dummy-white', 960, 960);
        this.overlay.alpha = 0.7;
        this.overlay.tint = 0x000000;

        this.mark = factory.sprite('mark-green');
        this.mark.scale.set(0.7);

        this.button = new Button('button', 'nextPatch', { color: '#ffffff' });
        this.button.setTextShadow(0.5, 2, 45);
        this.button.text.position.set(0, 2);

        this.addParticles();

        this.group = factory.group([
            this.overlay,
            this.particlesLeft.group,
            this.particlesRight.group,
            this.mark,
            this.button.group
        ], visible, 'win');


    }

    addParticles() {
        const props = {
            keys: [
                'particle-blue',
                'particle-orange',
                'particle-purple',
                'particle-green',
            ],
            total: 50,
            lifetime: 800,
            rangeX: [-320],
            rangeY: [200, 300],
            velocityX: [4, 8],
            velocityY: [-10, -20],
            gravity: [0.2, 0.5],
            angularVelocity: [5, 15],
            hideTween: true
        };

        this.particlesLeft = new ParticlesEmitter();
        this.particlesLeft.init(props);

        this.particlesRight = new ParticlesEmitter();
        this.particlesRight.init({
            ...props,
            velocityX: [-4, -8],
            rangeX: [320]
        });
    }

    show() {
        this.group.visible = true;

        tweens.fadeIn(this.group, 400);
        tweens.zoomIn(this.mark, 0.5, 500, { easing: 'back' });

        this.button.group.alpha = 0;
        tweens.fadeIn(this.button.group, 300, { delay: 1000 });
        tweens.pulse(this.button.group, 1.1, 800, { repeat: -1 });

        const amount = 50;
        const time = 500;
        this.particlesLeft.emitMultiple(amount, time);
        this.particlesRight.emitMultiple(amount, time);
    }

    hide() {
        this.group.visible = false;
    }

    orientationPortrait(cx, cy) {
        this.group.scale.set(1);
        this.overlay.scale.set(1);

        this.group.position.set(cx, cy);
        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }

    orientationLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.overlay.scale.set(1 / this.group.scale.x);

        this.group.position.set(cx, cy);
        this.mark.position.set(0, 0);
        this.button.setPosition(0, 360);
    }
}