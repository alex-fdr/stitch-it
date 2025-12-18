export const gameSettings = {
    scene: {
        bg: 0x75dabc,
        fog: {
            hex: 0x9ce6af,
            near: 50,
            far: 120,
        },
        lights: [
            {
                type: 'directional',
                color: 0xffffff,
                intensity: 1,
                data: {
                    castShadow: true,
                    position: { x: 5, y: 15, z: -20 },
                    shadow: {
                        mapSize: {
                            width: 2048,
                            height: 2048,
                        },
                        camera: {
                            top: 10,
                            bottom: -10,
                            left: -10,
                            right: 10,
                            far: 100,
                        },
                    },
                },
            },
            {
                type: 'hemisphere',
                skyColor: 0xffffff,
                groundColor: 0xffffff,
                intensity: 1,
                data: {
                    position: { x: 0, y: 0, z: 0 },
                },
            },
        ],
    },
    renderer: {
        antialias: true,
        alpha: true,
        color: 0xff0000,
        opacity: 1,
        shadow: false,
        stencil: true,
        needResetState: true,
    },
    camera: {
        fov: {
            landscape: 30,
            portrait: 45,
        },
        near: 0.1,
        far: 2000,
        position: { x: 0, y: 20, z: -10 },
        // following: {
        //     enabled: true,
        //     lerp: 0.1,
        //     position: { x: 0, y: 0, z: 0 },
        // },
    },
    physics: {},
    debug: {},
};
