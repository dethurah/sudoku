let rows, columns, regions, timer;

initForm();

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

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

    return array;
}

function chooseBoard(difficulty) {

    boardsClone = JSON.parse(JSON.stringify(boards));
    let board = shuffle(boardsClone[difficulty])[0];
    
    return board;
}

function assignNumbers(board) {

    let variables = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let integers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(integers);

    let assignment = {
        x: ''
    };

    variables.forEach((variable, i) => {
        assignment[variable] = integers[i];
    });

    forXAndY(8, (x, y) => {
        board[x][y] = assignment[board[x][y]];
    });
    
    return board;
}

function shuffleBoard(board) {

    //let board = array;

    // shuffles three groups of rows: The top three, middle three and bottom three
    let rowRegions = shuffle([
        shuffle([board[0], board[1], board[2]]),
        shuffle([board[3], board[4], board[5]]),
        shuffle([board[6], board[7], board[8]])
    ]);

    board[0] = rowRegions[0][0];
    board[1] = rowRegions[0][1];
    board[2] = rowRegions[0][2];
    board[3] = rowRegions[1][0];
    board[4] = rowRegions[1][1];
    board[5] = rowRegions[1][2];
    board[6] = rowRegions[2][0];
    board[7] = rowRegions[2][1];
    board[8] = rowRegions[2][2];

    let columns = getColumns(board);

    let rowColumns = shuffle([
        shuffle([columns[0], columns[1], columns[2]]),
        shuffle([columns[3], columns[4], columns[5]]),
        shuffle([columns[6], columns[7], columns[8]])
    ]);

    columns[0] = rowColumns[0][0];
    columns[1] = rowColumns[0][1];
    columns[2] = rowColumns[0][2];
    columns[3] = rowColumns[1][0];
    columns[4] = rowColumns[1][1];
    columns[5] = rowColumns[1][2];
    columns[6] = rowColumns[2][0];
    columns[7] = rowColumns[2][1];
    columns[8] = rowColumns[2][2];

    if (Math.random() < 0.5) {
        forXAndY(8, (x, y) => {
            board[y][x] = columns[x][y];
        });
    } else {
        board = columns;
    }

    return board;
}

function drawSudoku() {
    forXAndY(8, (x, y) => {
        document.getElementById(`${x}, ${y}`).value = rows[x][y];
    });
}

