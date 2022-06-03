/*Bomb_properties = {
    'time_of_level': 300000,
    'serial_number': 'QA56F4',
    'number_battery': 2,
    'indicator' : {
        'on': ['CAR', 'SND', 'FRK'],
        'off': ['BOB']
    }
}*/
Bomb_properties = {}



class Timer {
    constructor() {
        this.time = Bomb_properties['time_of_level']
        this.Win = false;
        this.mistake = 0
        this.max_mistake = 3
        this.aff_mistake = true
    }

    Update_time() {
        this.time -= 1000
        document.getElementById('timer_output').innerHTML = ms_To_min(this.time)
        Sound.Clock.play()
        if (this.time === 0) {
            BombExplose()
        }
    }

    Update_mistake() {
        this.mistake++
        if (CheckMistake() === true) {
            if (this.Win === false) {
                BombExplose()
            }
            this.Win = true
            return
        }

        this.interval_mistake = setInterval(this.ANIM_mistake.bind(this), 500 / this.mistake)
        clearInterval(this.interval_timer)
        this.interval_timer = setInterval(this.Update_time.bind(this), 1000 - (125 * this.mistake))

        let url = 'img/timer/timer_error_' + this.mistake.toString() + '.png'
        document.getElementById('Timer').style.backgroundImage = "url(" + url + ")"
    }

    ANIM_mistake() {
        if (CheckMistake() === true) {
            if (this.Win === false) {
                BombExplose()
                this.Stop()
            }
            this.Win = true
            return
        }

        if (this.aff_mistake === false) {

            var url = 'img/timer/timer_error_' + '0' + '.png'
            this.aff_mistake = true

        } else if (this.aff_mistake === true) {

            var url = 'img/timer/timer_error_' + this.mistake.toString() + '.png'
            this.aff_mistake = false

        }

        document.getElementById('Timer').style.backgroundImage = "url(" + url + ")"
    }

    Stop() {
        clearInterval(this.interval_timer)
        clearInterval(this.interval_mistake)
    }

    Start() {
        this.interval_timer = setInterval(this.Update_time.bind(this), 1000)
        this.interval_mistake = ''
    }
}

class Fils {
    constructor(canvas_name, random) {
        this.all_line_pose = [
            {
                x_min : 37,
                x_max : 153,
                y_min : 71,
                y_max : 80
            },
            {
                x_min : 37,
                x_max : 153,
                y_min : 89,
                y_max : 98
            },
            {
                x_min : 37,
                x_max : 153,
                y_min : 109,
                y_max : 118
            },
            {
                x_min : 37,
                x_max : 153,
                y_min : 128,
                y_max : 137
            },
            {
                x_min : 37,
                x_max : 153,
                y_min : 146,
                y_max : 155
            },
            {
                x_min : 37,
                x_max : 153,
                y_min : 162,
                y_max : 171
            },
        ]
        this.border_pos = [
            {
                x: 35,
                y: 71
            },
            {
                x: 35,
                y: 89
            },
            {
                x: 35,
                y: 109
            },
            {
                x: 35,
                y: 128
            },
            {
                x: 35,
                y: 146
            },
            {
                x: 35,
                y: 162
            }
        ]
        this.fil_cute = []
        this.fil_spawn = []
        //rect = this.canvas.getBoundingClientRect();
        this.win_index = 0

        this.win_number = 0
        this.last_border = 0

        this.color_fils = ['red', 'white', 'blue', 'black', 'yellow']


        WinCondition++
        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.context = this.canvas.getContext('2d')
        this.rect = this.canvas.getBoundingClientRect();
        if (random === true) {
            this.createFils()
        }
    }

    createFils() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        var randomNumber = getRandom(3, 6);

        var calc_index_fils = []
        for (let i = 0; i < randomNumber; i++) {
            var random_number = getRandom(0, 5)
            while (calc_index_fils.some(elem => elem === random_number) === true) {
                random_number = getRandom(0, 5)
            }
            calc_index_fils.push(random_number)
        }
        calc_index_fils.sort(function(a, b) {
            return a - b;
        });
        for (let i = 0; i < calc_index_fils.length; i++) {
            this.AFF_fil(calc_index_fils[i], this.color_fils[getRandom(0, 4)])
        }
    }



    AFF_fil(index, color) {
        var context = this.canvas.getContext('2d');
        let proccesed_y = Math.floor((this.all_line_pose[index].y_min + this.all_line_pose[index].y_max) / 2 + 1)


        //border
        context.beginPath()
        context.moveTo(this.all_line_pose[index].x_min + 1 - 2, proccesed_y);
        context.lineTo(this.all_line_pose[index].x_max - 1 + 2, proccesed_y);

        context.lineWidth = 9;
        context.strokeStyle = 'grey';

        context.stroke();

        //fill
        context.beginPath()
        context.moveTo(this.all_line_pose[index].x_min + 1, proccesed_y);
        context.lineTo(this.all_line_pose[index].x_max - 1, proccesed_y);

        context.lineWidth = 5;
        context.strokeStyle = color;

        context.stroke();


        this.fil_spawn.push([index, color])
    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: e.clientY - this.rect.y
        }

        for (let j = 0; j < this.all_line_pose.length; j++) {
            //check hitbox
            if ((pos.x >= this.all_line_pose[j].x_min && pos.x <= this.all_line_pose[j].x_max) && (pos.y >= this.all_line_pose[j].y_min && pos.y <= this.all_line_pose[j].y_max)) {
                //check if already cute
                if ((this.fil_cute.some(elem => elem === j)) !== true) {
                    //check if fil spawn
                    if ((this.fil_spawn.some(elem => elem[0] === j)) === true) {

                        this.AFF_cut_wire(j)
                        this.CheckWin(j)

                    }
                }

            }
        }
    }

    processMouseMove(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        if (this.win_number !== 1) {
            for (let j = 0; j < this.all_line_pose.length; j++) {
                //check hitbox
                if ((pos.x >= this.all_line_pose[j].x_min && pos.x <= this.all_line_pose[j].x_max) && (pos.y >= this.all_line_pose[j].y_min && pos.y <= this.all_line_pose[j].y_max)) {
                    //check if already cute
                    if ((this.fil_cute.some(elem => elem === j)) !== true) {
                        //check if fil spawn
                        if ((this.fil_spawn.some(elem => elem[0] === j)) === true) {
                            //aff border
                            if (j === this.last_border) {
                                this.AFF_Border(j)
                                return
                            }

                            this.AFF_Border_Default(true, j)
                            return

                        }
                    }

                } else {
                    if (j >= this.last_border) {
                        this.AFF_Border_Default()
                    }
                }
            }
        } else {
            this.AFF_Border_Default()
        }
    }

    AFF_Border_Default(aff_border, i) {
        var border_default = new Image();
        border_default.src = 'img/fils/fils_border_default.png'
        function draw() {
            this.context.drawImage(border_default, this.border_pos[this.last_border].x, this.border_pos[this.last_border].y)
            if (aff_border === true) {
                this.AFF_Border(i)
            }
        }
        border_default.onload = draw.bind(this)

    }

    AFF_Border(i) {
        var border = new Image();
        border.src = 'img/fils/fils_border.png'
        function draw() {
            this.context.drawImage(border, this.border_pos[i].x, this.border_pos[i].y)
        }
        border.onload = draw.bind(this)

        this.last_border = i
    }

    AFF_cut_wire(index) {

        var context = this.canvas.getContext('2d');
        context.beginPath()

        context.moveTo(Math.floor((this.all_line_pose[index].x_max + this.all_line_pose[index].x_min) / 2), this.all_line_pose[index].y_min);
        context.lineTo(Math.floor((this.all_line_pose[index].x_max + this.all_line_pose[index].x_min) / 2), this.all_line_pose[index].y_max + 5);

        context.lineWidth = Math.random() * (25 - 12) + 12;
        context.strokeStyle = 'white';

        context.stroke();

        this.fil_cute.push(index)

        Sound.Cutting_Wire.play()
    }

    get_first_index_fil(index) {
        var to_return = [0, '']
        for (let i = 0; i < this.fil_spawn.length; i++) {
            if (i === index) {
                to_return[0] = this.fil_spawn[i][0]
                to_return[1] = this.fil_spawn[i][1]
            }
        }
        return to_return
    }

    ProcessWin() {
        var nbm_fil = this.fil_spawn.length
        var fil_type = {
            'red': [0, []],
            'blue': [0, []],
            'white': [0, []],
            'yellow': [0, []],
            'black': [0, []]
        }
        var first_fil = this.get_first_index_fil(0)
        var last_fil = this.get_first_index_fil(this.fil_spawn.length - 1)
        //update fil_type and last_fil and first_fil
        for (let i = 0; i < this.fil_spawn.length; i++) {
            fil_type[this.fil_spawn[i][1]][0]++
            fil_type[this.fil_spawn[i][1]][1].push(this.fil_spawn[i][0])
        }
        var last_serial_number_odd = parseInt(Bomb_properties['serial_number'][Bomb_properties['serial_number'].length - 1]) % 2 === 1 ? true : false
        //index
        function get_last_color_fil(color) {
            return Math.max.apply(null, fil_type[color][1])
        }

        if (nbm_fil === 3) {
            if (fil_type['red'][0] === 0) {
                this.win_index = 1
            } else if (last_fil[1] === 'white') {
                this.win_index = last_fil[0]
            } else if (fil_type['blue'] > 1) {
                this.win_index = get_last_color_fil('blue')
            } else {
                this.win_index = last_fil[0]
            }
        } else if (nbm_fil === 4) {
            if (fil_type['red'][0] > 1 && last_serial_number_odd == true) {
                this.win_index = get_last_color_fil('red')
            } else if (last_fil[1] === 'yellow' && fil_type['red'][0] === 0) {
                this.win_index = first_fil[0]
            } else if (fil_type['blue'][0] === 1) {
                this.win_index = first_fil[0]
            } else if (fil_type['yellow'][0] > 1) {
                this.win_index = last_fil[0]
            } else {
                this.win_index = this.get_first_index_fil(1)[0]
            }
        } else if (nbm_fil === 5) {
            if (last_fil[1] === 'black' && last_serial_number_odd === true) {
                this.win_index = this.get_first_index_fil(3)[0]
            } else if (fil_type['red'][0] === 1 && fil_type['yellow'][1] > 1) {
                this.win_index = first_fil[0]
            } else if (fil_type['black'][0] === 0) {
                this.win_index = this.get_first_index_fil(1)[0]
            } else {
                this.win_index = first_fil[0]
            }
        } else if (nbm_fil === 6) {
            if (fil_type['yellow'][0] === 0 && last_serial_number_odd === true) {
                this.win_index = this.get_first_index_fil(2)
            } else if (fil_type['yellow'][0] === 1 && fil_type['white'][0] > 1) {
                this.win_index = this.get_first_index_fil(3)
            } else if (fil_type['red'][0] === 0) {
                this.win_index = last_fil[0]
            } else {
                this.win_index = this.get_first_index_fil(3)
            }
        }


    }

    AFF_Win() {
        //150 37
        this.win_number++
        AFF_Win_Module(this.canvas_name)
    }

    CheckWin(index) {
        if (this.win_index === index) {
            // WIN
            this.AFF_Win()

        } else {
            //LOSE
            New_Error()
        }
    }

}

