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

app.post('/getGame', upload.array(), function(req, res){
  let difficulty = req.body.difficulty;
  let boardsClone = JSON.parse(JSON.stringify(boards));
  let board = getBoard(boardsClone[difficulty]);
  let startTime = new Date();

  let gameID = "ID" + ID;
  ID++;
  games[gameID] = {"difficulty": difficulty, "board": board, "startTime": startTime, "time": '', "timeInSeconds": null};
  
  while (games[`ID${ID}`]) {
    ID++
    if (ID >= 5000) {
      ID = 0;
    }
  }

  res.send({"board": board, "ID": gameID});
})

function forXAndY(length, callback) {
  for (let y = 0; y <= length; y++) {
      for (let x = 0; x <= length; x++) {
          callback(x, y);
      }
  }
}

app.post('/endGame', upload.array(), function(req, res) {

  let thisGameID = req.body.gameID;

  delete games[thisGameID];

  res.send("game ended.");
})

app.post('/validateAndSubmit', upload.array(), function(req, res){
  
  let thisGameID = req.body.gameID;
  let thisBoard = JSON.parse(req.body.board);
  let yourName = req.body.name;

  let thisDate = new Date();
  let dateString = `${thisDate.getDate()}/${thisDate.getMonth()}/${thisDate.getFullYear()}`;

  function compare() {
    
    let equal = true;

    console.log(games[thisGameID].board);

    forXAndY(8, (x, y) => {
      if (games[thisGameID].board[x][y] != '' && games[thisGameID].board[x][y] != thisBoard[x][y]) {
        equal = false;
      }
    });
    return equal;
  }

  if (compare()) {

    pushHighscore();
    sortHighscores();
    deleteGame();
    writeHighscoresFile();
    
  }

  function pushHighscore() {
    highscores[games[thisGameID].difficulty].push({
      "name": yourName, "time": games[thisGameID].time, "timeInSeconds": games[thisGameID].timeInSeconds, "dateSubmitted": dateString 
    })
  }

  function sortHighscores() {
    highscores[games[thisGameID].difficulty].sort((a, b) => {return a.timeInSeconds - b.timeInSeconds});
    
     if (highscores[games[thisGameID].difficulty].length > 10) {
       highscores[games[thisGameID].difficulty].length = 10;
     }
  }

  function deleteGame() {
    delete games[thisGameID];
  }

  function writeHighscoresFile() {
    fs.writeFile(highscoresFile, JSON.stringify(highscores, null, 2), function (err) {
      if (err) return console.log(err);
    })
  }

  res.send("submitted!");
});

app.post('/getTime', upload.array(), function(req, res) {
  
  let yourGameID = req.body.gameID;

  let diff = new Date(new Date() - games[yourGameID].startTime);
  diff.setSeconds(diff.getSeconds() - 1);
  
  function timeFormatter(str) {
    return str.length < 2 ? `0${str}` : str;
  }

  let m = timeFormatter(`${diff.getMinutes()}`);
  let s = timeFormatter(`${diff.getSeconds()}`);
  let elapsedTime = `${m}:${s}`

  games[yourGameID].time = elapsedTime;
  games[yourGameID].timeInSeconds = diff.getSeconds();

  //let yourTime = games[yourGameID].time;

  res.send(`${elapsedTime}`)
})

app.listen(process.env.PORT || 5000, function(){
  console.log('Server started on port 3000...')
})
