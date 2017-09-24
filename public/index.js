//////////////////////// Global variables and functions that launch on page load////////////////////////

var sudoku;
var gameID;
var difficulty = "easy";
var marksEnabled = false;
var timer;
var completed;
var cellInFocus;

drawHighscores();
initializeForm();

window.onunload = function () {
    if (gameID) {
        endGame();
    }
};

function alignContent() {

    function getOffset(x, y, z) {
        return Math.round(document.getElementById("sudoku").offsetWidth) * x + Math.round(document.getElementById("bottomNav").offsetHeight) * y + z + 'px';
    };

    document.getElementById("highscores").style.bottom = getOffset(1, 3, 0);
    document.getElementById("submitPage").style.bottom = getOffset(2, 3, 0);
    document.getElementById("buttonFades").style.bottom = getOffset(0, 1, 0);
}
alignContent();

//////////////////////// Sudoku board construction ////////////////////////

var sudoku = {

    rows: [[], [], [], [], [], [], [], [], []],
    columns: [[], [], [], [], [], [], [], [], []],
    regions: [[[], [], []], [[], [], []], [[], [], []]],
    marks: []

};

setValue = function (value, x, y, z) {

    if (z == undefined) {
        sudoku.columns[x][y] = value;
        sudoku.rows[y][x] = value;
        sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = value;
    } else {
        sudoku.marks[x][y][z] = value;
    }
};

setAllValues = function (rows) {

    forXAndY(8, function (x, y) {

        setValue(rows[y][x], x, y);
    });
};

regionIndex = [[0, 1, 2, 0, 1, 2, 0, 1, 2], [3, 4, 5, 3, 4, 5, 3, 4, 5], [6, 7, 8, 6, 7, 8, 6, 7, 8], [0, 1, 2, 0, 1, 2, 0, 1, 2], [3, 4, 5, 3, 4, 5, 3, 4, 5], [6, 7, 8, 6, 7, 8, 6, 7, 8], [0, 1, 2, 0, 1, 2, 0, 1, 2], [3, 4, 5, 3, 4, 5, 3, 4, 5], [6, 7, 8, 6, 7, 8, 6, 7, 8]]; // an index to keep track of the individual cells within a region.

//////////////////////// menu event handling ////////////////////////

