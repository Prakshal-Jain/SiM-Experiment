const express = require('express');
const app = express();
var fs = require("fs");

const port = 3000;

const datafile = './calander_users.json'

function getDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/sended', (req, res) => {
    fs.readFile(datafile, function(err, data) {
        const playlist = JSON.parse(data)[getDate()]
        if(playlist != undefined){
            res.send(JSON.stringify(playlist))
        }
        else{
            res.send(JSON.stringify(-1))
        }
    });
});

app.post('/sended', (req, res) => {
    fs.readFile(datafile, function(err, data) {
        var json = JSON.parse(data)
        const date = getDate()
        if(json[date] != undefined){
            json[date] = (json[date]+1)
        }
        else{
            json[date] = 1
        }
        fs.writeFile(datafile, JSON.stringify(json, null, 2), (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
    });
});

app.listen(port, () => console.log(`listening on port localhost:${port}!`));