class Button {
    constructor(canvas_name, properties, random) {
        this.properties = ''
        this.rectangle_area = {
            x_min: 151,
            x_max: 178,
            y_min: 71,
            y_max: 177,
        }
        this.interval_rectangle = ''
        this.isUp = true
        this.winType = ''


        WinCondition++
        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
        if (random === true) {
            this.CreateRandom()
        } else {
            this.properties = properties
        }



    }

    /*properties = {
        'text': 'Hold',
        'color': 'red',
        'color_rectangle': ['255', '0', '0', 'red'], //230 230 230 white
    }*/

    CreateRandom() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        var R_Text = ["Abort", "Detonate", "Hold"]
        var R_Color = ["yellow", "white", "red"]
        var R_Color_Bande = [["0", "0", "255", "blue"], ["230", "230", "230", "white"], ["255", "255", "0", "yellow"], ["0", "255", "0", "green"], ["255", "0", "0", "red"], ["255", "0", "255", "magenta"], ["0", "255", "255", "cyan"]]

        var R_I_Text = getRandom(0, 2)
        var R_I_Color = getRandom(0, 2)
        var R_I_Color_Bande = getRandom(0, 6)
        this.properties = {
            'text': R_Text[R_I_Text],
            'color': R_Color[R_I_Color],
            'color_rectangle': R_Color_Bande[R_I_Color_Bande]
        }
    }

    Rect_Border_In() {
        //RECT_BORDER_IN
        this.context.beginPath();
        this.context.rect(24, 75, 126 - 24, 172 - 75)
        this.context.lineWidth = 2
        this.context.strokeStyle = 'black'
        this.context.stroke()
    }
    Rect_Border_Out() {
        //RECT_BORDER
        this.context.beginPath();
        this.context.rect(19, 70, 132 - 18, 178 - 69)
        this.context.lineWidth = 2
        this.context.strokeStyle = 'black'
        this.context.stroke()
    }


    AFF_Circle_Up() {

        //CLEAR
        this.context.beginPath();
        this.context.arc(75.5, 124, 49, 0, Math.PI * 2, true);
        this.context.fillStyle='white'
        this.context.fill();
        this.context.closePath();
        //RECT_BORDER_IN
        this.Rect_Border_In()
        //BORDER
        this.context.beginPath();
        this.context.arc(75.5, 117, 48, 0, Math.PI * 2, true);
        this.context.fillStyle='black'
        this.context.fill();
        this.context.closePath();
        //IN
        this.context.beginPath();
        this.context.arc(75.5, 117, 46, 0, Math.PI * 2, true);
        this.context.fillStyle = this.properties['color']
        this.context.fill();
        this.context.closePath();
        //RECT_BORDER
        this.Rect_Border_Out()
        //TEXT
        this.context.font = "bold 20px Impact";
        this.context.fillStyle = this.properties['color'] !== 'white' ? 'white' : 'black'
        this.context.textAlign = "center";
        this.context.fillText(this.properties['text'], 75, 122);
    }

    AFF_Circle_Down() {
        //CLEAR
        this.context.beginPath();
        this.context.arc(75.5, 117, 49, 0, Math.PI * 2, true);
        this.context.fillStyle = 'white'
        this.context.fill();
        this.context.closePath();
        //BORDER
        this.context.beginPath();
        this.context.arc(75.5, 124, 48, 0, Math.PI * 2, true);
        this.context.fillStyle = 'black'
        this.context.fill();
        this.context.closePath();
        //IN
        this.context.beginPath();
        this.context.arc(75.5, 124, 46, 0, Math.PI * 2, true);
        this.context.fillStyle = this.properties['color']
        this.context.fill();
        this.context.closePath();
        //RECT_BORDER
        this.Rect_Border_Out()
        //RECT_BORDER_IN
        this.Rect_Border_In()
        //TEXT
        this.context.font = "bold 20px Impact";
        this.context.fillStyle = this.properties['color'] !== 'white' ? 'white' : 'black'
        this.context.textAlign = "center";
        this.context.fillText(this.properties['text'], 75, 132);
    }

    AFF_rectangle() {
        var number_of_time = 0
        this.interval_rectangle = ''

        function rectangle() {
            number_of_time++

            this.context.fillStyle = "rgba(" + this.properties['color_rectangle'][0] + ", " + this.properties['color_rectangle'][1] + ", " + this.properties['color_rectangle'][2] + ", " + (number_of_time / 10) + ")";
            this.context.fillRect(this.rectangle_area.x_min, this.rectangle_area.y_min, (this.rectangle_area.x_max - this.rectangle_area.x_min), (this.rectangle_area.y_max - this.rectangle_area.y_min))

            if (number_of_time === 10) {
                clearInterval(this.interval_rectangle)
            }
        }

        this.interval_rectangle = setInterval(rectangle.bind(this), 100)


    }

    AFF_Button_Press() {
        this.isUp = false
        this.AFF_rectangle()
        this.AFF_Circle_Down()
        this.CheckWin()
    }

    processMouseDown(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: e.clientY - this.rect.y
        }

        if (Math.pow(pos.x-75,2)+Math.pow(pos.y-118,2) < Math.pow(46,2)) {
            this.AFF_Button_Press()
            //SOUND
            Sound.Button_Click_On.play()
        }

    }

    processMouseUp(e) {
        this.isUp = true
        clearInterval(this.interval_rectangle)
        this.context.fillStyle = "white";
        this.context.fillRect(this.rectangle_area.x_min, this.rectangle_area.y_min, (this.rectangle_area.x_max - this.rectangle_area.x_min), (this.rectangle_area.y_max - this.rectangle_area.y_min))

        //SOUND
        Sound.Button_Click_Up.play()

        this.AFF_Circle_Up()
        if (this.winType === 'KP') {
            this.KeepPush()
        }
        clearTimeout(this.winType)
        this.ProcessWin()
    }

    KeepPush() {
        if (this.properties['color_rectangle'][3] === 'blue') {
            if (ms_To_min(var_Bomb['Timer'][0].time).split('').some(elem => elem === '4') === true) {
                this.AFF_Win()
            } else {
                New_Error()
            }
        } else if (this.properties['color_rectangle'][3] === 'yellow') {
            if (ms_To_min(var_Bomb['Timer'][0].time).split('').some(elem => elem === '5') === true) {
                this.AFF_Win()
            } else {
                New_Error()
            }
        } else {
            if (ms_To_min(var_Bomb['Timer'][0].time).split('').some(elem => elem === '1') === true) {
                this.AFF_Win()
            } else {
                New_Error()
            }
        }
    }
    /* this.winType = setTimeout(isLose, 500)
    setTimeout(checkTimeout, 500 + 10) */

    ProcessWin() {
        if (this.properties['color'] === 'blue' && this.properties['text'] === 'Abort') {
            this.winType = 'KP'
        } else if (Bomb_properties['number_battery'] > 1 && this.properties['text'] === 'Detonate') {
            this.winType = 'T'
        } else if (this.properties['color'] === 'white' && Bomb_properties['indicator']['on'] === 'CAR') {
            this.winType = 'KP'
        } else if (Bomb_properties['number_battery'] > 2 && Bomb_properties['indicator']['on'] === 'FRK') {
            this.winType = 'T'
        } else if (this.properties['color'] === 'yellow') {
            this.winType = 'KP'
        } else if (this.properties['color'] === 'red' && this.properties['text'] === 'Hold') {
            this.winType = 'T'
        } else {
            this.winType = 'KP'
        }
    }

    CheckWin() {
        if (this.winType === 'T') {
            this.winType = setTimeout(isLose.bind(this), 500)
            setTimeout(checkTimeout.bind(this), 500 + 10)
        }

        function isLose() {
            this.winType = 'LOSE'
        }
        function checkTimeout() {
            if (this.winType !== 'LOSE') {
                this.AFF_Win()
            } else {
                New_Error()
            }
        }

    }

    AFF_Win() {
        AFF_Win_Module(this.canvas_name)
    }


}

