import { core } from '@alexfdr/three-game-core';
import { CatmullRomCurve3, Mesh, MeshBasicMaterial, Object3D, SphereGeometry, TubeGeometry, Vector3 } from 'three';

export class PathFollower {
    constructor() {
        this.points = [];
        this.pathCurve = null;
        this.pathMesh = null;
        this.progress = 0;
        this.speed = 0.03;
        this.k = 0;
        this.direction = 1;
        this.finished = false;
    }

    init(points = [], data = {}) {
        this.points = points.map(({ x, y, z }) => new Vector3(x, y, z));
        this.pathCurve = new CatmullRomCurve3(this.points);

        this.k = 1 / this.pathCurve.getLength();

        const { speed = 1, reverseOnComplete = false, rotationOnMove = true } = data;

        this.speed *= speed;
        this.reverseOnComplete = reverseOnComplete;
        this.rotationOnMove = rotationOnMove;
    }

    debug() {
        this.renderPath();
        this.renderPoints();
    }

    renderPoints() {
        const geometry = new SphereGeometry(0.2);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new Mesh(geometry, material);
        const group = new Object3D();
        core.scene.add(group);

        this.points.forEach((pos) => {
            const point = mesh.clone();
            point.position.copy(pos);
            group.add(point);
        });
    }

    renderPath() {
        const geometry = new TubeGeometry(this.pathCurve, 100, 0.15, 8, false);
        const material = new MeshBasicMaterial({ color: 0xece5d3 });
        this.pathMesh = new Mesh(geometry, material);
        core.scene.add(this.pathMesh);
    }

    renderLookAtPoint(position) {
        if (!this.lookAtMesh) {
            const geometry = new SphereGeometry(0.15);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            core.scene.add(mesh);
            this.lookAtMesh = mesh;
        }

        this.lookAtMesh.position.copy(position);
    }

    update(target, dt) {
        if (this.finished) {
            return;
        }

        if (this.progress > 1) {
            if (this.reverseOnComplete) {
                this.progress = 0;
                this.direction *= -1;
                this.reversePath();
                return;
            }

            this.finished = true;
            this.progress = 1;
        }

        this.updatePosition(target);
        this.updateRotation(target);
        this.updateProgress(dt);
    }

    updateProgress(dt) {
        // const mult = 1 / this.pathCurve.getLength()
        this.progress += this.k * this.speed * dt;
    }

    updatePosition(target) {
        const d = this.direction > 0 ? this.progress : 1 - this.progress;
        const currentPosition = this.pathCurve.getPointAt(this.progress);
        target.position.copy(currentPosition);
    }

    updateRotation(target) {
        if (!this.rotationOnMove) {
            return;
        }

        // const d = this.direction > 0 ? this.progress : 1 - this.progress
        const tangent = this.pathCurve.getTangentAt(this.progress);
        const point = tangent.add(target.position);
        target.lookAt(point);

        // this.renderLookAtPoint(point)
    }

    reversePath() {
        this.pathCurve.points.reverse();
        this.pathCurve.updateArcLengths();
    }

    getPointAtProgress(progress) {
        return this.pathCurve.getPointAt(progress);
    }
}