function newGame() {

    //document.getElementById("newGame").blur();
    //document.getElementById("newGame").disabled = true;

    if (gameID) {
        endGame();
    };
    getGame(difficulty) // call the server to get a sudoku board of the chosen difficulty and a unique gameID
    .then(function (game) {
        setAllValues(game.board);
        sudoku.marks = [[['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']], [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']]];
        gameID = game.ID;
        initializeForm();
        gameHistory = [];
        historyState = 0;
        gameHistory.push(JSON.parse(JSON.stringify(sudoku)));
        enableUndoRedo();
        //setTitle("sudoku");
        completed = false;
    }).then(function () {

        //fadeToContent("sudoku")
        setTimeout(function () {
            drawSudoku();
            makeBlanks();
        }, 200);
        setTimeout(function () {
            stopTimer();
            document.getElementById("timer").textContent = "00:00";
            beginTimer();
            //document.getElementById("newGame").disabled = false;
        }, 1000);
    });
}

function toggleMarks() {

    if (marksEnabled) {

        marksEnabled = false;
        document.getElementById("toggleMarksFade").style.opacity = 0;
    } else if (!marksEnabled && document.getElementById("submitPage").style.zIndex != 3) {

        marksEnabled = true;
        document.getElementById("toggleMarksFade").style.opacity = 1;
    }
}

//////////////////////// board input handling ////////////////////////

function sudokuInput(event) {
    //handles all input in the sudoku board

    var regex = /[1-9]/;
    var key = parseInt(String.fromCharCode(event));

    var x = parseInt(cellInFocus.id[0]);
    var y = parseInt(cellInFocus.id[3]);
    var z = key - 1;

    if (!cellInFocus.classList.contains('clue')) {

        if (!marksEnabled && regex.test(key)) {
            //handles input of "big" numbers

            if (sudoku.rows[y][x] == key) {

                setValue('', x, y);
            } else {

                setValue(key, x, y);
                //eraseMarks();
                checkIfSolved();
            }

        } else if (sudoku.rows[y][x] == '' && regex.test(key)) {
            //handles input of "small" numbers (pencil marks)

            if (sudoku.marks[x][y][z] == key) {

                setValue('', x, y, z);

            } else {

                setValue(key, x, y, z);

            }

        } else if (event == '8') {

            setValue('', x, y);

        }

        gameHistory = gameHistory.slice(0, historyState + 1); //deletes all redo history
        gameHistory.push(JSON.parse(JSON.stringify(sudoku)));
        historyState++;
        drawSudoku();
        enableUndoRedo();
        checkForErrors();

    };

    function eraseMarks() {

        // erase marks in region

        var cellIDsInRegion = [];

        forXAndY(2, function (i, j) {
            cellIDsInRegion.push([Math.floor(x / 3) * 3 + j, Math.floor(y / 3) * 3 + i]);
        });

        cellIDsInRegion.forEach(function (ID) {
            setValue('', ID[0], ID[1], z);
        });

        // erase marks in row, column and cell

        for (var i = 0; i <= 8; i++) {

            setValue('', x, i, z);
            setValue('', i, y, z);
            setValue('', x, y, i);
        }
    }
}

document.addEventListener("keydown", function (event) {
    //toggles marks enabled/disabled when pressing "space";

    var regex = /[1-9]/;
    var key = String.fromCharCode(event.keyCode);

    if (event.keyCode == 32) {

        toggleMarks();
    } else if (event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 38) {

        if (!cellInFocus && gameID) {

            focusCell(document.getElementById("0, 0"));
        } else {

            var x = parseInt(cellInFocus.id[0]);
            var y = parseInt(cellInFocus.id[3]);

            if (event.keyCode == 39) {
                focusCell(document.getElementById(((x + 1) > 8 ? 0 : (x + 1)) + ', ' + y));
            } else if (event.keyCode == 40) {
                focusCell(document.getElementById(x + ', ' + ((y + 1) > 8 ? 0 : y + 1)));
            } else if (event.keyCode == 37) {
                focusCell(document.getElementById((x - 1 < 0 ? 8 : x - 1) + ', ' + y));
            } else if (event.keyCode == 38) {
                focusCell(document.getElementById(x + ', ' + ((y - 1) < 0 ? 8 : y - 1)));
            };
        }
    } else if (regex.test(key)) {

        sudokuInput(event.keyCode);
    }
});

function checkForErrors() {

    forXAndY(8, function (x, y) {
        var value = sudoku.rows[y][x];
        var cell = document.getElementById(x + ', ' + y);

        if (value !== '') {
            setValue('', x, y);
            if (sudoku.columns[x].indexOf(value) >= 0 || sudoku.rows[y].indexOf(value) >= 0 || sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)].indexOf(value) >= 0) {
                cell.className += ' error';
                console.log('fejl!');
            } else if (cell.classList.contains('clue')) {
                console.log('test1');
                cell.className = 'clue';
            } else if (cell.classList.contains('blank')) {
                cell.className = 'blank';
                console.log('test2');
            }
        }
        setValue(value, x, y);
    });
}

function checkIfSolved() {

    function checkForSum45(arr) {
        return arr.reduce(function (prev, curr) {
            prev + curr;
        }) === 45;
    }

    if (sudoku.rows.every(checkForSum45) && sudoku.columns.every(checkForSum45) && sudoku.regions.every(function (arr) {
        arr.every(checkForSum45);
    }) && !completed) {
        stopTimer();
        //setTitle(`Congratulations!`);
        completed = true;
        drawCompletionMessage();
        fadeToContent("submitPage");
    }
}

//////////////////////// history handling ////////////////////////

var gameHistory = [];
var historyState = 0;

function undo() {

    if (historyState >= 1) {

        historyState--;
        sudoku = JSON.parse(JSON.stringify(gameHistory[historyState]));
        drawSudoku();
        enableUndoRedo();
    }
}

function redo() {

    if (historyState <= gameHistory.length - 2) {

        historyState++;
        sudoku = JSON.parse(JSON.stringify(gameHistory[historyState]));
        drawSudoku();
        enableUndoRedo();
    }
}

function enableUndoRedo() {

    if (historyState == gameHistory.length - 1) {
        document.getElementById("redo").style.color = "#ACACAC";
    } else {
        document.getElementById("redo").style.color = "white";
    }

    if (historyState > 0) {
        document.getElementById("undo").style.color = "white";
    } else {
        document.getElementById("undo").style.color = "#ACACAC";
    }
}

//////////////////////// highscore page ////////////////////////