class Symboles {
    constructor(canvas_name) {
        this.button_area = {
            '0_button': {
                x_min: 24,
                x_max: 79,
                y_min: 64,
                y_max: 116,
            },
            '1_button': {
                x_min: 87,
                x_max: 142,
                y_min: 64,
                y_max: 116,
            },
            '2_button': {
                x_min: 24,
                x_max: 79,
                y_min: 126,
                y_max: 178,
            },
            '3_button': {
                x_min: 87,
                x_max: 142,
                y_min: 126,
                y_max: 178,
            }
        }
        this.border_pos = [
            {
                x: 20,
                y: 60
            },
            {
                x: 83,
                y: 60
            },
            {
                x: 20,
                y: 122
            },
            {
                x: 83,
                y: 122
            }
        ]
        this.symboles_list = [
            ['O_Bar', 'A_T', 'Alpha_Bar', 'N_Curve', 'T_Triangle_M', 'H_Comma', 'ReverseC_Dot'],
            ['ReverseEpsilon_Umlaut', 'O_Bar', 'ReverseC_Dot', 'E_Curve', 'EmptyStar', 'H_Comma', 'UpsideDownQuestionmark'],
            ['Copyright', 'Comma_Head', 'E_Curve', 'I_K_Comma', '3_Comma', 'Alpha_Bar', 'EmptyStar'],
            ['6_Curve', 'Paragraph', 'B_T', 'T_Triangle_M', 'I_K_Comma', 'UpsideDownQuestionmark', 'Head_Circle'],
            ['Candlestick', 'Head_Circle', 'B_T', 'C_Dot', 'Paragraph', '3_Antenna_Curve', 'FullStar'],
            ['6_Curve', 'ReverseEpsilon_Umlaut', 'Egal_Crossed', 'A_E_Bond', 'Candlestick', 'N_Link_Comma', 'Omega']
        ]
        this.symboles_info = [['', false], ['', false], ['', false], ['', false]]
        this.already_check = []

        this.last_border = 0

        WinCondition++
        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
    }

    processSymbole() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        var index = getRandom(0, 5)

        var tab_number = []
        for (let i = 0; i < 4; i++) {
            function FUNC_random() {
                let random = getRandom(0, 6)
                if (tab_number.some(elem => elem === random) === true) {
                    FUNC_random()
                } else {
                    tab_number.push(random)
                }
            }
            FUNC_random()

        }
        for (let i = 0; i < tab_number.length; i++) {
            this.symboles_info[i][0] = tab_number[i]
        }
        console.log('FIN : indeex: ' + index + ' symbole: ' + tab_number)
        for (let i = 0; i < tab_number.length; i++) {
            this.AFF_Symbole(index, tab_number[i], i)
        }

    }

    AFF_Symbole(index, symbole, area_index) {

        var symbole_img = new Image();
        symbole_img.src = 'img/symboles/all/' + this.symboles_list[index][symbole] + '.png';
        function onload_one() {
            this.context.drawImage(symbole_img, this.button_area[area_index.toString() + '_button'].x_min, this.button_area[area_index.toString() + '_button'].y_min)
            var hole_img = new Image();
            hole_img.src = 'img/symboles/Hole.png'
            function onload_two() {
                this.context.drawImage(hole_img, (this.button_area[area_index.toString() + '_button'].x_max - this.button_area[area_index.toString() + '_button'].x_min) / 2 + this.button_area[area_index.toString() + '_button'].x_min - 7, this.button_area[area_index.toString() + '_button'].y_min);
            }
            hole_img.onload = onload_two.bind(this)
        }
        symbole_img.onload = onload_one.bind(this)
    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: e.clientY - this.rect.y
        }
        if (this.symboles_info[0][0] !== '') {
            for (var i = 0; i < 4; i++) {
                if ((pos.x <= this.button_area[i.toString() + '_button'].x_max && pos.x >= this.button_area[i.toString() + '_button'].x_min) && (pos.y <= this.button_area[i.toString() + '_button'].y_max && pos.y >= this.button_area[i.toString() + '_button'].y_min)) {
                    if (this.symboles_info[i][1] === false) {
                        this.symboles_info[i][1] = true
                        var temp_tab = []
                        for (let i = 0; i < this.symboles_info.length; i++) {
                            if (this.symboles_info[i][1] !== true) {
                                temp_tab.push(this.symboles_info[i][0])
                            }
                        }
                        if (temp_tab.length === 0){
                            temp_tab.push(this.symboles_info[i][0] + 1)
                        }
                        if (temp_tab.every(elem => this.symboles_info[i][0] < elem) === true) {
                            this.AFF_Green(i)
                        } else {
                            this.AFF_Red(i)
                            New_Error()
                            this.symboles_info[i][1] = false
                        }
                        this.CheckWin()
                        Sound.Click.play()
                    }
                }
            }
        }
    }

    processMouseMove(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        for (let i = 0; i < this.border_pos.length; i++) {
            if ((pos.x > this.button_area[i.toString() + '_button'].x_min && pos.x < this.button_area[i.toString() + '_button'].x_max) && (pos.y > this.button_area[i.toString() + '_button'].y_min && pos.y < this.button_area[i.toString() + '_button'].y_max)) {
                if (this.symboles_info[i][1] !== true) {
                    //aff border
                    if (i === this.last_border) {
                        this.AFF_Border(i)
                        return
                    }

                    this.AFF_Border_Default(true, i)
                    return
                }
            } else {
                if (i >= this.last_border) {
                    this.AFF_Border_Default()
                }
            }
        }

    }

    AFF_Border_Default(aff_border, i) {
        var border_default = new Image();
        border_default.src = 'img/symboles/symbole_border_default.png'
        function draw() {
            this.context.drawImage(border_default, this.border_pos[this.last_border].x, this.border_pos[this.last_border].y)
            if (aff_border === true) {
                this.AFF_Border(i)
            }
        }
        border_default.onload = draw.bind(this)

    }

    AFF_Border(i) {
        var border = new Image();
        border.src = 'img/symboles/symbole_border.png'
        function draw() {
            this.context.drawImage(border, this.border_pos[i].x, this.border_pos[i].y)
        }
        border.onload = draw.bind(this)

        this.last_border = i
    }

    AFF_Green(index) {
        this.context.beginPath();
        this.context.fillStyle = "green";
        this.context.fillRect(this.button_area[index.toString() + '_button'].x_min + 23, this.button_area[index.toString() + '_button'].y_min + 2, 11, 2);
    }

    AFF_Red(index) {
        this.context.beginPath();
        this.context.fillStyle = "red";
        this.context.fillRect(this.button_area[index.toString() + '_button'].x_min + 23, this.button_area[index.toString() + '_button'].y_min + 2, 11, 2);

        function Reset() {
            this.context.beginPath();
            this.context.fillStyle = "white";
            this.context.fillRect(this.button_area[index.toString() + '_button'].x_min + 23, this.button_area[index.toString() + '_button'].y_min + 2, 11, 2);
        }

        var temp_time = setTimeout(Reset.bind(this), 400)
    }

    CheckWin() {
        if (this.symboles_info.every(elem => elem[1] === true) === true) {
            AFF_Win_Module(this.canvas_name)
        }
    }

}

class Simon {
    constructor(canvas_name) {
        this.losange_path = [new Path2D, new Path2D, new Path2D, new Path2D]
        this.losange_color = ['rgba(0, 0, 255, ', 'rgba(255, 255, 0, ', 'rgba(0, 255, 0, ', 'rgba(255, 0, 0, ']
                            //BLUE                  //YELLOW                //GREEN         //RED
        //losange size 45
        //rotate this.context.rotate(45 * Math.PI / 180);
        this.losange_pos = [
            {
                x: 100,
                y: -30
            },
            {
                x: 147,
                y: -30
            },
            {
                x: 147,
                y: 17
            },
            {
                x: 100,
                y: 17
            },
        ]
        this.sequence = []
        this.etape = 0
        this.index_sequence = -1
        this.intervel_sequence = ''
        this.timeout_press = ''
        this.timeout_Beaut = ''
        this.Win = false

        this.tab_simon_rules = [
            [
                [
                    3, 2, 1, 0
                ],
                [
                    2, 3, 0, 1
                ],
                [
                    3, 0, 1, 2
                ]
            ],
            [
                [
                    1, 3, 2, 0
                ],
                [
                    0, 2, 1, 3
                ],
                [
                    2, 3, 0, 1
                ]
            ]
        ]
        this.tab_win_input = []
        this.tab_input = []

        WinCondition++
        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
    }

    Init() {
        this.AFF_Init()
        this.processWin()
    }

