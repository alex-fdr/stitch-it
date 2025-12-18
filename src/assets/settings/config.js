export default {
    default: {
        hintTimeout: {
            type: 'float',
            title: 'Show hint after X seconds of inactivity.',
            value: 1,
            min: 0,
            max: 10,
            step: 0.1,
            hidden: true,
        },
        sqTimeout: {
            type: 'float',
            title: 'Show SQ after X seconds after first intercation.',
            value: 0,
            min: 0,
            max: 10,
            step: 0.1,
            hidden: true,
        },
        sqInteraction: {
            type: 'int',
            title: 'SQ on X move (amount).',
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            hidden: true,
        },
        attempts: {
            type: 'int',
            title: 'Amount of attempts.',
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            hidden: true,
        },
        enableAmazing: {
            type: 'bool',
            title: 'Enable Amazing screen?',
            value: false,
            hidden: true,
        },
        enableWasted: {
            type: 'bool',
            title: 'Enable Wasted screen?',
            value: false,
            hidden: true,
        },
        enableRetry: {
            type: 'bool',
            title: 'Show retry screen after fail?',
            value: false,
            hidden: true,
        },
        autoRetry: {
            type: 'bool',
            title: 'Restart automatically after fail?',
            value: false,
            hidden: true,
        },
        nextLevelAfterLose: {
            type: 'bool',
            title: 'Load next level after fail?',
            value: false,
            hidden: true,
        },
        sqOnLastLevel: {
            type: 'bool',
            title: 'Show fake level after win/lose',
            value: false
        },
        sqOnTutorial: {
            type: 'bool',
            title: 'First click on tutorial leads to store',
            value: false,
            hidden: true,
        },
        sqScreens: {
            type: 'list',
            title: 'Click on screen leads to store',
            value: [
                'win',
                'lose'
            ],
            hidden: true,
        },
        autoConvertScreens: {
            type: 'object',
            title: 'Autoconvert screens. E.G.: { win: 2 }',
            value: {
                win: 0,
                lose: 0
            }
        },
        levels: {
            type: 'list',
            title: 'Levels.',
            value: ['avocadoLevel']
            //   value: ['penguinLevel']
        },
        disableDelayedConvert: {
            type: 'bool',
            title: 'If user didn\'t interacted last 6 sec - disable superquick',
            value: true,
            hidden: true,
        },
        disableEndGame: {
            type: 'bool',
            title: 'Disable EndGame event for Vungle?',
            value: false,
            hidden: true,
        },
    },

    intro: {
        time: {
            type: 'int',
            title: 'Intro time',
            value: 700,
            min: 500,
            max: 1500,
            step: 100
        },
    },

    tutorial: {
        textVisible: {
            type: 'bool',
            title: 'Text',
            value: true
        }
    },

    sewingMachine: {
        speed: {
            type: 'int',
            title: 'Move speed',
            value: 5,
            min: 1,
            max: 15,
            step: 1,
        },
        // stitchType: {
        //   type: 'enum',
        //   title: 'Stitch type',
        //   value: 'yarn',
        //   options: {
        //     yarn: 'yarn',
        //     threads: 'threads'
        //   }
        // }
    },

    convert: {
        firstInteractionComplete: {
            type: 'bool',
            title: 'First interacion complete',
            value: false
        },

        firstPatchComplete: {
            type: 'bool',
            title: 'First patch complete',
            value: false
        },
    }
};