function drawHighscores() {

    var highscoreTable = document.getElementById("highscoreTable");
    var highscoreHeader = document.getElementById("highscoreHeader");
    highscoreTable.innerHTML = "<tr><th>place</th><th>name</th><th>time</th><th>date submitted</th></tr>";
    highscoreHeader.textContent = "";

    getHighscores().then(function (highscores) {

        highscoreHeader.textContent = 'top 10 (difficulty: ' + difficulty + ')';
        highscores[difficulty].forEach(function (highscore, i) {
            highscoreTable.innerHTML += '<tr><td>' + (i + 1) + '.</td><td>' + highscore.name + '</td><td>' + highscore.time + '</td><td>' + highscore.dateSubmitted + '</td></tr>';
        });
    });
}

function toggleHighscores() {

    var highscoresStyle = document.getElementById("highscores").style;

    if (highscoresStyle.visibility == "hidden" || !highscoresStyle.visibility) {
        highscoresStyle.visibility = "visible";
        highscoresStyle.zIndex = 3;
        highscoresStyle.opacity = 1;
        document.getElementById("highscoresButton").style.background = "#93E2FF";
    } else {
        highscoresStyle.opacity = 0;
        setTimeout(function () {
            highscoresStyle.zIndex = 0;
            highscoresStyle.visibility = "hidden";
        }, 1000);

        document.getElementById("highscoresButton").style.background = "white";
    }
}

function changeDifficulty() {

    document.getElementById("highscorePage").style.opacity = 0;
    setTimeout(function () {
        drawHighscores();
        document.getElementById("highscorePage").style.opacity = 1;
    }, 200);
}

//////////////////////// submit highscore page ////////////////////////

function viewSubmitPage() {

    var submitPageStyle = document.getElementById("submitPage").style;

    if (submitPageStyle.visibility == "hidden" || !submitPageStyle.visibility) {
        submitPageStyle.visibility = "visible";
        submitPageStyle.zIndex = 3;
        submitPageStyle.opacity = 1;
    } else {
        submitPageStyle.opacity = 0;
        setTimeout(function () {
            submitPageStyle.zIndex = 0;
            submitPageStyle.visibility = "hidden";
        }, 1000);
    }
}

function drawCompletionMessage() {

    getTime().then(function (time) {
        document.getElementById("completionMessage").textContent = 'You completed the Sudoku in ' + time + '!';
    });
}

//////////////////////// timer ////////////////////////

function timeFormatter(str) {
    return str.length < 2 ? '0' + str : str;
}

function drawTimer(diff) {
    var h = diff.getHours() - 1 >= 1 ? diff.getHours() - 1 + ':' : '';
    var m = timeFormatter(diff.getMinutes() + '');
    var s = timeFormatter(diff.getSeconds() + '');
    elapsedTime = h + m + ':' + s;
    document.getElementById("timer").textContent = elapsedTime;
}

function beginTimer() {
    var startTime = new Date();
    timer = setInterval(function () {
        var diff = new Date(new Date() - startTime);
        drawTimer(diff);
        if (diff.getHours() == 59) {
            stopTimer();
            document.getElementById("timer").textContent = 'still playing?';
        }
    }, 1000);
}

function pauseTimer() {}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
    }
}

//////////////////////// server routes ////////////////////////

function getGame(difficulty) {

    var formData = new FormData();
    formData.append("difficulty", difficulty);

    return fetch("./getGame", {
        method: "POST",
        body: formData
    }).then(function (response) {
        return response.json();
    });
};

function getHighscores() {

    return fetch("./highscores").then(function (response) {
        return response.json();
    });
};

function getTime() {

    var formData = new FormData();
    formData.append("gameID", gameID);

    return fetch("./getTime", {
        method: "POST",
        body: formData
    }).then(function (response) {
        return response.text();
    });
}

function validateAndSubmit() {

    var formData = new FormData();
    formData.append("name", document.getElementById("inputName").value);
    formData.append("gameID", gameID);
    formData.append("board", JSON.stringify(sudoku.rows));

    fetch("./validateAndSubmit", {
        method: "POST",
        body: formData
    });
}

function endGame() {

    var formData = new FormData();
    formData.append("gameID", gameID);

    fetch("./endGame", {
        method: "POST",
        body: formData
    });
}

//////////////////////// game initialization ////////////////////////

function initializeForm() {

    var i = 0;
    forXAndY(8, function (x, y) {
        document.getElementsByTagName("td")[i].id = x + ', ' + y;
        document.getElementsByTagName("td")[i].name = 'cell';
        document.getElementsByTagName("td")[i].className = 'clue';
        document.getElementsByTagName("td")[i].addEventListener("click", function(cell) {focusCell(cell.target)});
        i++;
    });
}