    AFF_Init() {
        this.context.rotate(45 * Math.PI / 180);
        for (let i = 0; i < this.losange_path.length; i++) {
            this.context.fillStyle = this.losange_color[i] + '0.5)'
            this.losange_path[i].rect(this.losange_pos[i].x, this.losange_pos[i].y, 45, 45);
            this.context.fill(this.losange_path[i]);
        }
        //this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    AFF_Idle(index) {
        this.context.clearRect(this.losange_pos[index].x, this.losange_pos[index].y, 45, 45)
        this.context.fillStyle = this.losange_color[index] + '0.5)'
        //this.context.fillStyle = 'rgba(255, 0, 255, 0.5)'
        this.context.fill(this.losange_path[index]);
    }

    AFF_Press(index) {
        this.context.clearRect(this.losange_pos[index].x, this.losange_pos[index].y, 45, 45)
        this.context.fillStyle = this.losange_color[index] + '1)'
        //this.context.fillStyle = 'rgba(255, 0, 255, 1)'
        this.context.fill(this.losange_path[index]);
    }

    processPress(index) {
        this.Win === true
        this.tab_input.push(index)
        clearTimeout(this.intervel_sequence)
        clearTimeout(this.timeout_press)
        this.timeout_press = setTimeout(this.Sequence_Play.bind(this), 1000)
        this.intervel_sequence = setInterval(this.Un_AFF_Sequence.bind(this), 1000)
        this.timeout_Beaut = setTimeout(this.Losange_Beaut.bind(this), 300)
        //this.processInput()

    }

    Losange_Beaut() {
        for (let i = 0; i < this.tab_input.length; i++) {
            this.AFF_Idle(this.tab_input[i])
        }
    }

    Sequence_Play() {
        this.processInput()
        this.tab_input = []
        //this.intervel_sequence = setInterval(this.Un_AFF_Sequence.bind(this), 1000)
    }

    processInput() {
        function Check_Temp(elem, index) {
            return elem === this.tab_win_input[index]
        }
        if (this.tab_input.length - 1 === this.etape) {
            if (this.tab_input.every(Check_Temp.bind(this)) === true) {
                this.tab_input = []
                this.etape++
                if (this.etape === this.sequence.length) {
                    this.AFF_Win()
                }
            } else {
                this.tab_input = []
                New_Error()
            }
        } else {
            New_Error()
        }
    }

    AFF_Win() {
        this.Win = true;
        clearTimeout(this.intervel_sequence)
        clearTimeout(this.timeout_press)
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        AFF_Win_Module(this.canvas_name)
        this.context.rotate(45 * Math.PI / 180);
        clearTimeout(this.intervel_sequence)
    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: e.clientY - this.rect.y
        }
        for (let i = 0; i < this.losange_path.length; i++) {
            if (this.context.isPointInPath(this.losange_path[i], pos.x, pos.y)) {
                this.AFF_Press(i)
                this.processPress(i)
                Sound.Click.play()
            }
        }

    }

    processWin() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        var intSequence = getRandom(3, 5)
        for (let i = 0; i < intSequence; i++) {
            this.sequence.push(getRandom(0, 3))
        }
        this.intervel_sequence = setInterval(this.Un_AFF_Sequence.bind(this), 1000)
        for (let i = 0; i < this.sequence.length; i++) {
            this.tab_win_input.push(this.tab_simon_rules[this.Check_Vowel()][var_Bomb['Timer'][0].mistake][this.sequence[i]])
        }
        console.log(this.tab_win_input)
    }

    update_Tab_Win() {
        this.tab_win_input = []
        for (let i = 0; i < this.sequence.length; i++) {
            this.tab_win_input.push(this.tab_simon_rules[this.Check_Vowel()][var_Bomb['Timer'][0].mistake][this.sequence[i]])
        }
        console.log(this.tab_win_input)
    }

    Check_Vowel() {
        var tab_vowel = ['A', 'E', 'I', 'O', 'U', 'Y']
        var tab_serial = Bomb_properties['serial_number'].split('')
        for (let i = 0; i < tab_vowel.length; i++) {
            if (tab_serial.some(elem => elem === tab_vowel[i]) === true) {
                return 0
            }
        }
        return 1
    }

    Un_AFF_Sequence() {
        if (this.Win === false) {
            if (this.index_sequence !== -1) {
                this.AFF_Idle(this.sequence[this.index_sequence])
            }
            setTimeout(this.AFF_Sequence.bind(this), 300)
            this.index_sequence++
        }
    }


    AFF_Sequence() {
        if (this.index_sequence > this.etape) {
            this.index_sequence = -1
            return
        } else {
            this.AFF_Press(this.sequence[this.index_sequence])
        }
    }


}

class WITF {
    constructor(canvas_name) {
        this.main_text = {
            "YES": 2,
            "FIRST": 1,
            "DISPLAY": 5,
            "OKAY": 1,
            "SAYS": 5,
            "NOTHING": 2,
            "": 4,
            "BLANK": 3,
            "NO": 5,
            "LED": 2,
            "LEAD": 5,
            "READ": 3,
            "RED": 3,
            "REED": 4,
            "LEED": 4,
            "HOLD ON": 5,
            "YOU": 3,
            "YOU ARE": 5,
            "YOUR": 3,
            "YOU'RE": 3,
            "UR": 0,
            "THERE": 5,
            "THEY'RE": 4,
            "THEIR": 3,
            "THEY ARE": 2,
            "SEE": 5,
            "C": 1,
            "CEE": 5,
        }
        this.secondary_text = {
            "READY": ["YES", "OKAY", "WHAT", "MIDDLE", "LEFT", "PRESS", "RIGHT", "BLANK", "READY", "NO", "FIRST", "UHHH", "NOTHING", "WAIT"],
            "FIRST": ["LEFT", "OKAY", "YES", "MIDDLE", "NO", "RIGHT", "NOTHING", "UHHH", "WAIT", "READY", "BLANK", "WHAT", "PRESS", "FIRST"],
            "NO": ["BLANK", "UHHH", "WAIT", "FIRST", "WHAT", "READY", "RIGHT", "YES", "NOTHING", "LEFT", "PRESS", "OKAY", "NO", "MIDDLE"],
            "BLANK": ["WAIT", "RIGHT", "OKAY", "MIDDLE", "BLANK", "PRESS", "READY", "NOTHING", "NO", "WHAT", "LEFT", "UHHH", "YES", "FIRST"],
            "NOTHING": ["UHHH", "RIGHT", "OKAY", "MIDDLE", "YES", "BLANK", "NO", "PRESS", "LEFT", "WHAT", "WAIT", "FIRST", "NOTHING", "READY"],
            "YES": ["OKAY", "RIGHT", "UHHH", "MIDDLE", "FIRST", "WHAT", "PRESS", "READY", "NOTHING", "YES", "LEFT", "BLANK", "NO", "WAIT"],
            "WHAT": ["UHHH", "WHAT", "LEFT", "NOTHING", "READY", "BLANK", "MIDDLE", "NO", "OKAY", "FIRST", "WAIT", "YES", "PRESS", "RIGHT"],
            "UHHH": ["READY", "NOTHING", "LEFT", "WHAT", "OKAY", "YES", "RIGHT", "NO", "PRESS", "BLANK", "UHHH", "MIDDLE", "WAIT", "FIRST"],
            "LEFT": ["RIGHT", "LEFT", "FIRST", "NO", "MIDDLE", "YES", "BLANK", "WHAT", "UHHH", "WAIT", "PRESS", "READY", "OKAY", "NOTHING"],
            "RIGHT": ["YES", "NOTHING", "READY", "PRESS", "NO", "WAIT", "WHAT", "RIGHT", "MIDDLE", "LEFT", "UHHH", "BLANK", "OKAY", "FIRST"],
            "MIDDLE": ["BLANK", "READY", "OKAY", "WHAT", "NOTHING", "PRESS", "NO", "WAIT", "LEFT", "MIDDLE", "RIGHT", "FIRST", "UHHH", "YES"],
            "OKAY": ["MIDDLE", "NO", "FIRST", "YES", "UHHH", "NOTHING", "WAIT", "OKAY", "LEFT", "READY", "BLANK", "PRESS", "WHAT", "RIGHT"],
            "WAIT": ["UHHH", "NO", "BLANK", "OKAY, YES", "LEFT", "FIRST", "PRESS", "WHAT", "WAIT", "NOTHING", "READY", "RIGHT", "MIDDLE"],
            "PRESS": ["RIGHT", "MIDDLE", "YES", "READY", "PRESS", "OKAY", "NOTHING", "UHHH", "BLANK", "LEFT", "FIRST", "WHAT", "NO", "WAIT"],
            "YOU": ["SURE", "YOU ARE", "YOUR", "YOU'RE", "NEXT", "UH HUH", "UR", "HOLD", "WHAT?", "YOU", "UH UH", "LIKE", "DONE", "U"],
            "YOU ARE": [ "YOUR", "NEXT", "LIKE", "UH HUH", "WHAT?", "DONE", "UH UH", "HOLD", "YOU", "U", "YOU'RE", "SURE", "UR", "YOU ARE"],
            "YOUR": ["UH UH", "YOU ARE", "UH HUH", "YOUR", "NEXT", "UR", "SURE", "U", "YOU'RE", "YOU", "WHAT?", "HOLD", "LIKE", "DONE"],
            "YOU'RE": ["YOU", "YOU'RE", "UR", "NEXT", "UH UH", "YOU ARE", "U", "YOUR", "WHAT?", "UH HUH", "SURE", "DONE", "LIKE", "HOLD"],
            "UR": ["DONE", "U", "UR", "UH HUH", "WHAT?", "SURE","YOUR", "HOLD", "YOU'RE", "LIKE", "NEXT", "UH UH", "YOU ARE", "YOU"],
            "U": ["UH HUH", "SURE", "NEXT", "WHAT?", "YOU'RE", "UR", "UH UH", "DONE", "U", "YOU", "LIKE", "HOLD", "YOU ARE", "YOUR"],
            "UH HUH": ["UH HUH", "YOUR", "YOU ARE", "YOU", "DONE", "HOLD", "UH UH", "NEXT", "SURE", "LIKE", "YOU'RE", "UR", "U", "WHAT?"],
            "UH UH": ["UR", "U", "YOU ARE", "YOU'RE", "NEXT", "UH UH", "DONE", "YOU", "UH HUH", "LIKE", "YOUR", "SURE", "HOLD", "WHAT?"],
            "WHAT?": ["YOU", "HOLD", "YOU'RE", "YOUR", "U", "DONE", "UH UH", "LIKE", "YOU ARE", "UH HUH", "UR", "NEXT", "WHAT?", "SURE"],
            "DONE": ["SURE", "UH HUH", "NEXT", "WHAT?", "YOUR", "UR", "YOU'RE", "HOLD", "LIKE", "YOU", "U", "YOU ARE", "UH UH", "DONE"],
            "NEXT": ["WHAT?", "UH HUH", "UH UH", "YOUR", "HOLD", "SURE", "NEXT", "LIKE", "DONE", "YOU ARE", "UR", "YOU'RE", "U", "YOU"],
            "HOLD": ["YOU ARE", "U", "DONE", "UH UH", "YOU", "UR", "SURE", "WHAT?", "YOU'RE", "NEXT", "HOLD", "UH HUH", "YOUR", "LIKE"],
            "SURE": ["YOU ARE", "DONE", "LIKE", "YOU'RE", "YOU", "HOLD", "UH HUH", "UR", "SURE", "U", "WHAT?", "NEXT", "YOUR", "UH UH"],
            "LIKE": ["YOU'RE", "NEXT", "U", "UR", "HOLD", "DONE", "UH UH", "WHAT?", "UH HUH", "YOU", "LIKE", "SURE", "YOU ARE", "YOUR"],
        }

        this.win_slots = [
            {
                x_min: 164,
                x_max: 180,
                y_min: 79,
                y_max: 93
            },
            {
                x_min: 164,
                x_max: 180,
                y_min: 115,
                y_max: 129
            },
            {
                x_min: 164,
                x_max: 180,
                y_min: 151,
                y_max: 165
            },
        ]

        this.secondary_text_slots = [
            {
                x_min: 21,
                x_max: 80,
                y_min: 68,
                y_max: 98,
                x: 51,
                y: 91
            },
            {
                x_min: 89,
                x_max: 148,
                y_min: 68,
                y_max: 98,
                x: 119,
                y: 91
            },
            {
                x_min: 21,
                x_max: 80,
                y_min: 106,
                y_max: 136,
                x: 51,
                y: 129
            },
            {
                x_min: 89,
                x_max: 148,
                y_min: 106,
                y_max: 136,
                x: 119,
                y: 129
            },
            {
                x_min: 21,
                x_max: 80,
                y_min: 144,
                y_max: 174,
                x: 51,
                y: 167
            },
            {
                x_min: 89,
                x_max: 148,
                y_min: 144,
                y_max: 174,
                x: 119,
                y: 167
            }
        ]
        this.border_pos = [
            {
                x: 18,
                y: 65
            },
            {
                x: 86,
                y: 65
            },
            {
                x: 18,
                y: 103
            },
            {
                x: 86,
                y: 103
            },
            {
                x: 18,
                y: 141
            },
            {
                x: 86,
                y: 141
            },
        ]

        this.main_text_slot = {
            x: 70,
            y: 48
        }

        this.win_number = 0

        this.the_main_text = ''
        this.the_secondary_text = []

        this.win_condition = ''

        this.last_border = 0


        WinCondition++
        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
        this.Init()
    }

