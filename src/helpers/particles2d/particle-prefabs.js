export const particlePrefabs = {
    'vertical-down': {
        total: 50,
        lifetime: -1,
        velocityX: [0],
        velocityY: [2, 4],
        gravity: [0.02, 0.04],
        angularVelocity: [0],
        rangeX: [-480, 480],
        rangeY: [-480, -480 * 3],
        scale: [0.6, 1.4],
        alpha: [0.5, 1],
    },

    'vertical-up': {
        total: 50,
        lifetime: -1,
        velocityX: [0],
        velocityY: [-2, -4],
        gravity: [-0.02, -0.04],
        angularVelocity: [0],
        rangeX: [-480, 480],
        rangeY: [480, 480 * 3],
        scale: [0.6, 1.4],
        alpha: [0.5, 1],
    },

    center: {
        total: 50,
        lifetime: -1,
        velocityX: [2, 3],
        velocityY: [2, 3],
        accelerationX: [0.05],
        accelerationY: [0.05],
        spreadAngle: [0, 360],
    },

    explosion: {
        total: 100,
        lifetime: 400,
        scale: [0.1, 0.3],
        alpha: [0.6, 1],
        velocityX: [2, 4],
        velocityY: [-4, -7],
        gravity: [0.2, 0.5],
        angularVelocity: [0],
        spreadAngle: [30, 150],
    },
};
