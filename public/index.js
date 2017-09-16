//////////////////////// Global variables and functions that launch on page load////////////////////////

var sudoku;
var gameID;
var difficulty = function() {return document.getElementById("difficulty").value};
var marksEnabled = false;
var timer;
var completed;

initializeForm();
drawHighscores();
fadeToContent("sudoku");

//////////////////////// Sudoku board construction ////////////////////////

var sudoku = {

    rows: [[], [], [], [], [], [], [], [], []],
    columns: [[], [], [], [], [], [], [], [], []],
    regions: [[[], [], []], [[], [], []], [[], [], []]],
    marks: [],  

}

setValue = (value, x, y, z) => {
    
    if (z == undefined) {
        sudoku.columns[x][y] = value;
        sudoku.rows[y][x] = value;
        sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = value;       
    } else {
        sudoku.marks[x][y][z] = value;
    }

}
    
setAllValues = (rows) => {

    forXAndY(8, (x, y) => {

        setValue(rows[y][x], x, y)

    })
}

regionIndex = [
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8]
];  // an index to keep track of the individual cells within a region.

//////////////////////// menu event handling ////////////////////////

function newGame() {

    document.getElementById("newGame").blur();
    document.getElementById("timer").textContent = "00:00";
    stopTimer();

    getGame(difficulty())         // call the server to get a sudoku board of the chosen difficulty and a unique gameID
    .then((game) => {
        setAllValues(game.board)
        sudoku.marks = [
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
            [['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', ''], ['','', '', '', '', '', '', '', '']],
        ];
        gameID = game.ID;
        initializeForm();
        completed = false;
        fadeToContent("sudoku")
        setTimeout(function() {
            drawSudoku();
            makeBlanks();
        }, 200);
        setTimeout(function() {
            beginTimer();
        }, 400);
        gameHistory = [];
        historyState = 0;
        gameHistory.push(JSON.parse(JSON.stringify(sudoku)));
        enableUndoRedo();
        setTitle("sudoku");
    });

}

function toggleMarks() {

    const marksButton = document.getElementById("toggleMarks");

    if (marksEnabled) {
        
        marksEnabled = false;
        marksButton.style.background = "white";

    } else if (!marksEnabled && document.getElementsByClassName("submitPage")[0].style.zIndex != 3) {
        
        marksEnabled = true;
        marksButton.style.background = "#93E2FF";

    }

}

//////////////////////// board input handling ////////////////////////

function sudokuInput(event) {       //handles all input in the sudoku board

    event.preventDefault();
    const regex = /[1-9]/;
    const key = parseInt(String.fromCharCode(event.keyCode));

    const x = parseInt(event.path[0].id[0]);
    const y = parseInt(event.path[0].id[3]);
    const z = key - 1;

    if (regex.test(key)) {     

        if (!marksEnabled) {        //handles input of "big" numbers

            if (sudoku.rows[y][x] == key) {
                
                setValue('', x, y);
 
            } else {

                setValue(key, x, y)
                eraseMarks();
                checkIfSolved();

            }

            checkForErrors();

        } else if (sudoku.rows[y][x] == '') {                    //handles input of "small" numbers (pencil marks)

            if (sudoku.marks[x][y][z] == key) {

                setValue('', x, y, z);

            } else {

                setValue(key, x, y, z);

            }

        }

        gameHistory = gameHistory.slice(0, historyState + 1); //deletes all redo history
        gameHistory.push(JSON.parse(JSON.stringify(sudoku)));
        historyState++;
        drawSudoku();
        enableUndoRedo();

    }

    function eraseMarks() {

       // erase marks in region
       
        const cellIDsInRegion = [];

        forXAndY(2, (i, j) => {
            cellIDsInRegion.push([Math.floor(x / 3) * 3 + j, Math.floor(y / 3) * 3 + i])
        });

        cellIDsInRegion.forEach(ID => setValue('', ID[0], ID[1], z));

        // erase marks in row, column and cell
        
        for (let i = 0; i <= 8; i++) {

            setValue('', x, i, z);
            setValue('', i, y, z);
            setValue('', x, y, i)

        }

    }

}

document.addEventListener("keydown", (event) => {   //toggles marks enabled/disabled when pressing "space";
    if (event.keyCode == 32) {
        toggleMarks();
    }
})