    Init() {

        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        function chooseMainText() {
            //CHOOSE MAIN TEXT
            var keys_main_text = Object.keys(this.main_text)
            var random_main_text = getRandom(0, keys_main_text.length - 1)
            this.the_main_text = keys_main_text[random_main_text]
        }
        chooseMainText.bind(this)()

        function chooseSecondaryText() {
            //CHOOSE SECONDARY TEXT
            var keys_secondary_text = Object.keys(this.secondary_text)
            var list_random = [];
            //METHODE 1
            /*
            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            console.log(random_keys)
            console.log(f_word)
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                } while (list_random.some(elem => elem === random_number) === true && this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)
            var r_f_word;
            do {
                r_f_word = getRandom(0, 5)
            } while (r_f_word === this.main_text[this.the_main_text])
            random_text.splice(r_f_word, 1, f_word)

            console.log('-----')
            console.log(random_text)
            console.log('-----')
            */
            //METHODE 2
            /*
            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                } while (list_random.some(elem => elem === random_number) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)

            this.the_secondary_text = random_text;
            */
            //METHODE 3

            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                    //50%
                    if (getRandom(0, 1) === 0) {
                        if (this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true) {
                            while (this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true) {
                                random_number = getRandom(0, keys_secondary_text.length - 1)
                            }
                        }
                    }
                } while (list_random.some(elem => elem === random_number) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)

            this.the_secondary_text = random_text;



        }

        chooseSecondaryText.bind(this)()

        this.AFF_Main_Text()

        this.AFF_Secondary_Text()

        this.processWin()



    }

    New_Round() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        //CLEAR THE CANVAS
        this.the_main_text = ''
        this.the_secondary_text = []

        //AFF WIN #TODO

        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        function chooseMainText() {
            //CHOOSE MAIN TEXT
            var keys_main_text = Object.keys(this.main_text)
            var random_main_text = getRandom(0, keys_main_text.length - 1)
            this.the_main_text = keys_main_text[random_main_text]
        }
        chooseMainText.bind(this)()

        function chooseSecondaryText() {
            //CHOOSE SECONDARY TEXT
            var keys_secondary_text = Object.keys(this.secondary_text)
            var list_random = [];
            //METHODE 1
            /*
            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            console.log(random_keys)
            console.log(f_word)
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                } while (list_random.some(elem => elem === random_number) === true && this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)
            var r_f_word;
            do {
                r_f_word = getRandom(0, 5)
            } while (r_f_word === this.main_text[this.the_main_text])
            random_text.splice(r_f_word, 1, f_word)

            console.log('-----')
            console.log(random_text)
            console.log('-----')
            */
            //METHODE 2
            /*
            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                } while (list_random.some(elem => elem === random_number) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)

            this.the_secondary_text = random_text;
            */
            //METHODE 3

            var random_keys = keys_secondary_text[getRandom(0, keys_secondary_text.length - 1)]
            var f_word = this.secondary_text[random_keys][getRandom(0, this.secondary_text[random_keys].length - 1)]
            var random_text = [];
            for (let i = 0; i < 6; i++) {
                var random_number;
                do {
                    random_number = getRandom(0, keys_secondary_text.length - 1)
                    //50%
                    if (getRandom(0, 1) === 0) {
                        if (this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true) {
                            while (this.secondary_text[random_keys].some(elem => elem === keys_secondary_text[random_number]) === true) {
                                random_number = getRandom(0, keys_secondary_text.length - 1)
                            }
                        }
                    }
                } while (list_random.some(elem => elem === random_number) === true)
                list_random.push(random_number)

                random_text.push(keys_secondary_text[random_number])
            }
            random_text.splice(this.main_text[this.the_main_text], 1, random_keys)

            this.the_secondary_text = random_text;



        }

        chooseSecondaryText.bind(this)()

        this.AFF_Main_Text()

        this.AFF_Secondary_Text()

        this.processWin()
    }


    AFF_Main_Text() {
        this.context.beginPath()
        this.context.textAlign = "center"
        this.context.fillStyle = 'white'
        this.context.font = '30px Impact'
        this.context.fillText(this.the_main_text, this.main_text_slot.x, this.main_text_slot.y)
    }

    AFF_Secondary_Text() {
        for (let i = 0; i < 6; i++) {
            this.context.beginPath()
            this.context.textAlign = "center"
            this.context.fillStyle = 'black'
            this.context.font = '17px Impact'
            this.context.fillText(this.the_secondary_text[i], this.secondary_text_slots[i].x, this.secondary_text_slots[i].y)
        }
    }

    processWin() {
        var words_secondary = this.secondary_text[this.the_secondary_text[this.main_text[this.the_main_text]]]
        for (let j = 0; j < words_secondary.length; j++) {
            for (let i = 0; i < this.the_secondary_text.length; i++) {
                if (words_secondary[j] === this.the_secondary_text[i]) {
                    this.win_condition = this.the_secondary_text[i]
                    console.log(this.win_condition)
                    return
                }
            }
        }

    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: e.clientY - this.rect.y
        }
        if (this.win_number !== 3) {
            for (let j = 0; j < this.secondary_text_slots.length; j++) {
                if ((pos.x > this.secondary_text_slots[j].x_min && pos.x < this.secondary_text_slots[j].x_max) && (pos.y > this.secondary_text_slots[j].y_min && pos.y < this.secondary_text_slots[j].y_max)) {
                    Sound.Click.play()
                    //CHECK WIN
                    if (this.the_secondary_text[j] === this.win_condition) {
                        this.Round_Win()
                    } else {
                        this.Round_Lose()
                    }
                }
            }
        }


    }

    processMouseMove(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        if (this.win_number !== 3) {
            for (let i = 0; i < this.secondary_text_slots.length; i++) {
                if ((pos.x > this.secondary_text_slots[i].x_min && pos.x < this.secondary_text_slots[i].x_max) && (pos.y > this.secondary_text_slots[i].y_min && pos.y < this.secondary_text_slots[i].y_max)) {
                    //aff border
                    if (i === this.last_border) {
                        this.AFF_Border(i)
                        return
                    }

                    this.AFF_Border_Default(true, i)
                    return
                } else {
                    if (i >= this.last_border) {
                        this.AFF_Border_Default()
                    }
                }
            }
        } else {
            this.AFF_Border_Default()
        }

    }

    AFF_Border_Default(aff_border, i) {
        var border_default = new Image();
        border_default.src = 'img/witf/witf_border_default.png'
        function draw() {
            this.context.drawImage(border_default, this.border_pos[this.last_border].x, this.border_pos[this.last_border].y)
            if (aff_border === true) {
                this.AFF_Border(i)
            }
        }
        border_default.onload = draw.bind(this)

    }

    AFF_Border(i) {
        var border = new Image();
        border.src = 'img/witf/witf_border.png'
        function draw() {
            this.context.drawImage(border, this.border_pos[i].x, this.border_pos[i].y)
        }
        border.onload = draw.bind(this)

        this.last_border = i
    }

    Round_Win() {
        this.win_number++
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.win_number; i++) {
            var index = 2 - i
            this.context.fillStyle = "green"
            this.context.fillRect(this.win_slots[index].x_min, this.win_slots[index].y_min, this.win_slots[index].x_max - this.win_slots[index].x_min + 1, this.win_slots[index].y_max - this.win_slots[index].y_min + 1)
        }

        if (this.win_number === 3) {
            //FINISHED WIN
            AFF_Win_Module(this.canvas_name)
            return
        }
        setTimeout(this.New_Round.bind(this), 500)
        //SET win_slots

    }

    Round_Lose() {
        New_Error()
        this.win_number = 0
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.win_number; i++) {
            var index = 2 - i
            this.context.fillStyle = "green"
            this.context.fillRect(this.win_slots[index].x_min, this.win_slots[index].y_min, this.win_slots[index].x_max - this.win_slots[index].x_min + 1, this.win_slots[index].y_max - this.win_slots[index].y_min + 1)
        }

        setTimeout(this.New_Round.bind(this), 500)
    }


}

