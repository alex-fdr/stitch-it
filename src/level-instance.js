// import { sqHelper } from './helpers/system/sq-helper';
import { pixiUI, tweens } from '@alexfdr/three-game-components';
import { core } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { elementsFactory } from './components/elements';
import { Intro } from './components/intro';
import { Jeans } from './components/jeans';
import { OverlayPlane } from './components/overlay-plane';
import { PatchesCollection } from './components/patches-collection';
import { PathSparkleEffect } from './components/path-sparkle-effect';
import { SewingMachine } from './components/sewing-machine';
import { DragHandler } from './helpers/drag-handler';
// import { customEvents } from './helpers/custom-events';
import { events } from './helpers/events';
import { CameraHelper } from './helpers/system/camera-helper';
import { colors } from './data/colors';
import { cfg } from './data/config';
import { EVENTS } from './data/game-const';

export class LevelInstance {
    constructor() {
        this.group = new Object3D();
        this.group.name = 'level';
        core.scene.add(this.group);

        this.data = null;

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

    init(data) {
        this.data = data;

        this.addJeans();
        this.addElement(data.element);
        this.addSewingMachine(data.sewingMachine);
        this.addPatchesCollection(data.sewingMachine);
        this.addCameraHelper();
        this.addPathSparkleEffect();
        this.addTutorialOverlay();
        this.addIntro();

        // this.setupInput();
        // this.setupHint();
        // this.setupGameFlow();
        this.start();
    }

    addJeans() {
        this.jeans = new Jeans();
        this.jeans.init(this.group);
    }

    addElement(props) {
        this.element = elementsFactory[props.model]();
        this.element.init(this.group, props);
        // this.element.debug()
    }

    addSewingMachine(props) {
        this.sewingMachine = new SewingMachine();
        this.sewingMachine.init(this.group, props);
    }

    addPatchesCollection(props) {
        this.patchesCollection = new PatchesCollection();
        this.patchesCollection.init(this.group, props);

        // this.patchesCollection.getPathFollower().debug()
    }

    addCameraHelper() {
        this.cameraHelper = new CameraHelper();
        this.cameraHelper.init();
    }

    addPathSparkleEffect() {
        this.sparkle = new PathSparkleEffect();
        this.sparkle.init(this.group, { movePercent: 0.1, moveTime: 2000 });
    }

    addTutorialOverlay() {
        this.overlay = new OverlayPlane();
        this.overlay.init(this.group);
    }

    addIntro() {
        console.log(cfg.get('intro.time'));
        const time = cfg.get('intro.time') || 700;
        this.intro = new Intro();
        this.intro.init({ time });
    }

    setupInput() {
        core.input.setHandler(new DragHandler());
        core.input.onDown.add((data) => this.handleOnDown(data));
        core.input.onMove.add((data) => this.handleOnMove(data));
        core.input.onUp.add((data) => this.handleOnUp(data));
    }

    setupHint() {
        /* this.hint = pixiUI.screens.get('hint');
        this.hint.setTapPositions(pixiUI.screens.get('choices').getBtnPositions());
        this.hint.moveToStart(); */
    }

    setupGameFlow() {
        events.on(EVENTS.WRONG_COLOR, () => {
            pixiUI.screens.get('ui').redOverlay.animate();
        });

        events.on(EVENTS.PATCH_COMPLETE, (isCorrect) => {
            customEvents.areaComplete(this.patchesCollection.currentPatchId + 1);

            // 1st patch completed
            if (this.patchesCollection.currentPatchId === 0 && cfg.get('convert.firstPatchComplete')) {
                sqHelper.convert();
            }

            this.patchesCollection.setStatus(isCorrect);
            this.patchesCollection.nextPatch(this.sewingMachine.group);
            this.sewingMachine.deactivate();
            this.handleOnUp();

            this.status.nextPatch = true;

            // this.status.btnPressedCounter = 0
        });

        events.once(EVENTS.PATCHES_COMPLETE_ALL, (isWin) => {
            this.handleGameover(isWin);
        });
        /* 
                pixiUI.screens.get('choices').onBtnPress.add((type, color) => {
                    // this.status.btnPressed = true
                    this.status.selectedColor = color;
                    this.status.btnPressedTime = performance.now();
                }); */

        // this.hint.onPress.add((index) => {
        //   screens.choices.pressBtn(index, this.hint.holdTime - 100)
        // })

        // this.hint.onStop.add((index) => {
        //   screens.choices.resetBtn(index)
        // })

        this.intro.onStart.addOnce(() => {
            this.status.intro = true;
        });

        this.intro.onComplete.addOnce(() => {
            this.status.intro = false;
            // GM.trigger.start();
            this.overlay.show();

            // customEvents.introEnd();
            /* pixiUI.screens.get('choices').show(); */
        });
    }

    start() {
        this.sparkle.show(this.patchesCollection.getPathFollower(), 0.1);

        // todo: move color to the config
        const colorName = this.data.sewingMachine.routes[0].correctColor;
        this.setColor(colorName);

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
            screens.tutorial.hide();
        }

        this.handleBtnPress();
    }

    handleOnMove(data) {

    }

    handleOnUp(data) {
        // GM.trigger.interactionComplete();
        this.handleBtnRelease();
    }

    handleBtnPress() {
        if (this.status.btnPressed) {
            this.status.btnPressedTime = 0;

            screens.choices.hide();
            this.sewingMachine.activate();
            this.sparkle.hide();
            this.setColor(this.status.selectedColor);

            customEvents.stitchNum(++this.status.btnPressedCounter);

            if (this.status.btnPressedCounter === 1 && cfg.get('convert.firstInteractionComplete')) {
                sqHelper.convertDelay(2000, () => {
                    this.handleOnUp();
                });
            }

            if (this.status.nextPatch) {
                this.status.nextPatch = false;
                customEvents.areaStart(this.patchesCollection.status.completed.length + 1);
            }
        }
    }

    handleBtnRelease() {
        this.status.btnPressedTime = 0;

        if (this.status.btnPressed) {
            this.status.btnPressed = false;
            screens.choices.show();
            this.sewingMachine.deactivate();
            this.sparkle.show(this.patchesCollection.getPathFollower());
        }
    }

    handleGameover(isWin) {
        console.log('game over');

        this.status.gameover = true;

        this.sewingMachine.deactivate();
        this.sewingMachine.hide();

        screens.choices.disable();
        screens.hint.deactivate();
        screens.ui.hide();

        this.cameraHelper.focusOnTarget(this.element.model, 1000, () => {
            if (isWin) {
                sqHelper.levelWin();
            } else {
                this.patchesCollection.fallOffIncorrectColoredPatches(() => {
                    tweens.wait(200).then(() => {
                        sqHelper.levelLose();
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
        if (this.status.intro) {
            this.patchesCollection.update(this.sewingMachine.group, this.element.objectsToSkip, dt);
        }

        if (this.status.btnPressedTime && performance.now() - this.status.btnPressedTime > 100) {
            this.status.btnPressed = true;
            this.handleBtnPress();
        }

        // if (this.sewingMachine.status.active) {
        //     this.patchesCollection.update(this.sewingMachine.group, this.element.objectsToSkip, dt);
        // }

        // if (!this.status.gameover) {
        //     this.cameraHelper.update(this.sewingMachine.group);
        // }
    }

    resize() {

    }

    remove() {

    }
}