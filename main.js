//class
/*var timer = new Timer;
var fils = new Fils('canvas_fils');
var button = new Button;
var symboles = new Symboles;
var simon = new Simon;
var testclass = new TestClass;
*/


//var KTANE_server = 'http://localhost:8080/' //temp
//var KTANE_server = "https://ktane-serv.herokuapp.com/"
var KTANE_server = window.location.origin + "/KTANE/data"

var Sound = {
    Explosion: document.getElementById('Explosion_Sound'),
    Clock: document.getElementById('Clock_Sound'),
    Cutting_Wire: document.getElementById('Cutting_Wire_Sound'),
    Button_Click_On: document.getElementById('Button_Click_On'),
    Button_Click_Up: document.getElementById('Button_Click_Up'),
    Click: document.getElementById('Click'),
}
var var_Bomb = {
    'Timer': [],
    'Fils': [],
    'Button': [],
    'Symboles': [],
    'Simon': [],
    'WITF': [],
    'Memory': [],
    'Maze': [],
    'Side_left': [],
    'Side_right' : [],
}
var Bomb_Architecture = ''

var WinNumber = 0
var WinCondition = 0

var views = ['back', 'left', 'front', 'right']
var index_view = 2

var indic = ['SND', 'CLR', 'CAR', 'IND', 'FRQ', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB', 'FRK'] //36 35 18
var battery = ['AA', 'D']
var port = ['DVI-D', 'Parallele', 'PS/2', 'RJ-45', 'Serie', 'Stereo_RCA']

/*
function monAdresseIP() {
     var ip = false;
     if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
     else xmlhttp = new XMLHttpRequest();
     xmlhttp.open('GET', 'http://ip-api.com/',false);
     xmlhttp.send();
     var reponse = JSON.Parse(xmlhttp.responseText);
     //On suppose que l'adresse IP est stockée avec la clé ip. Regardez les exemples fournis par les services pour savoir quelle clé correspond à l'adresse IP
     if (reponse[ip])
     ip = reponse[ip]
     return ip;
}
*/
var json_data = ''

function Get_IP() {
    $.getJSON(KTANE_server + 'list_ip', function(data) {
        console.log(data)
    })
}

function Initing_System() {
    var level = 1;

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    if (url.searchParams.get("l")) {
        level = parseInt(url.searchParams.get("l"))
    }
    //GET LEVEL

    // $.getJSON(KTANE_server + '?level=' + level.toString(), function(data) {
    $.getJSON(KTANE_server + '/level_' + level.toString() + ".json", function(data) {
        json_data = JSON.stringify(data, null, 2)
        json_to_bomb()
        document.getElementById("btn_Start").disabled = false
    })


    //send IP

    $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
        var ip = ''
        ip = JSON.stringify(data, null, 2)
        ip = JSON.parse(ip)
        ip = ip.geoplugin_request
        $.post(KTANE_server, {ip: ip})
    });

}

function json_to_bomb() {
    json_data = JSON.parse(json_data)
    Bomb_Architecture = eval(json_data)
}

document.onload = Initing_System()