class Memory {
    constructor(canvas_name) {
        WinCondition++

        this.border_pos = [
            {
                x: 19,
                y: 140
            },
            {
                x: 51,
                y: 140
            },
            {
                x: 83,
                y: 140
            },
            {
                x: 115,
                y: 140
            }
        ]
        this.button_pos = [
            {
                x_min: 20,
                y_min: 141,
                x_max: 49,
                y_max: 178,
            },
            {
                x_min: 52,
                y_min: 141,
                x_max: 81,
                y_max: 178,
            },
            {
                x_min: 84,
                y_min: 141,
                x_max: 113,
                y_max: 178,
            },
            {
                x_min: 116,
                y_min: 141,
                x_max: 145,
                y_max: 178,
            }
        ]
        this.main_text_pos = {
            x: 82,
            y: 111
        }
        this.number_pos = [
            {
                x: 35,
                y: 174,
            },
            {
                x: 67,
                y: 174,
            },
            {
                x: 99,
                y: 174,
            },
            {
                x: 131,
                y: 174,
            }
        ]

        this.last_border = 0
        this.number_list = [
            1,
            2,
            3,
            4,
        ]
        this.round_list = [

        ]
        this.main_number = ''
        this.win_condition = [
            {
                '1': 'p/1/0',
                '2': 'p/1/0',
                '3': 'p/2/0',
                '4': 'p/3/0'
            },
            {
                '1': 'c/4/1',
                '2': 'p/s/0',
                '3': 'p/0/1',
                '4': 'p/s/0',
            },
            {
                '1': 'c/s/1',
                '2': 'c/s/0',
                '3': 'p/2/2',
                '4': 'c/4/2',
            },
            {
                '1': 'p/s/0',
                '2': 'p/0/3',
                '3': 'p/s/1',
                '4': 'p/s/1',
            },
            {
                '1': 'c/s/0',
                '2': 'c/s/1',
                '3': 'c/s/3',
                '4': 'c/s/2',
            }
        ]

        this.round_win = 0
        this.round_win_condition = {}

        this.win_slots = [
            {
                x_min: 164,
                y_min: 164,
                x_max: 180,
                y_max: 178,
            },
            {
                x_min: 164,
                y_min: 139,
                x_max: 180,
                y_max: 153,
            },
            {
                x_min: 164,
                y_min: 114,
                x_max: 180,
                y_max: 128,
            },
            {
                x_min: 164,
                y_min: 89,
                x_max: 180,
                y_max: 103,
            },
            {
                x_min: 164,
                y_min: 64,
                x_max: 180,
                y_max: 78,
            }
        ]


        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
        this.New_Round()
    }

    New_Round() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        this.number_list = [1, 2, 3, 4]
        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }
        this.number_list = shuffle(this.number_list)
        this.main_number = getRandom(1, 4)
        this.round_win_condition = {}


        this.processWin()

        this.AFF_Numbers()

    }

    processWin() {
        var condition = this.win_condition[this.round_win][this.main_number].split('/')
        if (condition[0] === 'p') {
            if (condition[1] === 's') {
                this.round_win_condition.p = this.round_list[parseInt(condition[2])].p
            } else {
                this.round_win_condition.p = condition[1]
            }
        } else {
            if (condition[1] === 's') {
                this.round_win_condition.c = this.round_list[parseInt(condition[2])].c
            } else {
                this.round_win_condition.c = condition[1]
            }
        }
    }

    AFF_Numbers() {
        //AFF main text
        this.context.beginPath()
        this.context.textAlign = "center"
        this.context.fillStyle = 'white'
        this.context.font = '45px Impact'
        this.context.fillText(this.main_number.toString(), this.main_text_pos.x, this.main_text_pos.y)

        //AFF number
        for (let i = 0; i < this.number_list.length; i++) {
            this.context.beginPath()
            this.context.textAlign = "center"
            this.context.fillStyle = '#353026'
            this.context.font = '35px Impact'
            this.context.fillText(this.number_list[i], this.number_pos[i].x, this.number_pos[i].y)
        }
    }

    AFF_Border_Default(aff_border, i) {
        var border_default = new Image();
        border_default.src = 'img/memory/memory_border_default.png'
        function draw() {
            this.context.drawImage(border_default, this.border_pos[this.last_border].x, this.border_pos[this.last_border].y)
            if (aff_border === true) {
                this.AFF_Border(i)
            }
        }
        border_default.onload = draw.bind(this)

    }

    AFF_Border(i) {
        var border = new Image();
        border.src = 'img/memory/memory_border.png'
        function draw() {
            this.context.drawImage(border, this.border_pos[i].x, this.border_pos[i].y)
        }
        border.onload = draw.bind(this)

        this.last_border = i
    }

    AFF_WinSlots() {
        for (let i = 0; i < this.round_win; i++) {
            this.context.beginPath()
            this.context.fillStyle = 'green'
            this.context.fillRect(this.win_slots[i].x_min, this.win_slots[i].y_min, this.win_slots[i].x_max - this.win_slots[i].x_min + 1, this.win_slots[i].y_max - this.win_slots[i].y_min + 1)
        }
    }

    Round_Win(i) {
        this.round_win++
        this.round_list.push({
            'p': i,
            'c': this.number_list[i],
        })


        if (this.round_win === 5) {
            //FINAL WIN
            function draw() {
                this.context.drawImage(image, 0, 0)

                this.AFF_WinSlots()

                AFF_Win_Module(this.canvas_name)
            }
            var image = new Image();
            image.src = 'img/memory/memory_default.png'
            image.onload = draw.bind(this)
            return
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);


        setTimeout(this.New_Round.bind(this), 400)

        this.AFF_WinSlots()
    }

    CheckRoundWin(i) {
        if (this.round_win_condition.p !== undefined) {
            if (i === parseInt(this.round_win_condition.p)) {
                this.Round_Win(i)
            } else {
                this.AFF_RoundLose()
            }
        } else {
            var chiffre = this.number_list[i]
            if (chiffre === parseInt(this.round_win_condition.c)) {
                this.Round_Win(i)
            } else {
                this.AFF_RoundLose()
            }
        }
    }

    AFF_RoundLose() {
        New_Error()

        this.round_win = 0
        this.round_win_condition = {}
        this.round_list = []

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        setTimeout(this.New_Round.bind(this), 400)

        this.AFF_WinSlots()
    }


    processMouseMove(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        if (this.round_win !== 5) {
            for (let i = 0; i < this.button_pos.length; i++) {
                if ((pos.x > this.button_pos[i].x_min && pos.x < this.button_pos[i].x_max) && (pos.y > this.button_pos[i].y_min && pos.y < this.button_pos[i].y_max)) {
                    //aff border
                    if (i === this.last_border) {
                        this.AFF_Border(i)
                        return
                    }

                    this.AFF_Border_Default(true, i)
                    return
                } else {
                    if (i >= this.last_border) {
                        this.AFF_Border_Default()
                    }
                }
            }
        } else {
            this.AFF_Border_Default()
        }

    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        if (this.round_win !== 5) {
            for (let i = 0; i < this.button_pos.length; i++) {
                if ((pos.x > this.button_pos[i].x_min && pos.x < this.button_pos[i].x_max) && (pos.y > this.button_pos[i].y_min && pos.y < this.button_pos[i].y_max)) {
                    this.CheckRoundWin(i)
                    Sound.Click.play()
                }
            }
        }
    }
}

