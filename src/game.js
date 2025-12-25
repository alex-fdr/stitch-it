import { assets, core } from '@alexfdr/three-game-core';
import { htmlScreens, tweens, pixiUI, input, DragHandler } from '@alexfdr/three-game-components';
import { gameSettings } from './data/game-settings';
import { Assets as PixiAssets } from 'pixi.js';

import modelAvocado from './assets/models/avocado.glb';
import modelPenguin from './assets/models/penguin.glb';
import modelSewingMachine from './assets/models/sewing-machine.glb';
import modelStitch from './assets/models/stitch.glb';
import textureJeans from './assets/textures/jeans.jpg';
import textureSparkle from './assets/textures/sparkle.png';

// pixi.js images and fonts
import gamefont from './assets/fonts/gamefont.woff';
import imageLogo from './assets/images/logo.png';
import imageOverlayRed from './assets/images/overlay-red.png';
import spritesheetTapJson from './assets/spritesheets/tap.json?url';
import spritesheetAtlasJson from './assets/spritesheets/atlas.json?url';

import { levelMediator } from './level-mediator';
// import { debug } from '@alexfdr/three-debug-gui';
// import { LoseScreen } from './screens/lose';
// import { WinScreen } from './screens/win';
import { UIScreen } from './screens/ui';
import { TutorialScreen } from './screens/tutorial';
import { ChoicesScreen } from './screens/choices';
import { HintScreen } from './screens/hint';
import { cfg } from './data/cfg';

export class Game {
    constructor() {
        htmlScreens.add('loading');
    }

    async start({ width, height }) {
        core.init(width, height, gameSettings);
        input.init(core.renderer.domElement, new DragHandler());

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

        await PixiAssets.load([
            { alias: 'gamefont', src: gamefont },
            { alias: 'logo', src: imageLogo },
            { alias: 'overlay-red', src: imageOverlayRed },
            { src: spritesheetTapJson },
            { src: spritesheetAtlasJson },
        ]);

        core.onUpdate.add(this.update, this);
        core.onResize.add(this.resize, this);

        const levelName = cfg.get('levels')[0];
        const screenProps = { parent: pixiUI.stage, visible: false };
        const { choices } = levelMediator.levelsData[levelName];

        pixiUI.screens.set('ui', new UIScreen(screenProps));
        pixiUI.screens.set('tutorial', new TutorialScreen(screenProps));
        pixiUI.screens.set('choices', new ChoicesScreen({ ...screenProps, ...choices }));
        pixiUI.screens.set('hint', new HintScreen(screenProps));

        levelMediator.loadLevel(levelName);
        htmlScreens.hide('loading');
        this.resize(width, height);

        // if (new URLSearchParams(window.location.search).has('debug')) {
        //     debug.init({
        //         scene: core.scene,
        //         canvas: core.renderer.domElement,
        //         camera: core.camera,
        //         options: {
        //             scene: true,
        //             props: true,
        //         },
        //     });
        // }
    }

    resize(width, height) {
        levelMediator.resize(width, height);
        pixiUI.resize(width, height);
    }

    update(time, deltaTime) {
        core.render();
        pixiUI.render();

        tweens.update(time);
        levelMediator.update(deltaTime * 60);
    }
}