function Initing_Game() {
    //BUTTON DISABLE
    document.getElementById('btn_Start').innerHTML = 'Recommencer'
    document.getElementById('btn_Start').disabled = true
    document.getElementById('btn_Start').hidden = true
    document.getElementById('btn_Start').onclick = Restart_Url

    document.getElementById('left_arrow').hidden = false
    document.getElementById('right_arrow').hidden = false

    document.getElementById(views[index_view]).hidden = false

    Bomb_properties = Bomb_Architecture[0]

    document.getElementsByClassName("button_center").item(0).hidden = true



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

var context = ''

function ms_To_min(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function BombExplose() {
    console.log('EXPLOSION')
    //TIMER STOP
    var_Bomb['Timer'][0].Stop()
    //SOUND
    Sound.Explosion.play()
    //GAME UNAFF
    document.getElementById('game').innerHTML = ''
    //AFF LOSE
    document.getElementById('win_output').innerHTML = 'Vous avez Perdu !!'
    //RESET_BOMB
    Reset_Bomb()
}

function New_Error() {
    var_Bomb['Timer'][0].Update_mistake()
    var_Bomb['Simon'].forEach(elem => elem.update_Tab_Win())
}

function CheckMistake() {
    if (var_Bomb['Timer'][0].mistake === var_Bomb['Timer'][0].max_mistake) {
        return true
    }
}


function AFF_Win_Module(id) {
    canvas = document.getElementById(id)
    context = canvas.getContext("2d");

    /*context.beginPath();
    context.arc(150, 35, 20, 0, Math.PI * 2, true);
    context.fillStyle='black'
    context.fill();
    context.closePath();*/

    context.beginPath();
    context.arc(150, 35, 16, 0, Math.PI * 2, true);
    context.fillStyle= 'green'
    context.fill();
    context.closePath();

    WinNumber++
    if (WinNumber === WinCondition) {
        WinAFF()
    }
}

function WinAFF() {
    //TIMER STOP
    var_Bomb['Timer'][0].Stop()
    //CLEAR
    document.getElementById('game').innerHTML = ''
    //AFF WIN
    document.getElementById('win_output').innerHTML = 'Vous avez Gagnez !!'
    //RESET
    Reset_Bomb()
    //BUTTON
}

function Restart_Url() {
    window.location = window.location;
}

function processBomb_Arch() {
    //INIT DIV LINE
    var side_div = [document.getElementById('back'), document.getElementById('left'), document.getElementById('front'), document.getElementById('right')]

    document.getElementById('game').hidden = false

    //FRONT
    /*
    var first_line_div = document.createElement('div')
    front_div.appendChild(first_line_div)
    first_line_div.className = 'first_Line'


    var second_line_div = document.createElement('div')
    second_line_div.className = 'second_Line'
    front_div.appendChild(second_line_div)
    */

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
                        temp_div.id = 'Timer'

                        var h1 = document.createElement('h1')
                        h1.id = 'timer_output'
                        temp_div.appendChild(h1)
                    } else {
                        var canvas = document.createElement('canvas')
                        canvas.id = Bomb_Architecture[1][j][i][2]
                        canvas.height = 200
                        canvas.width = 200
                        temp_div.appendChild(canvas)
                    }

                    for (let k = 0; k < Bomb_Architecture[1][j][i][3]['eval'].length; k++) {
                        eval(Bomb_Architecture[1][j][i][3]['eval'][k])
                    }


                }
            }
        } else {
            var side_choose = ['', 'left', '', 'right']
            var canvas = document.createElement('canvas')
            side_div[j].appendChild(canvas)
            canvas.id = 'canvas_' + side_div[j].id.toString()
            canvas.width = 240;
            canvas.height = 456;
            /*
            if (Bomb_Architecture[1][j][0][2] === 'back_plate') {
                var_Bomb['Side_left'].push('')
                var_Bomb['Side_left'][0] = new Side('canvas_left', j)
            }
            */
            var_Bomb['Side_' + side_choose[j]].push('')
            var_Bomb['Side_' + side_choose[j]][0] = new Side('canvas_' + side_div[j].id.toString(), j)
        }
    }


        /*
        for (let i = 0; i < Bomb_Architecture[1][j].length; i++) {
            var temp_div = document.createElement('div')
            if (i === Bomb_Architecture[1][j][i][4]) {
                temp_div.className = 'module ' + Bomb_Architecture[1][j][i][0].toLowerCase()
            } else {
                temp_div.className = 'module ' + 'None'.toLowerCase()
            }

            if (j === 0 || j === 2) {
                if (Bomb_Architecture[1][j][i][0] !== 'None') {
                    var_Bomb[Bomb_Architecture[1][j][i][0]].push('')
                }


                //LINE
                var first_line_div = document.createElement('div')
                side_div[j].appendChild(first_line_div)
                first_line_div.className = 'first_Line'

                var second_line_div = document.createElement('div')
                side_div[j].appendChild(second_line_div)
                second_line_div.className = 'second_Line'

                if (i < 3) {
                    first_line_div.appendChild(temp_div)
                } else {
                    second_line_div.appendChild(temp_div)
                }

                if (Bomb_Architecture[1][j][i][0] !== 'None') {
                    if (Bomb_Architecture[1][j][i][0].toLowerCase() === 'timer') {
                        temp_div.id = 'Timer'

                        var h1 = document.createElement('h1')
                        h1.id = 'timer_output'
                        temp_div.appendChild(h1)
                    } else {
                        var canvas = document.createElement('canvas')
                        canvas.id = Bomb_Architecture[1][j][i][2]
                        canvas.height = 200
                        canvas.width = 200
                        temp_div.appendChild(canvas)
                    }

                    for (let k = 0; k < Bomb_Architecture[1][j][i][3]['eval'].length; k++) {
                        eval(Bomb_Architecture[1][j][i][3]['eval'][k])
                    }
                }


            }
        }
    }
    */


/*
    for (let j = 0; j < Bomb_Architecture[1].length; j++) {



        if (Bomb_Architecture[1][j][0].toLowerCase() === 'timer') {
            temp_div.id = 'Timer'

            var h1 = document.createElement('h1')
            h1.id = 'timer_output'
            temp_div.appendChild(h1)
        } else {
            var canvas = document.createElement('canvas')
            canvas.id = Bomb_Architecture[1][j][2]
            canvas.height = 200
            canvas.width = 200
            temp_div.appendChild(canvas)
        }
    }
    */

    Game()
}

function Reset_Bomb() {
    document.getElementById('left_arrow').hidden = true
    document.getElementById('right_arrow').hidden = true

    function Reload_Page() {
        window.location = window.location;
    }
    setTimeout(Reload_Page, 6000)
    document.getElementById('btn_Start').disabled = false
    document.getElementsByClassName("button_center").item(0).hidden = false
}

function Game() {
    Sound.Clock.play()
    var_Bomb['Timer'][0].Start()
}
