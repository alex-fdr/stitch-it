import { LevelInstance } from './level-instance';
import * as levels from './data/levels';

class LevelMediator {
    constructor() {
        this.levelsData = {
            avocadoLevel: levels.avocadoLevel,
            penguinLevel: levels.penguinLevel,
        };

        this.currentLevel = null;
    }

    loadLevel(name) {
        const level = this.levelsData[name];

        if (!level) {
            console.warn(`Level ${name} not found`);
        }

        console.log(`loading level: ${name}`);

        if (this.currentLevel) {
            this.currentLevel.remove();
            this.currentLevel = null;
        }

        this.currentLevel = new LevelInstance();
        this.currentLevel.init(level);
    }

    update(dt) {
        this.currentLevel?.update(dt);
    }

    resize(width, height) {
        this.currentLevel?.resize(width, height);
    }
}

export const levelMediator = new LevelMediator();
