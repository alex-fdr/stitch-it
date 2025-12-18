import { assets, core } from '@alexfdr/three-game-core';
import { pixiUI } from '@alexfdr/three-pixi-ui';
// import { HintTap } from './helpers/ui/hint-tap';
// import { levelMediator } from './level-mediator';
// import { Choices } from './screens/choices';
// import { Lose } from './screens/lose';
// import { TutorialScreen } from './screens/tutorial';
// import { UI } from './screens/ui';
// import { Win } from './screens/win';
import { htmlScreens, tweens } from '@alexfdr/three-game-components';
import { gameSettings } from './data/game-settings';
import { Assets as PixiAssets } from 'pixi.js';

import modelAvocado from './assets/models/avocado.glb';
import modelPenguin from './assets/models/penguin.glb';
import modelSewingMachine from './assets/models/sewing-machine.glb';
import modelStitch from './assets/models/stitch.glb';
import textureJeans from './assets/textures/jeans.jpg';
import textureSparkle from './assets/textures/sparkle.png';

import config from './assets/settings/config';
import { levelMediator } from './level-mediator';
import { debug } from '@alexfdr/three-debug-gui';

export class Game {
    constructor() {
        htmlScreens.add('loading');
    }

    async start({ width, height }) {
        core.init(width, height, gameSettings);

        await assets.load({
            models: [
                { key: 'avocado', file: modelAvocado },
                { key: 'penguin', file: modelPenguin },
                { key: 'sewing-machine', file: modelSewingMachine },
                { key: 'stitch', file: modelStitch },
            ],
            textures: [
                { key: 'jeans', file: textureJeans },
                { key: 'sparkle', file: textureSparkle },
            ],
        });

        await pixiUI.init(core.renderer, width, height);

        // await PixiAssets.load([
        //     { alias: '', src: },
        // ]);

        core.onUpdate.add(this.update, this);
        core.onResize.add(this.resize, this);

        // utils.loadAll([threeAssets.init]).then(() => {
        //     pixiUI.init(() => {
        //         const levelName = GM.config.get('levels')[0];
        //         const { stitchType, colors } = levelMediator.getLevelData(levelName).choices;

        //         this.screens.choices = new Choices(false, stitchType, colors);
        //         this.screens.ui = new UI(true);
        //         this.screens.hint = new HintTap(false);
        //         this.screens.win = new Win();
        //         this.screens.lose = new Lose();
        //         this.screens.tutorial = new TutorialScreen();

        //         screens.addMultiple(this.screens);

        //         GM.trigger.loadComplete();
        //     }, threeScene.renderer.domElement);
        // });

        levelMediator.loadLevel(config.default.levels.value[0]);

        htmlScreens.hide('loading');

        if (new URLSearchParams(window.location.search).has('debug')) {
            debug.init({
                scene: core.scene,
                canvas: core.renderer.domElement,
                camera: core.camera,
                options: {
                    scene: true,
                    props: true,
                },
            });
        }
    }

    resize(width, height) {
        levelMediator?.resize(width, height);
        pixiUI.resize(width, height);
    }

    update(time, deltaTime) {
        core.render();
        pixiUI.render();

        tweens.update(time);
        levelMediator.update(deltaTime * 60);
    }
}