function makeBlanks() {
    forXAndY(8, function (x, y) {
        if (sudoku.rows[y][x] == '') {
            //document.getElementById(`${x}, ${y}`).disabled = false;
            document.getElementById(x + ', ' + y).className = "blank";
        }
    });
}

//////////////////////// CSS manipulators ////////////////////////

function focusCell(cell) {
    if (!cellInFocus) {
        cellInFocus = cell;
    };
    document.getElementById(cellInFocus.id).style.boxShadow = "none";
    document.getElementById(cellInFocus.id).style.zIndex = 0;
    cellInFocus = cell;
    document.getElementById(cellInFocus.id).style.boxShadow = "0 0 10px #0086B6";
    document.getElementById(cellInFocus.id).style.zIndex = 1;
}

function fadeToContent(content) {

    var highscoresStyle = document.getElementById("highscores").style;
    var sudokuStyle = document.getElementById("sudoku").style;
    var submitStyle = document.getElementById("submitPage").style;
    document.getElementById("newGame").disabled = true;
    document.getElementById("highscoresButton").disabled = true;
    setTimeout(function () {
        document.getElementById("newGame").disabled = false;
        document.getElementById("highscoresButton").disabled = false;
    }, 500);

    if (content == "sudoku") {

        if (sudokuStyle.zIndex != 3) {

            if (highscoresStyle.zIndex == 3) {

                submitStyle.visibility = "hidden";
            } else if (submitStyle.zIndex == 3) {

                highscoresStyle.visibility = "hidden";
            }

            highscoresStyle.opacity = 0;
            submitStyle.opacity = 0;
            document.getElementById("highscoresButton").style.background = "white";

            setTimeout(function () {

                highscoresStyle.zIndex = 0;
                sudokuStyle.zIndex = 3;
                submitStyle.zIndex = 0;
            }, 500);
        } else {

            document.getElementById("whiteOverlay").style.zIndex = 4;
            document.getElementById("whiteOverlay").style.opacity = 1;
            setTimeout(function () {
                document.getElementById("whiteOverlay").style.opacity = 0;
                setTimeout(function () {
                    document.getElementById("whiteOverlay").style.zIndex = -2;
                }, 200);
            }, 200);
        }
    } else if (content == "highscores") {

        highscoresStyle.visibility = "visible";

        if (sudokuStyle.zIndex == 3) {

            highscoresStyle.zIndex = 3;
            sudokuStyle.zIndex = 0;
            submitStyle.zIndex = 0;

            highscoresStyle.opacity = 1;
            document.getElementById("highscoresButton").style.background = "#93E2FF";
        } else if (submitStyle.zIndex == 3) {

            submitStyle.opacity = 0;
            document.getElementById("highscoresButton").style.background = "#93E2FF";

            setTimeout(function () {

                highscoresStyle.zIndex = 3;
                sudokuStyle.zIndex = 0;
                submitStyle.zIndex = 2;
            }, 500);
        } else if (submitStyle.zIndex == 2) {

            submitStyle.zIndex = 3;
            highscoresStyle.zIndex = 2;
            submitStyle.opacity = 1;
            document.getElementById("highscoresButton").style.background = "white";
        } else {

            highscoresStyle.opacity = 0;
            document.getElementById("highscoresButton").style.background = "white";

            setTimeout(function () {

                highscoresStyle.zIndex = 0;
                sudokuStyle.zIndex = 3;
                submitStyle.zIndex = 0;
            }, 500);
        }
    } else if (content == "submitPage") {

        submitStyle.visibility = "visible";

        if (submitStyle.zIndex !== 3) {

            submitStyle.zIndex = 3;
            sudokuStyle.zIndex = 0;
            submitStyle.opacity = 1;

            setTimeout(function () {
                highscoresStyle.zIndex = 2;
                highscoresStyle.opacity = 1;
            }, 500);
        }
    }
}

//////////////////////// Utility functions ////////////////////////

function forXAndY(length, callback) {
    // used to loop through the 8*8 cells in the sudoku board
    for (var y = 0; y <= length; y++) {
        for (var x = 0; x <= length; x++) {
            callback(x, y);
        }
    }
}

function setTitle(str) {
    document.getElementsByTagName("h1")[0].textContent = str;
}

function drawSudoku() {
    forXAndY(8, function (x, y) {
        document.getElementById(x + ', ' + y).textContent = sudoku.rows[y][x];
        for (var z = 0; z <= 8; z++) {
            //document.getElementById(`${x}, ${y}, ${z}`).textContent = sudoku.marks[x][y][z];
        }
    });
}