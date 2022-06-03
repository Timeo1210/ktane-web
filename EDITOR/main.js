var index_view = 2
var views = ['back', 'left', 'front', 'right']

var coord_modules = [{x: 151, y: 26}, {x: 371, y: 26}, {x: 591, y: 26}, {x: 151, y: 246}, {x: 371, y: 246}, {x: 591, y: 246}]
var module_in_hand = ''
var selected_module = []
var tools = ['Timer', 'Fils', 'Button', 'Symboles', 'Simon']

var actif_tabs = [
    ['Timer', 0, 'timer_output', {'eval': []}, 0],
    ['Fils', 0, 'canvas_fils_0', {'eval': []}, 0],
    ['Button', 0, 'canvas_buttton_0', {'eval': []}, 0],
    ['Symboles', 0, 'canvas_symboles_0', {'eval': []}, 0],
    ['Simon', 0, 'canvas_simon_0', {'eval': []}, 0],
]

var var_Bomb = {
    'Timer': [],
    'Fils': [],
    'Button': [],
    'Symboles': [],
    'Simon': [],
    'Side_left': [],
    'Side_right' : []
}

var Bomb_Architecture = [
    {
        indicator: {
            on: [],
            off: []
        },
        number_battery: 0,
        serial_number: '',
        time_of_level: 0
    },
    [
        [['None', 0], ['None', 1], ['None', 2], ['None', 3], ['None', 4], ['None', 5]],
        [],
        [['None', 0], ['None', 1], ['None', 2], ['None', 3], ['Timer', 0, 'timer_output', {'eval':[`var_Bomb['Timer'][0] = new Timer;`]}, 4,], ['None', 5]],
        [],
    ]
]

document.onload = Initing_Editor()

function Initing_Editor() {
    document.getElementById('all').hidden = false
    document.addEventListener('mousedown', (e) => {processMouseDown(e)})
    document.addEventListener('mouseup', (e) => {processMouseUp(e)})
    //document.addEventListener('mousemove', (e) => {processMouseMove(e)})
    document.addEventListener('contextmenu', (e) => {processRightClick(e)});

    processBomb_Arch()
}

