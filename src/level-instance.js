import { events, pixiUI, tweens } from '@alexfdr/three-game-components';
import { core } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { AvocadoElement } from './components/elements/avocado-element';
import { PenguinElement } from './components/elements/penguin-element';
import { Intro } from './components/intro';
import { Jeans } from './components/jeans';
import { OverlayPlane } from './components/overlay-plane';
import { PatchesCollection } from './components/patches-collection';
import { PathSparkleEffect } from './components/path-sparkle-effect';
import { SewingMachine } from './components/sewing-machine';
import { DragHandler } from './helpers/drag-handler';
import { CameraHelper } from './helpers/system/camera-helper';
import { cfg } from './data/cfg';
import { colors } from './data/colors';
import { PATCH_COMPLETE, PATCHES_COMPLETE_ALL, WRONG_COLOR } from './data/game-const';

export class LevelInstance {
    constructor() {
        this.group = new Object3D();
        this.group.name = 'level';
        core.scene.add(this.group);

        this.screens = {
            ui: pixiUI.screens.get('ui'),
            hint: pixiUI.screens.get('hint'),
            choices: pixiUI.screens.get('choices'),
            tutorial: pixiUI.screens.get('tutorial'),
        };

        this.status = {
            firstInteraction: true,
            btnPressed: false,
            btnPressProcessed: false,
            btnPressedCounter: 0,
            btnPressedTime: 0,
            selectedColor: 0x0,
            nextPatch: false,
            intro: false,
            gameover: false,
        };
    }

    init({ element, sewingMachine }) {
        this.addJeans();
        this.addElement(element);
        this.addSewingMachine(sewingMachine);
        this.addPatchesCollection(sewingMachine);
        this.addCameraHelper();
        this.addPathSparkleEffect();
        this.addTutorialOverlay();
        this.addIntro();

        this.setupInput();
        this.setupHint();
        this.setupGameFlow();

        this.start(sewingMachine.routes[0].correctColor);
    }

    addJeans() {
        this.jeans = new Jeans({ parent: this.group });
    }

    addElement(data) {
        if (data.model === 'avocado') {
            this.element = new AvocadoElement({ parent: this.group, data });
        } else if (data.model === 'penguin') {
            this.element = new PenguinElement({ parent: this.group, data });
        }
    }

    addSewingMachine(data) {
        this.sewingMachine = new SewingMachine({ parent: this.group, data });
    }

    addPatchesCollection(data) {
        this.patchesCollection = new PatchesCollection({ parent: this.group, data });
    }

    addCameraHelper() {
        this.cameraHelper = new CameraHelper();
    }

    addPathSparkleEffect() {
        this.sparkle = new PathSparkleEffect({
            parent: this.group,
            movePercent: 0.1,
            moveTime: 2000,
        });
    }

    addTutorialOverlay() {
        this.overlay = new OverlayPlane({ parent: this.group });
    }

    addIntro() {
        this.intro = new Intro({
            time: cfg.get('intro.time', 500),
            progress: 0.065,
        });
    }

    setupInput() {
        core.input.setHandler(new DragHandler());
        core.input.onDown.add((status) => this.handleOnDown(status));
        core.input.onMove.add((status) => this.handleOnMove(status));
        core.input.onUp.add((status) => this.handleOnUp(status));
    }

    setupHint() {
        this.screens.hint.setTapPositions(this.screens.choices.getBtnPositions());
        this.screens.hint.moveToStart();
    }

