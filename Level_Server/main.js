var express = require('express');
var app = express();
var serv = require('http').Server(app);
var fs = require('fs')
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

/*
    fs.readFile('levels/level_1.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});
*/
    if (req.query.level !== undefined) {
        var level = parseInt(req.query.level)
        var contents = fs.readFileSync('levels/level_' + level + '.txt', 'utf8')

        res.writeHead(200, {"Content-Type": 'application/json'})
        /*
        var myObj = {
            "level": contents,
        }
        */

        //list_ip = fs.readFileSync("serv_data/list_ip.txt", 'utf8').split('\n')
        res.end(JSON.stringify(contents))
    }
})

app.get('/list_ip', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var contents = fs.readFileSync('serv_data/list_ip.txt', 'utf8')
    res.writeHead(200, {"Content-Type": 'application/json'})
    res.end(JSON.stringify(contents))

})


app.post('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    var text_path = 'serv_data/list_ip.txt'

    if (req.body.ip !== undefined) {
        list_ip = fs.readFileSync(text_path, 'utf8').split('\n')
        data = req.body.ip.split('')
        /*
        list_ip[10] = list_ip[10].split('')
        list_ip[10].splice(list_ip[10].length - 1, 1)
        */
        if (list_ip[list_ip.length - 1] === '') {
            list_ip.pop()
        }
        if (list_ip[0] === '') {
            list_ip.shift()
        }
        var number = 0
        for (let j = 0; j < list_ip.length; j++) {
            var ip_analyze = list_ip[j].split('')
            if (ip_analyze[ip_analyze.length - 1] === '\r') {
                ip_analyze.pop()
            }
            if (ip_analyze[0] === '\r') {
                ip_analyze.shift()
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== ip_analyze[i]) {
                    number++
                    break
                }
            }
            if (number === list_ip.length) {
                ip_are_not_same()
                return
            }
        }

        function ip_are_not_same() {
            console.log(req.body.ip)
            fs.appendFile(text_path, req.body.ip + "\n", (err) => {if (err) console.log(err);})
            return
        }
    }
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('post_receive')
})
//app.use('/',express.static(__dirname + '/'));

var port = process.env.PORT || 8080;

serv.listen(port, function() {
    console.log('[+] Server Started')
});