function checkForErrors() {
    
    forXAndY(8, (x, y) => {
        const value = sudoku.rows[y][x];
        const cell = document.getElementById(`${x}, ${y}`);
        
        if (value !== '') {
            setValue('', x, y);
            if (sudoku.columns[x].indexOf(value) >= 0 ||
                sudoku.rows[y].indexOf(value) >= 0 ||
                sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)].indexOf(value) >= 0) {
                setValue(value, x, y);
                cell.className = "error";
            }
            else if (cell.disabled) {
                cell.className = "clue";
            }
            else {
                cell.className = "blank";
            }
        }
        setValue(value, x, y);
    });
}

function checkIfSolved() {

    function checkForSum45(arr) {
        return arr.reduce((prev, curr) => prev + curr) === 45;
    }

    if(
        sudoku.rows.every(checkForSum45) &&
        sudoku.columns.every(checkForSum45) &&
        sudoku.regions.every(arr => arr.every(checkForSum45)) &&
        !completed
    ) {
        stopTimer();
        setTitle(`Congratulations!`);
        completed = true;
        drawCompletionMessage();
        fadeToContent("submitPage");
    }
}

//////////////////////// history handling ////////////////////////

var gameHistory = [];
let historyState = 0;

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
        document.getElementById("redo").style.color = "black";
    }

    if (historyState > 0) {
        document.getElementById("undo").style.color = "black";
    } else {
        document.getElementById("undo").style.color = "#ACACAC";
    }

}

//////////////////////// highscore page ////////////////////////

function drawHighscores() {

    let highscorelist = document.getElementById("highscoreList");
    let highscoreHeader = document.getElementById("highscoreHeader");
    highscorelist.innerHTML = "";
    highscoreHeader.textContent = "";

    getHighscores()
    .then(highscores => {

        highscoreHeader.textContent = `Top 10 (difficulty: ${difficulty()})`;
        highscores[difficulty()].forEach(highscore => {
            highscorelist.innerHTML += `<li>${highscore.name}: ${highscore.time}</li>`;
        });

    });

}

function toggleHighscores() {

    let highscoresStyle = document.getElementsByClassName("highscores")[0].style;
    
        if(highscoresStyle.visibility == "hidden" || !highscoresStyle.visibility) {
            highscoresStyle.visibility = "visible";
            highscoresStyle.zIndex = 3;
            highscoresStyle.opacity = 1;
            document.getElementById("highscoresButton").style.background = "#93E2FF";
        } else {
            highscoresStyle.opacity = 0;
            setTimeout(() => {
                highscoresStyle.zIndex = 0;
                highscoresStyle.visibility = "hidden";
            }, 1000);
    
            document.getElementById("highscoresButton").style.background = "white";
        }

}

function changeDifficulty() {

    document.getElementById("highscorePage").style.opacity = 0;
    setTimeout(() => {
        drawHighscores();
        document.getElementById("highscorePage").style.opacity = 1;
    }, 200);

}

//////////////////////// submit highscore page ////////////////////////

function viewSubmitPage() {

    let submitPageStyle = document.getElementsByClassName("submitPage")[0].style;

    if(submitPageStyle.visibility == "hidden" || !submitPageStyle.visibility) {
        submitPageStyle.visibility = "visible";
        submitPageStyle.zIndex = 3;
        submitPageStyle.opacity = 1;
    } else {
        submitPageStyle.opacity = 0;
        setTimeout(() => {
            submitPageStyle.zIndex = 0;
            submitPageStyle.visibility = "hidden";
        }, 1000);
    }
}

function drawCompletionMessage() {

    getTime()
    .then(time => {
        document.getElementById("completionMessage").textContent = `You completed the Sudoku in ${time}!`;
    })
}

document.getElementById("submitHighscore").addEventListener("submit", event => {
    event.preventDefault();
    validateAndSubmit();
    fadeToContent("sudoku");
    drawHighscores();
});

//////////////////////// timer ////////////////////////

function timeFormatter(str) {
    return str.length < 2 ? `0${str}` : str;
}

function drawTimer(diff) {
    const m = timeFormatter(`${diff.getMinutes()}`);
    const s = timeFormatter(`${diff.getSeconds()}`);
    elapsedTime = `${m}:${s}`
    document.getElementById("timer").textContent = elapsedTime;
}

function beginTimer() {
    const startTime = new Date();
    timer = setInterval(() => {
        const diff = new Date(new Date() - startTime);
        drawTimer(diff);
    }, 1000)
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
    }
}


//////////////////////// server routes ////////////////////////

