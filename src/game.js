import { assets, core } from '@alexfdr/three-game-core';
// import { HintTap } from './helpers/ui/hint-tap';
// import { levelMediator } from './level-mediator';
// import { Choices } from './screens/choices';
// import { Lose } from './screens/lose';
// import { TutorialScreen } from './screens/tutorial';
// import { UI } from './screens/ui';
// import { Win } from './screens/win';
import { htmlScreens, tweens, pixiUI } from '@alexfdr/three-game-components';
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
import imageButtonBase from './assets/images/button-base.png';
import imageButton from './assets/images/button.png';
import imageDummyWhite from './assets/images/dummy-white.png';
import imageLogo from './assets/images/logo.png';
import imageMarkGreen from './assets/images/mark-green.png';
import imageMarkRed from './assets/images/mark-red.png';
import imageOverlayRed from './assets/images/overlay-red.png';
import imageThreadsPink from './assets/images/threads-pink.png';
import imageThreadsWhite from './assets/images/threads-white.png';
import imageYarnGreen from './assets/images/yarn-green.png';
import imageYarnYellow from './assets/images/yarn-yellow.png';
import imageParticleBlue from './assets/images/particles/particle-blue.png';
import imageParticleGreen from './assets/images/particles/particle-green.png';
import imageParticleOrange from './assets/images/particles/particle-orange.png';
import imageParticlePurple from './assets/images/particles/particle-purple.png';
import spritesheetTapJson from './assets/spritesheets/tap.json?url';

import { levelMediator } from './level-mediator';
// import { debug } from '@alexfdr/three-debug-gui';
import { UIScreen } from './screens/ui';
import { TutorialScreen } from './screens/tutorial';
import { ChoicesScreen } from './screens/choices';
import { HintTap } from './helpers/ui/hint-tap';
import { cfg } from './data/cfg';

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

        await PixiAssets.load([
            { alias: 'gamefont', src: gamefont },
            { alias: 'button-base', src: imageButtonBase },
            { alias: 'button', src: imageButton },
            { alias: 'dummy-white', src: imageDummyWhite },
            { alias: 'logo', src: imageLogo },
            { alias: 'mark-green', src: imageMarkGreen },
            { alias: 'mark-red', src: imageMarkRed },
            { alias: 'overlay-red', src: imageOverlayRed },
            { alias: 'threads-pink', src: imageThreadsPink },
            { alias: 'threads-white', src: imageThreadsWhite },
            { alias: 'yarn-green', src: imageYarnGreen },
            { alias: 'yarn-yellow', src: imageYarnYellow },
            { alias: 'particle-blue', src: imageParticleBlue },
            { alias: 'particle-green', src: imageParticleGreen },
            { alias: 'particle-orange', src: imageParticleOrange },
            { alias: 'particle-purple', src: imageParticlePurple },
            { src: spritesheetTapJson },
        ]);

        core.onUpdate.add(this.update, this);
        core.onResize.add(this.resize, this);

        const levelName = cfg.get('levels')[0];
        const screenProps = { parent: pixiUI.stage, visible: false };
        const { choices } = levelMediator.levelsData[levelName];

        pixiUI.screens.set('ui', new UIScreen(screenProps));
        pixiUI.screens.set('tutorial', new TutorialScreen(screenProps));
        pixiUI.screens.set('choices', new ChoicesScreen({ ...screenProps, ...choices }));
        pixiUI.screens.set('hint', new HintTap(screenProps));

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
