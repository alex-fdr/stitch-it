import { tweens } from '@alexfdr/three-game-components';
import { assets } from '@alexfdr/three-game-core';
import { DoubleSide, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from 'three';

export class PathSparkleEffect {
    constructor() {
        this.group = new Object3D();
    }

    init(parent, data = {}) {
        this.parent = parent;
        this.parent.add(this.group);

        const { movePercent = 0.1, moveTime = 1500 } = data;
        this.movePercent = movePercent;
        this.moveTime = moveTime;

        this.addModel();
        this.applyTransform();
    }

    addModel() {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshLambertMaterial({
            map: assets.textures.get('sparkle'),
            side: DoubleSide,
            transparent: true,
            depthWrite: false
            // color: 0xff0000
        });
        const mesh = new Mesh(geometry, material);

        this.model = mesh;
        this.group.add(this.model);
    }

    applyTransform() {
        this.model.rotateX(Math.PI * 0.5);
        this.model.position.set(0, 0.16, 0);
        this.model.scale.multiplyScalar(1.5);
        // this.model.scale.multiplyScalar(10)
    }

    show(pathFollower, movePercent) {
        if (this.moveTween) {
            return;
        }

        this.group.visible = true;
        this.animate(pathFollower, movePercent);
    }

    hide() {
        this.group.visible = false;

        if (this.moveTween) {
            this.moveTween.stop(true);
            this.moveTween = null;
        }
    }

    animate(pathFollower) {
        if (pathFollower.finished) {
            return;
        }

        if (this.moveTween) {
            this.moveTween.stop(true);
            this.moveTween = null;
        }

        this.model.material.opacity = 0;

        const time = this.moveTime;
        const from = pathFollower.progress;
        const to = Math.min(from + this.movePercent, 1);

        const scale = 0.94;
        const tw = tweens.add({ x: from }, time, { to: { x: to }, easing: 'linear' });

        tw.onUpdate((el, k) => {
            if (!pathFollower.finished) {
                const progress = Math.min(el.x, 1);
                const point = pathFollower.getPointAtProgress(progress);
                const { x, y, z } = point;
                this.group.position.set(x * scale, y, z * scale);

                // fade in
                if (k < 0.1) {
                    this.model.material.opacity = Math.min(k * 10, 1);
                }

                // fade out
                if (k > 0.9) {
                    this.model.material.opacity = Math.max((1 - k) * 10, 0);
                }
            }
        });

        tw.onComplete(() => {
            this.moveTween = null;

            tweens.wait(1000).then(() => {
                if (this.group.visible) {
                    this.animate(pathFollower);
                }
            });
        });

        this.moveTween = tw;
    }
}