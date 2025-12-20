import { tweens } from '@alexfdr/three-game-components';
import { DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';

export class OverlayPlane {
    constructor({ parent }) {
        this.group = new Object3D();
        this.group.name = 'Overlay';
        this.parent = parent;
        this.parent.add(this.group);

        this.addModel();
        this.applyTransform();
        this.hide();
    }

    addModel() {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.7,
            side: DoubleSide,
        });

        const mesh = new Mesh(geometry, material);
        mesh.name = 'Horizontal Plane';
        this.model = mesh;
        this.group.add(this.model);

        const verticalMesh = new Mesh(geometry, material);
        verticalMesh.name = 'Vertical Plane';
        this.verticalModel = verticalMesh;
        this.group.add(this.verticalModel);
    }

    show() {
        this.group.visible = true;

        const initialOpacity = this.model.material.opacity;
        this.model.material.opacity = 0;
        tweens.add(this.model.material, {
            time: 300,
            to: { opacity: initialOpacity },
        });
    }

    hide() {
        this.group.visible = false;
    }

    applyTransform() {
        this.model.position.set(0, 0.1, 0);
        this.model.rotateX(Math.PI * 0.5);
        this.model.scale.multiplyScalar(100);

        this.verticalModel.rotateY(0);
        this.verticalModel.position.set(0, 54, 4.5);
        this.verticalModel.scale.multiplyScalar(100);
    }
}
