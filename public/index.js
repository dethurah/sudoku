let rows, columns, regions, timer, gameID, marksEnabled = false;

initForm();
getHighscores();


document.addEventListener("keydown", (event) => {
    if (event.keyCode == 32) {
        toggleMarks();
    }
})

document.getElementById("newGame").addEventListener("click", () => {
    document.getElementById("newGame").blur();
})

document.getElementById("toggleMarks").addEventListener("click", () => {
    document.getElementById("toggleMarks").blur();
})

document.getElementById("highscoresButton").addEventListener("click", () => {
    document.getElementById("highscoresButton").blur();
})

document.getElementById("difficulty").addEventListener("input", () => {
    document.getElementById("difficulty").blur();
})

// utility functions
function validateInput(event) {
    const regex = /[1-9]/;
    const key = String.fromCharCode(event.keyCode);
    
    if (!regex.test(key)) {
        event.preventDefault();
    } else if (regex.test(key)) {

        if(marksEnabled) {

            let input = String.fromCharCode(event.keyCode);
            let inputID = event.path[0].id + ', ' + (input - 1);

            if (document.getElementById(inputID).textContent == input) {
                document.getElementById(inputID).textContent = '';
            } else if (document.getElementById(event.path[0].id).value == '') {
                document.getElementById(inputID).textContent = input;
            }

            event.preventDefault();
        } else {
            event.preventDefault();
            if(document.getElementById(event.path[0].id).value == key) {
                document.getElementById(event.path[0].id).value = '';
            } else {
                document.getElementById(event.path[0].id).value = key;
                for (let i = 0; i <= 8; i++) {
                    document.getElementById(event.path[0].id + ', ' + i).textContent = '';
                }
            }
            updateSudoku();
        }
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

    forXAndY(8, (x, y) => {
        let cell = document.getElementsByClassName("cellSmall")[x + (y * 9)];
        for (let i = 0; i <= 8; i++) {
            cell.getElementsByClassName("cellSmallColumn")[i].id = `${x}, ${y}, ${i}`;
        }
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
    
    showSudoku();
    stopTimer();
    initForm();
    setTitle("sudoku");
    document.getElementById("timer").textContent = "00:00";

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
        document.getElementById("whiteOverlay").style.zIndex = 3;
        document.getElementById("whiteOverlay").style.opacity = 1;
        setTimeout(() => {
            document.getElementById("whiteOverlay").style.opacity = 0;
            drawSudoku();
            makeBlanks();
            beginTimer();
        }, 200);
        setTimeout(() => {
            document.getElementById("whiteOverlay").style.zIndex = -2;
        }, 400);
    });
}

function toggleMarks() {
    if (marksEnabled) {
        marksEnabled = false;
        document.getElementById("toggleMarks").style.background = "white";
    } else if (!marksEnabled && document.getElementsByClassName("submitPage")[0].style.visibility != "visible") {
        marksEnabled = true;
        document.getElementById("toggleMarks").style.background = "#93E2FF";
    }
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
                setTitle(`Congratulations!`);
                toggleSubmitPage();

                const formData = new FormData();
                formData.append("gameID", gameID);
                fetch("http://localhost:3000/getTime", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.text())
                .then(response => document.getElementById("completionMessage").textContent = response);

            }
        })
        .catch(function() {console.error("Sudoku is completed or doesn't exist")});
    }
}

function getHighscores() {
    
    let list = document.getElementById("highscoreList");
    let top10 = document.getElementById("top10");
    document.getElementById("highscorePage").style.opacity = 0;

    setTimeout(() => {
        document.getElementById("highscorePage").style.opacity = 1;
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
    }, 200);
}

document.getElementById("submitHighscore").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("gameID", gameID);
    fetch("http://localhost:3000/submitHighscore", {
        method: "POST",
        body: formData
    })
        .then(getHighscores())
        .then(showSudoku());
});

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

function toggleSubmitPage() {
    
    let submitStyle = document.getElementsByClassName("submitPage")[0].style;

    if(submitStyle.visibility == "hidden" || !submitStyle.visibility) {
        submitStyle.visibility = "visible";
        submitStyle.zIndex = 3;
        submitStyle.opacity = 1;
    } else {
        submitStyle.opacity = 0;
        setTimeout(() => {
            submitStyle.zIndex = 0;
            submitStyle.visibility = "hidden";
        }, 1000);
    }
}

function showSudoku() {

    let highscoresStyle = document.getElementsByClassName("highscores")[0].style;
    let submitStyle = document.getElementsByClassName("submitPage")[0].style;

    if(highscoresStyle.visibility == "visible" || submitStyle.visibility == "visible") {
        highscoresStyle.opacity = 0;
        submitStyle.opacity = 0;
        document.getElementById("highscoresButton").style.background = "white";
        setTimeout(() => {
            submitStyle.zIndex = 0;
            submitStyle.visibility = "hidden";
            highscoresStyle.zIndex = 0;
            highscoresStyle.visibility = "hidden";
        }, 1000);
    }

}