function getGame(difficulty) {

    var formData = new FormData();
    formData.append("difficulty", difficulty);
    
    return fetch("http://localhost:3000/getGame", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())

};

function getHighscores() {

    return fetch("http://localhost:3000/highscores")
    .then(response => response.json());

};

function getTime() {

    const formData = new FormData();
    formData.append("gameID", gameID);
    
    return fetch("http://localhost:3000/getTime", {
        method: "POST",
        body: formData
    }).then(response => response.text());

}

function validateAndSubmit() {

    const formData = new FormData();
    formData.append("name", document.getElementById("inputName").value);
    formData.append("gameID", gameID);
    formData.append("board", JSON.stringify(sudoku.rows));

    fetch("http://localhost:3000/validateAndSubmit", {
        method: "POST",
        body: formData
    });
}

//////////////////////// game initialization ////////////////////////

function initializeForm() {
    
    const cells = document.getElementsByName("cell");
    let i = 0;

    forXAndY(8, (x, y) => {
        cells[i].id = `${x}, ${y}`;
        i++;
    });

    cells.forEach(cell => {
        cell.className = "clue";
        cell.maxLength = 1;
        cell.disabled = true;
    });

    forXAndY(8, (x, y) => {
        let cell = document.getElementsByClassName("cellSmall")[x + (y * 9)];
        for (let i = 0; i <= 8; i++) {
            cell.getElementsByClassName("cellSmallColumn")[i].id = `${x}, ${y}, ${i}`;
            document.getElementById(`${x}, ${y}, ${i}`).textContent = '';
        }
    });
}

function makeBlanks() {
    forXAndY(8, (x, y) => {
        if (sudoku.rows[y][x] == '') {
            document.getElementById(`${x}, ${y}`).disabled = false;
            document.getElementById(`${x}, ${y}`).className = "blank";
        }
    })
}

//////////////////////// CSS manipulators ////////////////////////

function fadeToContent (content) {

    let highscoresStyle = document.getElementsByClassName("highscores")[0].style;
    let sudokuStyle = document.getElementsByClassName("sudoku")[0].style;
    let submitStyle = document.getElementsByClassName("submitPage")[0].style;

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

            setTimeout(function() {
                
                highscoresStyle.zIndex = 0;
                sudokuStyle.zIndex = 3;
                submitStyle.zIndex = 0;

            }, 1000);

        } else {

            document.getElementById("whiteOverlay").style.zIndex = 4;
            document.getElementById("whiteOverlay").style.opacity = 1;
            setTimeout(function() {
                document.getElementById("whiteOverlay").style.opacity = 0;
                setTimeout(function() {
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
            
            setTimeout(function() {
                
                highscoresStyle.zIndex = 3;
                sudokuStyle.zIndex = 0;
                submitStyle.zIndex = 2;

            }, 1000);

        } else if (submitStyle.zIndex == 2) {

            submitStyle.zIndex = 3;
            highscoresStyle.zIndex = 2;
            submitStyle.opacity = 1;
            document.getElementById("highscoresButton").style.background = "white";

        } else {

            highscoresStyle.opacity = 0;
            document.getElementById("highscoresButton").style.background = "white";

            setTimeout(function() {
                
                highscoresStyle.zIndex = 0;
                sudokuStyle.zIndex = 3;
                submitStyle.zIndex = 0;

            }, 1000);

        }

    } else if (content == "submitPage") {

        submitStyle.visibility = "visible";

        if (submitStyle.zIndex !== 3) {

            submitStyle.zIndex = 3;
            sudokuStyle.zIndex = 0;
            submitStyle.opacity = 1;

            setTimeout(function() {
                highscoresStyle.zIndex = 2;
                highscoresStyle.opacity = 1;
            }, 1000);
        }

    }
}

//////////////////////// Utility functions ////////////////////////

function forXAndY(length, callback) {       // used to loop through the 8*8 cells in the sudoku board
    for (let y = 0; y <= length; y++) {
        for (let x = 0; x <= length; x++) {
            callback(x, y);
        }
    }
}

function setTitle(str) {
    document.getElementsByTagName("h1")[0].textContent = str;
}

function drawSudoku() {
    forXAndY(8, (x, y) => {
        document.getElementById(`${x}, ${y}`).value = sudoku.rows[y][x];
        for (let z = 0; z <= 8; z++) {
            document.getElementById(`${x}, ${y}, ${z}`).textContent = sudoku.marks[x][y][z];
        } 
    });
}
