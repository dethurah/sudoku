let rows, columns, regions, timer, gameID;

initForm();
getHighscores();

// utility functions
function validateInput(event) {
    const regex = /[1-9]/;
    const key = String.fromCharCode(event.keyCode);
    if (!regex.test(key)) {
        event.preventDefault();
    }
}

function forXAndY(length, callback) {
    for (let y = 0; y <= length; y++) {
        for (let x = 0; x <= length; x++) {
            callback(x, y);
        }
    }
}

function initForm() {
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
}

function getColumns(rows) {

    let columns = [];

    for (let x = 0; x <= 8; x++) {
        columns.push([]);
        for (let y = 0; y <= 8; y++) {
            columns[x].push(rows[y][x]);
        }
    }

    return columns;
}

let regionIndex = [
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8]
];

function getRegions(rows) {

    let array = [
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ]
    ];

    forXAndY(8, (x, y) => {
        array[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = rows[x][y];
    })

    return array;
}

function drawSudoku() {
    forXAndY(8, (x, y) => {
        document.getElementById(`${x}, ${y}`).value = rows[y][x];
    });
}

function makeBlanks() {
    forXAndY(8, (x, y) => {
        if (rows[y][x] === "") {
            document.getElementById(`${x}, ${y}`).disabled = false;
            document.getElementById(`${x}, ${y}`).className = "blank";
        }
    })
}

function newGame() {
    
    stopTimer();
    initForm();
    setTitle("sudoku");
    document.getElementById("timer").textContent = "00:00";
    showSudoku();

    var formData = new FormData();
    formData.append("difficulty", document.getElementById("difficulty").value);
    fetch("http://localhost:3000/getBoard", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        gameID = response[0];
        rows = response[1];
        })
    .then(function() {
        columns = getColumns(rows);
        regions = getRegions(rows);
        drawSudoku();
        makeBlanks();
        beginTimer();
    });
 
}

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

function setTitle(str) {
    document.getElementsByTagName("h1")[0].textContent = str;
}

function inputNumber(num, x, y) {
    columns[x][y] = num;
    rows[y][x] = num;
    regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = num;
}

function eraseNumber(x, y) {
    columns[x][y] = '';
    rows[y][x] = '';
    regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = '';
}


function checkForErrors() {
    forXAndY(8, (x, y) => {
        const currentNum = rows[y][x];
        const currentCell = document.getElementById(`${x}, ${y}`);
        
        if (currentNum !== NaN) {
            eraseNumber(x, y);
            if (columns[x].indexOf(currentNum) >= 0 ||
                rows[y].indexOf(currentNum) >= 0 ||
                regions[Math.floor(x / 3)][Math.floor(y / 3)].indexOf(currentNum) >= 0) {
                inputNumber(currentNum, x, y);
                currentCell.className = "error";
            }
            else if (currentCell.disabled) {
                currentCell.className = "clue";
            }
            else {
                currentCell.className = "blank";
            }
        }
        inputNumber(currentNum, x, y);
    })
}

function isSolved() {
    checkForErrors();
    return rows.every(checkForSolution) &&
        columns.every(checkForSolution) &&
        regions.every(arr => arr.every(checkForSolution))
}

// checks if the sum of a row, column or region is 45
function checkForSolution(arr) {
    return arr.reduce((prev, curr) => prev + curr) === 45;
}

function updateSudoku() {

    forXAndY(8, (x, y) => {
        inputNumber(parseInt(document.getElementById(`${x}, ${y}`).value), x, y);
    });

    checkForErrors();

    if (isSolved()) {

        var formData = new FormData();
        formData.append("gameID", gameID);
        formData.append("board", JSON.stringify(rows));
        fetch("http://localhost:3000/compare", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(response => {
            if(response) {
                stopTimer();
                showSubmitPage();
                setTitle(`Congratulations!`);
            }
        })
        .catch(function() {console.error("Sudoku is completed or doesn't exist")});
    }
}

function toggleSudokuAndHighscores() {
   
    var z = document.getElementsByClassName("highscores")[0];
    var y = document.getElementsByClassName("sudoku")[0];
    var x = document.getElementsByClassName("submitPage")[0];

    x.style.display = 'none';
    if (z.style.display == 'none' || !z.style.display) {
        y.style.display = 'none';
        z.style.display = 'flex';
    } else {
        z.style.display = 'none';
        y.style.display = 'flex';
    }
}

function showSudoku() {
    var z = document.getElementsByClassName("highscores")[0];
    var y = document.getElementsByClassName("sudoku")[0];
    var x = document.getElementsByClassName("submitPage")[0];

    x.style.display = 'none';
    z.style.display = 'none';
    y.style.display = 'flex';
}

function showSubmitPage() {
    var z = document.getElementsByClassName("highscores")[0];
    var y = document.getElementsByClassName("sudoku")[0];
    var x = document.getElementsByClassName("submitPage")[0];

    x.style.display = 'flex';
    z.style.display = 'none';
    y.style.display = 'none';

    const formData = new FormData();
    formData.append("gameID", gameID);
    fetch("http://localhost:3000/getTime", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(response => document.getElementById("completionMessage").textContent = response);
}

function toggleSubmitHighscore() {
    
    var z = document.getElementsByClassName("highscores")[0];
    var y = document.getElementsByClassName("sudoku")[0];
    var x = document.getElementsByClassName("submitPage")[0];

    z.style.display = 'none';
    if (x.style.display == 'none' || !x.style.display) {
        y.style.display = 'none';
        x.style.display = 'flex';
    } else {
        x.style.display = 'none';
        y.style.display = 'flex';
    }

    const formData = new FormData();
    formData.append("gameID", gameID);
    fetch("http://localhost:3000/getTime", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(response => document.getElementById("completionMessage").textContent = response);
}

function getHighscores() {
    
    let list = document.getElementById("highscoreList");
    let top10 = document.getElementById("top10");
    list.innerHTML = "";
    top10.textContent = "";

    fetch(
        "http://localhost:3000/highscores"
    )
    .then(response => response.json())
    .then(highscores => {
        let chosenDifficulty = document.getElementById("difficulty").value;
        top10.textContent = `Top 10 (difficulty: ${chosenDifficulty})`;
        highscores[chosenDifficulty].forEach(highscore => {
            list.innerHTML += `<li>${highscore.name}: ${highscore.time}</li>`;
        });
    });
}

document.getElementById("submitHighscore").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("gameID", gameID);
    fetch("http://localhost:3000/submitHighscore", {
        method: "POST",
        body: formData
    })
        .then(getHighscores());
    showSudoku();
});