class Maze {
    constructor(canvas_name) {
        WinCondition++

        this.list_of_maze = [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 0, -1, 0, -1, 1, -1, 1, 1],
                [1, 4, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 0, -1, 1, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 1],
                [1, 0, -1, 1, -1, 0, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 0, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 1, -1, 0, -1, 1, -1, 0, -1, 0, -1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 4, 0, 0, 1],
                [1, 0, -1, 1, -1, 0, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 0, -1, 1, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 0, 4, 1, 0, 0, 0, 1, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 0, -1, 1, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 0, -1, 0, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 0, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 1, -1, 0, -1, 0, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 4, 1, 0, 1, 4, 1],
                [1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 0, -1, 1, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 0, -1, 0, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 1, -1, 0, 1],
                [1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 1, -1, 0, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, -1, 1, -1, 1, -1, 1, -1, 0, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 1, -1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 4, 0, 0, 1],
                [1, 0, -1, 0, -1, 1, -1, 1, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 0, -1, 1, -1, 1, -1, 1, -1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1],
                [1, 0, -1, 0, -1, 0, -1, 1, -1, 0, -1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, -1, 0, -1, 0, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
                [1, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1],
                [1, 0, 0, 0, 1, 4, 1, 0, 1, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 1, -1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, -1, 1, -1, 1, -1, 0, -1, 0, -1, 0, 1],
                [1, ]
            ]
        ]
        this.arrow_pos = [
            {
                'move': {
                    x: 113,
                    y: 55,
                },
                'line_1': {
                    x: 87,
                    y: 55,
                },
                'line_2': {
                    x: 100,
                    y: 42,
                },
            },
            {
                'move': {
                    x: 167,
                    y: 129,
                },
                'line_1': {
                    x: 167,
                    y: 103,
                },
                'line_2': {
                    x: 180,
                    y: 115,
                },
            },
            {
                'move': {
                    x: 114,
                    y: 175,
                },
                'line_1': {
                    x: 88,
                    y: 175,
                },
                'line_2': {
                    x: 101,
                    y: 188,
                },
            },
            {
                'move': {
                    x: 35,
                    y: 129,
                },
                'line_1': {
                    x: 35,
                    y: 103,
                },
                'line_2': {
                    x: 22,
                    y: 116,
                },
            }
        ]
        this.border_pos = [
            {
                x: 86,
                y: 40,
            },
            {
                x: 102,
                y: -182,
            },
            {
                x: -115,
                y: -190
            },
            {
                x: -130,
                y: 20
            }
        ]
        this.triangle_path = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]

        this.maze = ''
        this.player_pos = {
            x: 0,
            y: 0,
        }
        this.maze_object_pos = {
            'default': {
                x: 41,
                y: 61
            },
            'circle': {
                x: 40,
                y: 59
            }
        }
        this.circle_pos = []

        this.win = false
        this.last_border = 0
        this.last_rotate = 0

        this.canvas_name = canvas_name;
        this.canvas = document.getElementById(canvas_name)
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");

        this.Init()
    }

    Init() {
        this.AFF_Triangle()
        this.ChooseMaze()
        //cherche circle
        this.Find_Circle()

        this.AFF_Maze()


    }

    Find_Circle() {
        var row = 0, index = 0

        for (let j = 1; j < this.maze.length; j += 2) {
            row++
            for (let i = 1; i < this.maze[j].length; i += 2) {
                index++
                if (this.maze[j][i] === 4) {
                    this.circle_pos.push([row, index])
                }
            }

            index = 0
        }
    }

    ChooseMaze() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        function checkIfOdd(num) {
            if ((num % 2) === 0) {
                return false
            } else {
                return true
            }
        }
        //MAZE
        this.maze = this.list_of_maze[getRandom(0, this.list_of_maze.length - 1)]

        //PLAYER
        do {
            var num_x = getRandom(0, 11)
            var num_y = getRandom(0, 11)
        } while (checkIfOdd(num_x) === false || checkIfOdd(num_y) === false || (this.maze[num_y][num_x] === 4))
        this.player_pos.y = num_y
        this.player_pos.x = num_x

        this.maze[this.player_pos.y][this.player_pos.x] = 3

        //EXIT
        var num_exit_x = 0
        var num_exit_y = 0
        do {
            num_exit_x = getRandom(0, 11)
            num_exit_y = getRandom(0, 11)

        } while ((checkIfOdd(num_exit_x) === false || checkIfOdd(num_exit_y) === false) || (num_exit_x === this.player_pos.x || num_exit_y === this.player_pos.y) || (this.maze[num_exit_y][num_exit_x] === 4))


        this.maze[num_exit_y][num_exit_x] = 6
    }

    AFF_Maze() {
        // k = coefficiant en fonction de j et i
        const k = {
            x: 20,
            y: 18
        }

        var numberImgLoad = 0

        function checkIfLoaded() {
            numberImgLoad++
            if (numberImgLoad === list_image.length) {
                processMaze.bind(this)()
            }
        }

        var list_image = [new Image(), new Image(), new Image(), new Image()]
        list_image[0].src = 'img/maze/maze_circle.png'
        list_image[1].src = 'img/maze/maze_exit.png'
        list_image[2].src = 'img/maze/maze_square_white.png'
        list_image[3].src = 'img/maze/maze_square.png'

        for (let k = 0; k < list_image.length; k++) {
            list_image[k].onload = checkIfLoaded.bind(this)
        }
        //load image

        function processMaze() {
            var x, y;
            var row = 0, index = 0

            var circle_AFF = []

            for (let j = 1; j < this.maze.length; j += 2) {
                row++
                for (let i = 1; i < this.maze[j].length; i += 2) {
                    index++
                    if (this.maze[j][i] === 0) { //square
                        x = this.maze_object_pos['default'].x + (k.x * (index - 1))
                        y = this.maze_object_pos['default'].y + (k.y * (row - 1))
                        this.context.drawImage(list_image[3], x, y)
                    } else if (this.maze[j][i] === 3) { // player
                        x = this.maze_object_pos['default'].x + (k.x * (index - 1))
                        y = this.maze_object_pos['default'].y + (k.y * (row - 1))
                        this.context.drawImage(list_image[2], x, y)
                    } else if (this.maze[j][i] === 6) { //exit
                        x = this.maze_object_pos['default'].x + (k.x * (index - 1))
                        y = this.maze_object_pos['default'].y + (k.y * (row - 1))
                        this.context.drawImage(list_image[1], x, y)
                    } else if (this.maze[j][i] === 4) {
                        x = this.maze_object_pos['default'].x + (k.x * (index - 1))
                        y = this.maze_object_pos['default'].y + (k.y * (row - 1))
                        this.context.drawImage(list_image[3], x, y)
                    }
                }
                index = 0
            }

            for (let i = 0; i < this.circle_pos.length; i++) {
                x = this.maze_object_pos['circle'].x + (k.x * (this.circle_pos[i][1] - 1))
                y = this.maze_object_pos['circle'].y + (k.y * (this.circle_pos[i][0] - 1))
                this.context.drawImage(list_image[0], x, y)
            }
        }
    }

    AFF_Triangle() {
        for (let j = 0; j < this.triangle_path.length; j++) {
            this.context.beginPath();
            this.triangle_path[j].moveTo(this.arrow_pos[j]['move'].x, this.arrow_pos[j]['move'].y);
            this.triangle_path[j].lineTo(this.arrow_pos[j]['line_1'].x, this.arrow_pos[j]['line_1'].y);
            this.triangle_path[j].lineTo(this.arrow_pos[j]['line_2'].x, this.arrow_pos[j]['line_2'].y);
            this.triangle_path[j].closePath();
            this.context.fill(this.triangle_path[j]);
        }

    }

    AFF_Border(i) {
        var image = new Image();
        image.src = 'img/maze/triangle_border.png'
        function draw() {
            this.context.rotate((i * 90) * Math.PI / 180)
            this.context.drawImage(image, this.border_pos[i].x, this.border_pos[i].y)
            this.context.rotate(-(i * 90) * Math.PI / 180)
        }
        image.onload = draw.bind(this)

        this.last_border = i
    }

    AFF_Border_Default(aff_border, i) {
        var border_default = new Image();
        border_default.src = 'img/maze/triangle_border_default.png'
        function draw() {
            this.context.rotate((this.last_border * 90) * Math.PI / 180)
            this.context.drawImage(border_default, this.border_pos[this.last_border].x, this.border_pos[this.last_border].y)
            this.context.rotate(-(this.last_border * 90) * Math.PI / 180)
            if (aff_border === true) {
                this.AFF_Border(i)
            }
        }
        border_default.onload = draw.bind(this)

    }

    MovePlayer(i) {
        var tab_move = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        var next_player_pos = this.maze[this.player_pos.y + tab_move[i][0]][this.player_pos.x + tab_move[i][1]] //check up

        if (next_player_pos !== 1) {
            //DO MOVE
            if (this.maze[this.player_pos.y + (tab_move[i][0] * 2)][this.player_pos.x + (tab_move[i][1] * 2)] === 6) {
                this.AFF_Win()

                return
            }

            DoMove.bind(this)()
        } else if (next_player_pos === 1) {
            New_Error()
        }


        function DoMove() {

            this.maze[this.player_pos.y][this.player_pos.x] = this.maze[this.player_pos.y + (tab_move[i][0] * 2)][this.player_pos.x + (tab_move[i][1] * 2)]
            this.maze[this.player_pos.y + (tab_move[i][0] * 2)][this.player_pos.x + (tab_move[i][1] * 2)] = 3

            this.player_pos.y = this.player_pos.y + (tab_move[i][0] * 2)
            this.player_pos.x = this.player_pos.x + (tab_move[i][1] * 2)

            this.AFF_Maze()
        }
    }

    AFF_Win() {
        //REMOVE WHITE_SQUARE AND EXIT
        var img_square = new Image();
        img_square.src = 'img/maze/maze_square.png'
        img_square.onload = replace.bind(this)

        function replace() {
            const k = {
                x: 20,
                y: 18
            }

            var row = 0, index = 0
            var x = 0, y = 0;
            for (let j = 1; j < this.maze.length; j += 2) {
                row++
                for (let i = 1; i < this.maze[j].length; i += 2) {
                    index++
                    if (this.maze[j][i] === 6 || this.maze[j][i] === 3) {
                        x = this.maze_object_pos['default'].x + (k.x * (index - 1))
                        y = this.maze_object_pos['default'].y + (k.y * (row - 1))
                        this.context.drawImage(img_square, x, y)
                    }
                }

                index = 0
            }

            for (let i = 0; i < this.circle_pos.length; i++) {
                var circle_img = new Image();
                circle_img.src = 'img/maze/maze_circle.png'
                circle_img.onload = draw.bind(this)
                x = this.maze_object_pos['circle'].x + (k.x * (this.circle_pos[i][1] - 1))
                y = this.maze_object_pos['circle'].y + (k.y * (this.circle_pos[i][0] - 1))
                function draw() {
                    this.context.drawImage(circle_img, x, y)
                }
            }
        }

        AFF_Win_Module(this.canvas_name)

        this.win = true



    }

    processMouseMove(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }
        if (this.win === false) {
            for (let i = 0; i < this.triangle_path.length; i++) {
                if (this.context.isPointInPath(this.triangle_path[i], pos.x, pos.y)) {
                    if (i === this.last_border) {
                        this.AFF_Border(i)
                        return
                    }

                    this.AFF_Border_Default(true, i)
                    return
                } else {
                    if (i >= this.last_border) {
                        this.AFF_Border_Default()
                    }
                }
            }
        } else {
            this.AFF_Border_Default()
        }
    }

    processClick(e) {
        const pos = {
            x: e.clientX - this.rect.x,
            y: Math.round(e.clientY - this.rect.y)
        }

        if (this.win === false) {
            for (let i = 0; i < this.triangle_path.length; i++) {
                if (this.context.isPointInPath(this.triangle_path[i], pos.x, pos.y)) {
                    this.MovePlayer(i)
                }
            }
        }
    }

}