    setupGameFlow() {
        events.on(WRONG_COLOR, () => {
            this.screens.ui.redOverlay.animate();
        });

        events.on(PATCH_COMPLETE, (isCorrect) => {
            this.patchesCollection.setStatus(isCorrect);
            this.patchesCollection.nextPatch(this.sewingMachine.group);
            this.sewingMachine.deactivate();
            this.handleOnUp();

            this.status.nextPatch = true;
            // this.status.btnPressedCounter = 0
        });

        events.once(PATCHES_COMPLETE_ALL, (isWin) => {
            this.handleGameover(isWin);
        });

        this.screens.choices.onBtnPress.add((type, color) => {
            this.status.btnPressed = true;
            this.status.selectedColor = color;
            this.status.btnPressedTime = performance.now();
        });

        // this.screens.hint.onPress.add((index) => {
        //     this.screens.choices.pressBtn(index, this.screens.hint.holdTime - 100);
        // });

        // this.screens.hint.onStop.add((index) => {
        //     this.screens.choices.resetBtn(index);
        // });

        this.intro.onStart.addOnce(() => {
            this.status.intro = true;
        });

        this.intro.onComplete.addOnce(() => {
            this.screens.tutorial.show();

            this.status.intro = false;
            // GM.trigger.start();
            this.overlay.show();

            // customEvents.introEnd();
            this.screens.choices.show();
            this.screens.hint.show();
        });
    }

    start(initialColor) {
        this.sparkle.show(this.patchesCollection.getPathFollower(), 0.1);

        // todo: move color to the config
        this.setColor(initialColor);

        this.patchesCollection.currentPatch.moveOnStart(this.sewingMachine.group);

        tweens.wait(200).then(() => {
            this.intro.start(this.patchesCollection.getPathFollower());
        });
    }

    handleOnDown(data) {
        // GM.trigger.interactionStart();

        if (this.status.firstInteraction) {
            this.status.firstInteraction = false;
            this.overlay.hide();
            this.screens.tutorial.hide();
        }

        this.handleBtnPress();
    }

    handleOnMove(data) {}

    handleOnUp(data) {
        // GM.trigger.interactionComplete();
        this.handleBtnRelease();
    }

    handleBtnPress() {
        if (this.status.btnPressed) {
            this.status.btnPressedTime = 0;

            this.screens.choices.hide();
            this.screens.hint.hide();
            this.sewingMachine.activate();
            this.sparkle.hide();
            this.setColor(this.status.selectedColor);

            // customEvents.stitchNum(++this.status.btnPressedCounter);

            if (
                this.status.btnPressedCounter === 1 &&
                cfg.get('convert.firstInteractionComplete')
            ) {
                sqHelper.convertDelay(2000, () => {
                    this.handleOnUp();
                });
            }

            if (this.status.nextPatch) {
                this.status.nextPatch = false;
                // customEvents.areaStart(this.patchesCollection.status.completed.length + 1);
            }
        }
    }

    handleBtnRelease() {
        this.status.btnPressedTime = 0;

        if (this.status.btnPressed) {
            this.status.btnPressed = false;
            this.screens.choices.show();
            this.sewingMachine.deactivate();
            this.sparkle.show(this.patchesCollection.getPathFollower());
        }
    }

    handleGameover(isWin) {
        console.log('game over', isWin);

        this.status.gameover = true;

        this.sewingMachine.deactivate();
        this.sewingMachine.hide();

        this.screens.choices.disable();
        this.screens.hint.deactivate();
        this.screens.ui.hide();

        this.cameraHelper.focusOnTarget(this.element.model, 1000, () => {
            if (isWin) {
                /* sqHelper.levelWin(); */
            } else {
                this.patchesCollection.fallOffIncorrectColoredPatches(() => {
                    tweens.wait(200).then(() => {
                        /* sqHelper.levelLose(); */
                    });
                });
            }
        });
    }

    setColor(colorName) {
        const color = colors[colorName];
        this.sewingMachine.setColor(color);
        this.patchesCollection.getStitchesCollection().setColor(color);
    }

    update(dt) {
        if (this.status.intro || this.sewingMachine.status.active) {
            this.patchesCollection.update(this.sewingMachine.group, this.element.objectsToSkip, dt);
        }

        if (this.status.btnPressedTime && performance.now() - this.status.btnPressedTime > 100) {
            this.status.btnPressed = true;
            this.handleBtnPress();
        }

        if (!this.status.gameover) {
            this.cameraHelper.update(this.sewingMachine.group);
        }
    }

    resize() {}
    remove() {}
}
