var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var fs = require('fs');

var boards = require('./boards.js');
var getBoard = require('./shuffler.js')

var app = express();
var upload = multer();

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var highscoresFile = './highscores.json';
var highscores = require(highscoresFile);

app.get('/highscores', function(req, res){
  res.json(highscores);
});

var ID = 0;
var games = {};

app.post('/getBoard', upload.array(), function(req, res){
  let difficulty = req.body.difficulty;
  let boardsClone = JSON.parse(JSON.stringify(boards));
  let board = getBoard(boardsClone[difficulty]);
  let startTime = new Date();

  let gameID = "ID" + ID;
  games[gameID] = {"difficulty": difficulty, "board": board, "startTime": startTime, "time": '', "timeAsDate": null};
  
  if (ID >= 1000) {
    ID = 0;
  } else {
    ID++;
  }

  res.send([gameID, board]);
})

function forXAndY(length, callback) {
  for (let y = 0; y <= length; y++) {
      for (let x = 0; x <= length; x++) {
          callback(x, y);
      }
  }
}

app.post('/compare', upload.array(), function(req, res){
  
  let thisGameID = req.body.gameID;
  let thisBoard = JSON.parse(req.body.board);

  function compare() {
    
    let equal = true;

    forXAndY(8, (x, y) => {
      if (games[thisGameID].board[x][y] != '' && games[thisGameID].board[x][y] != thisBoard[x][y]) {
        equal = false;
      }
    });
    return equal;
  }

  let result = compare();

  if (result && games[thisGameID].time == '') {
    let diff = new Date(new Date() - games[thisGameID].startTime);

    function timeFormatter(str) {
      return str.length < 2 ? `0${str}` : str;
    }

    let m = timeFormatter(`${diff.getMinutes()}`);
    let s = timeFormatter(`${diff.getSeconds()}`);
    let elapsedTime = `${m}:${s}`

    games[thisGameID].time = elapsedTime;
    games[thisGameID].timeAsDate = diff.getSeconds();
  }

  res.send(result);
})

app.post('/getTime', upload.array(), function(req, res) {
  let yourGameID = req.body.gameID;
  let yourTime = games[yourGameID].time;
  res.send(`You completed the sudoku in ${yourTime}!`)
})

app.post('/submitHighscore', upload.array(), function(req, res){

  var yourName = req.body.name;
  var yourGameID = req.body.gameID;

  highscores[games[yourGameID].difficulty].push({
    "name": yourName, "time": games[yourGameID].time, "timeAsDate": games[yourGameID].timeAsDate
  })

  highscores[games[yourGameID].difficulty].sort((a, b) => {return a.timeAsDate - b.timeAsDate});
 
  if (highscores[games[yourGameID].difficulty].length > 10) {
    highscores[games[yourGameID].difficulty].length = 10;
  }

  delete games[yourGameID];

  fs.writeFile(highscoresFile, JSON.stringify(highscores, null, 2), function (err) {
    if (err) return console.log(err);
  })
});

app.listen(3000, function(){
  console.log('Server started on port 3000...')
})