class Side {
    constructor(canvas_name, index) {
        this.side_pos = [
            {
                x: 90,
                y: -85
            },
            {
                x: 90,
                y: -225
            },
            {
                x: 240,
                y: -85
            },
            {
                x: 240,
                y: -225
            }
        ]
        this.backPlate_pos = {
            'RJ-45': {
                x: 1,
                y: 1,
            },
            'Parallele': {
                x: 1,
                y: 1
            },
            'DVI-D': {
                x: 1,
                y: 38
            },
            'Serie': {
                x: 1,
                y: 38
            },
            'Stereo_RCA': {
                x: 107,
                y: 30
            },
            'PS_2': {
                x: 93,
                y: 2
            }
        }
        this.indic_pos = {
            'text': {
                x: 64,
                y: 48
            },
            'circle': {
                x: 25,
                y: 36
            }
        }
        this.serial_pos = {
            x: 15,
            y: 63
        }

        this.tab_img = []


        this.canvas = document.getElementById(canvas_name)
        this.context = this.canvas.getContext("2d");
        this.index = index;
        this.Init()
    }
    //         img/side/#

    Init() {
        this.tab_img = []
        this.context.rotate(90 * Math.PI / 180);
        for (let j = 0; j < Bomb_Architecture[1][this.index].length; j++) {
            this.tab_img.push([''])
            this.tab_img[j][0] = new Image()
            this.tab_img[j][0].src = 'img/side/' + Bomb_Architecture[1][this.index][j][1] + '/' + Bomb_Architecture[1][this.index][j][2] + '.png'

            function onload_default() {
                this.context.drawImage(this.tab_img[j][0], this.side_pos[Bomb_Architecture[1][this.index][j][0]].x, this.side_pos[Bomb_Architecture[1][this.index][j][0]].y)
                if (Bomb_Architecture[1][this.index][j][1] === 'ports') {
                    this.AffElementBackPlate(j)
                } else if (Bomb_Architecture[1][this.index][j][1] === 'indicator') {
                    this.AffIndicator(j)
                } else if (Bomb_Architecture[1][this.index][j][1] === 'serial') {
                    this.AffSerial(j)
                }
            }

            //console.log(this.context.drawImage(this.tab_img[j][0], this.side_pos[Bomb_Architecture[1][this.index][j][0]].x, this.side_pos[Bomb_Architecture[1][this.index][j][0]].y))
            this.tab_img[j][0].onload = onload_default.bind(this)
        }

        /*
        if (Bomb_Architecture[1][this.index][0][1] === 'back_plate') {
            var img = new Image();
            img.src = 'img/side/ports/back_plate.png'

            function onload_one() {
                this.context.drawImage(img, 90, -85)
                var img2 = new Image();
                img2.src = 'img/side/ports/back_plate.png'

                img2.onload = this.context.drawImage(img2, 90, -225)

                var img3 = new Image();
                img3.src = 'img/side/ports/back_plate.png'

                img3.onload = this.context.drawImage(img3, 240, -85)
            }

            img.onload = onload_one.bind(this)
            /*var img = new Image();
            img.src = 'img/side/ports/back_plate.png';
            function onload_one() {
                //100 -75
                this.context.drawImage(img, 100, -75)
                var img2 = new Image();
                img2.src = 'img/side/ports/PS_2.png'
                img2.onload = onload_two.bind(this)

                function onload_two() {
                    this.context.drawImage(img2, 193, -73)
                }




            }
            img.onload = onload_one.bind(this)
            */
        //}

    }

    AffElementBackPlate(imgIndex) {
        for (let j = 0; j < Bomb_Architecture[1][this.index][imgIndex][3].length; j++) {
            this.tab_img[imgIndex].push('')
            this.tab_img[imgIndex][j + 1] = new Image();

            this.tab_img[imgIndex][j + 1].src = 'img/side/' + 'ports' + '/' + Bomb_Architecture[1][this.index][imgIndex][3][j] + '.png'
            function onload_default() {
                this.context.drawImage(this.tab_img[imgIndex][j + 1], this.side_pos[Bomb_Architecture[1][this.index][imgIndex][0]].x + this.backPlate_pos[Bomb_Architecture[1][this.index][imgIndex][3][j]].x, this.side_pos[Bomb_Architecture[1][this.index][imgIndex][0]].y + this.backPlate_pos[Bomb_Architecture[1][this.index][imgIndex][3][j]].y)
            }

            this.tab_img[imgIndex][j + 1].onload = onload_default.bind(this)
        }
    }

    AffIndicator(indicIndex) {
        //AFF TEXT
        this.context.beginPath()
        this.context.fillStyle = 'white'
        this.context.font = '30px Impact'
        var text = Bomb_Architecture[1][this.index][indicIndex][3][0]
        var coord = {
            x: this.side_pos[Bomb_Architecture[1][this.index][indicIndex][0]].x,
            y: this.side_pos[Bomb_Architecture[1][this.index][indicIndex][0]].y
        }
        this.context.fillText(text, coord.x + this.indic_pos['text'].x, coord.y + this.indic_pos['text'].y)

        //AFF ON
        if (Bomb_Architecture[1][this.index][indicIndex][3][1] === 'on') {
            this.context.beginPath()
            this.context.fillStyle = 'yellow'
            this.context.arc(coord.x + this.indic_pos['circle'].x, coord.y + this.indic_pos['circle'].y, 18, 0, 2 * Math.PI)
            this.context.fill()
        }
    }

    AffSerial(serialIndex) {
        var coord = {
            x: this.side_pos[Bomb_Architecture[1][this.index][serialIndex][0]].x,
            y: this.side_pos[Bomb_Architecture[1][this.index][serialIndex][0]].y
        }
        var text = Bomb_Architecture[1][this.index][serialIndex][3][0]
        this.context.beginPath()
        this.context.fillStyle = 'white'
        this.context.font = '35px Impact'
        this.context.fillText(text, coord.x + this.serial_pos.x, coord.y + this.serial_pos.y)
    }


}