function ms_To_min(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function processBomb_Arch() {
    var side_div = [document.getElementById('back'), document.getElementById('left'), document.getElementById('front'), document.getElementById('right')]

    for (let j = 0; j < Bomb_Architecture[1].length; j++) {
        if (j === 0 || j === 2) {
            var first_line_div = document.createElement('div')
            side_div[j].appendChild(first_line_div)
            first_line_div.className = 'first_Line'

            var second_line_div = document.createElement('div')
            side_div[j].appendChild(second_line_div)
            second_line_div.className = 'second_Line'

            for (let i = 0; i < 6; i++) {
                var temp_div = document.createElement('div')
                temp_div.id = j.toString() + '/' + i.toString()
                temp_div.setAttribute('draggable', true);
                if (Bomb_Architecture[1][j][i] !== undefined && i === Bomb_Architecture[1][j][i][4]) {
                    temp_div.className = 'module ' + Bomb_Architecture[1][j][i][0].toLowerCase()
                } else {
                    temp_div.className = 'module ' + 'None'.toLowerCase()
                }

                if (i < 3) {
                    first_line_div.appendChild(temp_div)
                } else {
                    second_line_div.appendChild(temp_div)
                }


                if (Bomb_Architecture[1][j][i] !== undefined && Bomb_Architecture[1][j][i][0] !== 'None') {
                    var_Bomb[Bomb_Architecture[1][j][i][0]].push('')

                    if (Bomb_Architecture[1][j][i][0].toLowerCase() === 'timer') {
                        //temp_div.id = 'Timer'

                        var h1 = document.createElement('h1')
                        h1.id = 'timer_output'
                        h1.innerHTML = ms_To_min(Bomb_Architecture[0].time_of_level)
                        temp_div.appendChild(h1)
                    } else {
                        var canvas = document.createElement('canvas')
                        canvas.id = Bomb_Architecture[1][j][i][2]
                        canvas.height = 200
                        canvas.width = 200
                        temp_div.appendChild(canvas)
                    }
                    /*
                    for (let k = 0; k < Bomb_Architecture[1][j][i][3]['eval'].length; k++) {
                        eval(Bomb_Architecture[1][j][i][3]['eval'][k])
                    }
                    */



                }
            }
        } else {
            var canvas = document.createElement('canvas')
            side_div[j].appendChild(canvas)
            canvas.id = 'canvas_' + side_div[j].id.toString()
            canvas.width = 240;
            canvas.height = 456;
            if (Bomb_Architecture[1][j][0] !== undefined && Bomb_Architecture[1][j][0][2] === 'back_plate') {
                var_Bomb['Side_left'].push('')
                var_Bomb['Side_left'][0] = new Side('canvas_left', j)
            }
        }
    }
}

function processMouseDown(e) {
    e.preventDefault()
    if (views[index_view] === 'back' || views[index_view] === 'front') {
        for (let j = 0; j < coord_modules.length; j++) {
            if ((e.x > coord_modules[j].x && e.x < coord_modules[j].x + 200) && (e.y > coord_modules[j].y && e.y < coord_modules[j].y + 200)) {

                module_in_hand = j

                //border
                var index = ''
                if (views[index_view] === 'back') {
                    index = 0
                } else {
                    index = 2
                }
                document.getElementById(index.toString() + '/' + j.toString()).style.margin = "0px"
                document.getElementById(index.toString() + '/' + j.toString()).style.border = "10px solid yellow"
            }
        }
    }
}

function processMouseUp(e) {

    if (views[index_view] === 'back' || views[index_view] === 'front' && module_in_hand !== '') {
        for (let j = 0; j < coord_modules.length; j++) {
            if ((e.x > coord_modules[j].x && e.x < coord_modules[j].x + 200) && (e.y > coord_modules[j].y && e.y < coord_modules[j].y + 200)) {

                //SWAP
                if (j !== module_in_hand) {

                    var temp_tab_toSwap1 = Bomb_Architecture[1][index_view][module_in_hand]
                    var temp_tab_toSwap2 = Bomb_Architecture[1][index_view][j]
                    if (temp_tab_toSwap1[0] !== 'None') {
                        temp_tab_toSwap1[4] = j
                    }
                    if (temp_tab_toSwap2[0] !== 'None') {
                        temp_tab_toSwap2[4] = module_in_hand
                    }
                    Bomb_Architecture[1][index_view][j] = temp_tab_toSwap1
                    Bomb_Architecture[1][index_view][module_in_hand] = temp_tab_toSwap2

                    console.log("REFRESH")
                    refresh_Bomb_Arch()
                    return
                } else {
                    document.getElementById(index_view.toString() + '/' + j.toString()).style.margin = "10px"
                    document.getElementById(index_view.toString() + '/' + j.toString()).style.border = "none"
                    return
                }


            }

        }
    }
    module_in_hand = ''
}

function processRightClick(e) {
    e.preventDefault()
    if (views[index_view] === 'back' || views[index_view] === 'front' && module_in_hand !== '') {
        for (let j = 0; j < coord_modules.length; j++) {
            if ((e.x > coord_modules[j].x && e.x < coord_modules[j].x + 200) && (e.y > coord_modules[j].y && e.y < coord_modules[j].y + 200)) {
                for (let i = 0; i < selected_module.length; i++) {
                    if (selected_module[i] === j) {
                        //ALREADY CHOOSE
                        selected_module.splice(i, 1)
                        document.getElementById(index_view.toString() + "/" + j.toString()).style.border = "none"
                        document.getElementById(index_view.toString() + "/" + j.toString()).style.margin = "10px"
                        return
                    }
                }
                if (selected_module.some(elem => elem === j) === false) {
                    selected_module.push(j)
                    document.getElementById(index_view.toString() + '/' + j.toString()).style.border = "10px solid yellow"
                    document.getElementById(index_view.toString() + '/' + j.toString()).style.margin = "0px"
                }

                /*
                document.getElementById(index_view.toString() + '/' + selected_module.toString()).style.border = "none"
                document.getElementById(index_view.toString() + '/' + selected_module.toString()).style.margin = "10px"

                document.getElementById(index_view.toString() + '/' + j.toString()).style.border = "10px solid yellow"
                document.getElementById(index_view.toString() + '/' + j.toString()).style.margin = "0px"
                */
            }
        }
    }
}

function refresh_Bomb_Arch() {
    for (let j = 0; j < views.length; j++) {
        document.getElementById(views[j]).innerHTML = ''
    }
    selected_module = []
    processBomb_Arch()
}




function Left_Arrow() {
    document.getElementById(views[index_view]).hidden = true
    if (index_view - 1 < 0) {
        index_view = views.length - 1 //3
    } else {
        index_view--
    }

    Change_Side()
}

function Right_Arrow() {
    document.getElementById(views[index_view]).hidden = true
    if (index_view + 1 > views.length - 1) {
        index_view = 0 //3
    } else {
        index_view++
    }

    Change_Side()
}

function Change_Side() {
    document.getElementById(views[index_view]).hidden = false
    if (views[index_view] === 'left' || views[index_view] === 'right') {
        document.getElementById("game").style.width = "240px";
        document.getElementById("game").style.marginLeft = "350px";
    } else {
        document.getElementById("game").style.width = "660px";
        document.getElementById("game").style.marginLeft = "125px";
    }
}

function aff_tool(type) {
    console.log(tools[type])
}