function makeBlanks() {
    forXAndY(8, (x, y) => {
        if (rows[x][y] === "") {
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
    rows = chooseBoard(document.getElementById("difficulty").value);
    assignNumbers(rows);
    shuffleBoard(rows);
    columns = getColumns(rows);
    regions = getRegions(rows);
    drawSudoku();
    makeBlanks();
    beginTimer();
}

function timeFormatter(str) {
    return str.length < 2 ? `0${str}` : str;
}

function drawTimer(diff) {
    const m = timeFormatter(`${diff.getMinutes()}`);
    const s = timeFormatter(`${diff.getSeconds()}`);
    this.elapsedTime = `${m}:${s}`
    document.getElementById("timer").textContent = this.elapsedTime;
}

function beginTimer() {
    const startTime = new Date();
    this.timer = setInterval(() => {
        const diff = new Date(new Date() - startTime);
        this.drawTimer(diff);
    }, 1000)
}

function stopTimer() {
    if (this.timer) {
        clearInterval(this.timer);
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

    if (this.isSolved()) {
        this.stopTimer();
        setTitle(`Congratulations!`);
    }
}

//Database of boards
const boards = {
    easy: [
        [
            ['e', 'b', 'x', 'x', 'x', 'a', 'x', 'i', 'x'],
            ['x', 'x', 'f', 'g', 'x', 'b', 'a', 'x', 'h'],
            ['d', 'g', 'x', 'x', 'c', 'x', 'e', 'b', 'x'],
            ['a', 'd', 'x', 'x', 'h', 'x', 'c', 'x', 'x'],
            ['i', 'x', 'c', 'f', 'x', 'x', 'x', 'x', 'x'],
            ['b', 'x', 'x', 'a', 'x', 'c', 'x', 'x', 'x'],
            ['h', 'a', 'i', 'b', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'e', 'x', 'c', 'a', 'd', 'i', 'x', 'x'],
            ['x', 'c', 'd', 'x', 'x', 'f', 'x', 'e', 'x'],
        ],
        [
            ['e', 'b', 'x', 'x', 'x', 'a', 'x', 'i', 'x'],
            ['x', 'x', 'f', 'g', 'x', 'b', 'a', 'x', 'h'],
            ['d', 'g', 'x', 'x', 'c', 'x', 'e', 'b', 'x'],
            ['a', 'd', 'x', 'x', 'h', 'x', 'c', 'x', 'x'],
            ['i', 'x', 'c', 'f', 'x', 'x', 'x', 'x', 'x'],
            ['b', 'x', 'x', 'a', 'x', 'c', 'x', 'x', 'x'],
            ['h', 'a', 'i', 'b', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'e', 'x', 'c', 'a', 'd', 'i', 'x', 'x'],
            ['x', 'c', 'd', 'x', 'x', 'f', 'x', 'e', 'x'],
        ]
    ],
    medium: [
        [
            ['f', 'x', 'x', 'd', 'c', 'a', 'i', 'x', 'g'],
            ['e', 'x', 'x', 'f', 'x', 'i', 'a', 'b', 'x'],
            ['x', 'x', 'd', 'x', 'x', 'x', 'x', 'x', 'x'],
            ['g', 'x', 'x', 'x', 'x', 'x', 'h', 'x', 'x'],
            ['c', 'x', 'a', 'x' ,'e', 'h', 'g', 'x', 'x'],
            ['h', 'x', 'x', 'x', 'd', 'x', 'x', 'a', 'e'],
            ['i', 'x', 'f', 'g', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'c', 'i'],
            ['x', 'x', 'x', 'i', 'x', 'e', 'f', 'x', 'b']
        ],
        [
            ['b', 'x', 'd', 'x', 'i', 'f', 'x', 'c', 'x'],
            ['a', 'x', 'x', 'x', 'x', 'x', 'b', 'd', 'f'],
            ['x', 'x', 'x', 'x', 'x', 'x', 'a', 'x', 'x'],
            ['g', 'x', 'x', 'f', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'f', 'x', 'x', 'x', 'i', 'g', 'x'],
            ['i', 'x', 'x', 'd', 'g', 'b', 'x', 'x', 'c'],
            ['x', 'c', 'x', 'x', 'd', 'a', 'x', 'x', 'g'],
            ['x', 'b', 'x', 'g', 'x', 'x', 'x', 'e', 'x'],
            ['f', 'g', 'x', 'x', 'h', 'e', 'x', 'a', 'x'],
        ]
    ],
    hard: [
        [
            ['c', 'x', 'x', 'x', 'x', 'x', 'x', 'i', 'x'],
            ['x', 'd', 'e', 'x', 'i', 'x', 'x', 'h', 'x'],
            ['g', 'x', 'x', 'h', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'b', 'x', 'x', 'x', 'g', 'x', 'x'],
            ['x', 'g', 'x', 'x', 'd', 'x', 'x', 'x', 'x'],
            ['h', 'x', 'x', 'g', 'x', 'x', 'c', 'x', 'x'],
            ['x', 'i', 'x', 'f', 'x', 'e', 'x', 'x', 'x'],
            ['x', 'x', 'x', 'x', 'x', 'd', 'x', 'x', 'x'],
            ['b', 'e', 'f', 'i', 'h', 'x', 'd', 'c', 'x']
        ],
        [
            ['h', 'x', 'x', 'x', 'x', 'x', 'f', 'x', 'x'],
            ['g', 'b', 'f', 'i', 'x', 'x', 'a', 'e', 'x'],
            ['i', 'x', 'a', 'x', 'x', 'x', 'h', 'b', 'g'],
            ['a', 'x', 'x', 'x', 'b', 'x', 'x', 'x', 'f'],
            ['x', 'x', 'x', 'x', 'c', 'x', 'x', 'x', 'x'],
            ['e', 'x', 'b', 'f', 'x', 'a', 'g', 'x', 'x'],
            ['x', 'x', 'x', 'e', 'x', 'x', 'x', 'a', 'x'],
            ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'x', 'b', 'a', 'h', 'i', 'x', 'x'],
        ]
    ],
    expert: [
        [
            ['d', 'x', 'x', 'x', 'x', 'x', 'g', 'x', 'x'],
            ['x', 'a', 'x', 'x', 'x', 'x', 'x', 'x', 'h'],
            ['x', 'x', 'x', 'x', 'h', 'b', 'x', 'c', 'a'],
            ['x', 'f', 'x', 'x', 'x', 'x', 'x', 'a', 'x'],
            ['x', 'x', 'c', 'd', 'x', 'g', 'x', 'x', 'x'],
            ['x', 'x', 'x', 'a', 'x', 'x', 'f', 'x', 'x'],
            ['x', 'i', 'x', 'b', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'd', 'x', 'g', 'x', 'x', 'x', 'h', 'x'],
            ['x', 'x', 'b', 'x', 'x', 'x', 'c', 'g', 'f']
        ],
        [
            ['x', 'x', 'c', 'a', 'x', 'x', 'd', 'x', 'x'],
            ['x', 'e', 'x', 'x', 'c', 'x', 'x', 'x', 'x'],
            ['h', 'x', 'x', 'x', 'x', 'x', 'x', 'c', 'a'],
            ['i', 'a', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'd', 'h'],
            ['f', 'x', 'x', 'g', 'a', 'x', 'x', 'x', 'x'],
            ['x', 'x', 'd', 'x', 'x', 'g', 'x', 'h', 'x'],
            ['x', 'x', 'x', 'x', 'x', 'x', 'f', 'x', 'g'],
            ['x', 'g', 'x', 'f', 'x', 'e', 'x', 'x', 'x']
        ]
    ]
};
