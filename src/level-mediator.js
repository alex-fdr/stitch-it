import { LevelInstance } from './level-instance';
import * as levels from './data/levels';

class LevelMediator {
    constructor() {
        this.levels = {
            avocadoLevel: levels.avocadoLevel,
            penguinLevel: levels.penguinLevel
        };
        // this.instances = [];
        this.levelInstance = null;
    }
    getLevelData(name) {
        return this.levels[name];
    }

    loadLevel(name) {
        console.log('load level', name);
        const level = this.levels[name];

        if (!level) {
            console.warn(`Level ${name} not found`);
        }

        console.info(`Loading level: ${name}`);

        if (this.levelInstance) {
            this.levelInstance.remove();
        }

        this.levelInstance = new LevelInstance();
        this.levelInstance.init(level);
    }

    update(dt) {
        if (this.levelInstance) {
            this.levelInstance.update(dt);
        }
    }

    resize(width, height) {
        this.levelInstance.resize(width, height);
    }
}

export const levelMediator = new LevelMediator();
