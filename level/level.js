var list_of_level = {
    'level_0': [
        Bomb_properties = {
            'time_of_level': 180000,
            'serial_number': 'QA56F4',
            'number_battery': 2,
            'indicator' : {
                'on': ['CAR', 'SND', 'FRK'],
                'off': ['BOB']
            }
        },
        [
            [],
            [[0, 'ports', 'back_plate',['PS_2', 'RJ-45', 'Stereo_RCA', 'Serie']], [2, 'indicator', 'indicator_default', ['CAR', 'on']], [1, 'battery', 'AA'], [3, 'serial', 'serial', ['QA56F4']]],
            [
                [
                'Timer',
                0,
                'timer_output',
                {
                    'eval':
                    [
                        `var_Bomb['Timer'][0] = new Timer;`
                    ]
                },
                0,
            ],
                [
                    'None',
                ],
                [
                    'Button',
                    0,
                    'canvas_button_0',
                    {
                        'eval':
                        [
                            /*`var_Bomb['Button'][0] = new Button('canvas_button_0',
                            {
                                'text': 'Hold',
                                'color': 'red',
                                'color_rectangle': ['0', '255', '255', 'cyan'],
                            });`,*/
                            `var_Bomb['Button'][0] = new Button('canvas_button_0', '', true)`,
                            `var_Bomb['Button'][0].canvas.addEventListener('mousedown', (e) => {var_Bomb['Button'][0].processMouseDown(e)})`,
                            `var_Bomb['Button'][0].canvas.addEventListener('mouseup', (e) => {var_Bomb['Button'][0].processMouseUp(e)})`,
                            `var_Bomb['Button'][0].AFF_Circle_Up()`,
                            `var_Bomb['Button'][0].ProcessWin()`
                        ]
                    },
                    2,
                ],
                [
                    'Symboles',
                    0,
                    'canvas_symboles_0',
                    {
                        'eval':
                        [
                            `var_Bomb['Symboles'][0] = new Symboles('canvas_symboles_0')`,
                            `var_Bomb['Symboles'][0].canvas.addEventListener('click', (e) => {var_Bomb['Symboles'][0].processClick(e)})`,
                            `var_Bomb['Symboles'][0].processSymbole()`,
                        ]
                    },
                    3,
                ],
                [
                    'Simon',
                    0,
                    'canvas_simon_0',
                    {
                        'eval':
                        [
                            `var_Bomb['Simon'][0] = new Simon('canvas_simon_0')`,
                            `var_Bomb['Simon'][0].canvas.addEventListener('click', (e) => {var_Bomb['Simon'][0].processClick(e)})`,
                            `var_Bomb['Simon'][0].Init()`,
                        ]
                    },
                    4,
                ],
                [
                    'Fils',
                    0,
                    'canvas_fils_0',
                    {
                        'eval':
                        [
                            `var_Bomb['Fils'][0] = new Fils('canvas_fils_0');`,
                            `var_Bomb['Fils'][0].canvas.addEventListener('click', (e) => {var_Bomb['Fils'][0].processClick(e)})`,
                            `var_Bomb['Fils'][0].AFF_fil(0, 'blue')`,
                            `var_Bomb['Fils'][0].AFF_fil(1, 'red')`,
                            `var_Bomb['Fils'][0].AFF_fil(2, 'white')`,
                            `var_Bomb['Fils'][0].AFF_fil(4, 'red')`,
                            `var_Bomb['Fils'][0].ProcessWin()`,
                        ]
                    },
                    5,
                ],
            ],
            [''],

        ]
    ]
}
