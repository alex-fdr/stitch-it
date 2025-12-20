import {
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
} from 'three';

const cache = {};

export function getMaterialByColor(color, type = 'lambert') {
    let material;

    if (!cache[color]) {
        material = createMaterial(color, type);
        cache[color] = material;
    }

    return cache[color];
}

function createMaterial(color, type) {
    switch (type) {
        case 'lambert':
            return new MeshLambertMaterial({ color });
        case 'phong':
            return new MeshPhongMaterial({ color });
        case 'basic':
            return new MeshBasicMaterial({ color });
        case 'standard':
            return new MeshStandardMaterial({ color });
    }
}
