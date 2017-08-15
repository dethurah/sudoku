class Sudoku {      // defines a pre-solved sudoku;
    constructor() {
        this.columns =
           [[3, 4, 6, 8, 2, 9, 1, 5, 7], 
            [9, 8, 5, 7, 1, 6, 4, 3, 2], 
            [1, 7, 2, 5, 3, 4, 9, 8, 6], 
            [2, 3, 7, 4, 9, 5, 6, 1, 8], 
            [8, 5, 1, 3, 6, 2, 7, 4, 9], 
            [6, 9, 4, 1, 7, 8, 3, 2, 5], 
            [5, 1, 8, 6, 4, 7, 2, 9, 3], 
            [7, 2, 3, 9, 8, 1, 5, 6, 4], 
            [4, 6, 9, 2, 5, 3, 8, 7, 1]];

        this.rows =
            [[3, 9, 1, 2, 8, 6, 5, 7, 4],
            [4, 8, 7, 3, 5, 9, 1, 2, 6], 
            [6, 5, 2, 7, 1, 4, 8, 3, 9], 
            [8, 7, 5, 4, 3, 1, 6, 9, 2], 
            [2, 1, 3, 9, 6, 7, 4, 8, 5], 
            [9, 6, 4, 5, 2, 8, 7, 1, 3], 
            [1, 4, 9, 6, 7, 3, 2, 5, 8], 
            [5, 3, 8, 1, 4, 2, 9, 6, 7], 
            [7, 2, 6, 8, 9, 5, 3, 4, 1]];
            
        this.regions =
            [[[3, 9, 1, 4, 8, 7, 6, 5, 2], 
            [8, 7, 5, 2, 1, 3, 9, 6, 4], 
            [1, 4, 9, 5, 3, 8, 7, 2, 6]], 
            [[2, 8, 6, 3, 5, 9, 7, 1, 4], 
            [4, 3, 1, 9, 6, 7, 5, 2, 8], 
            [6, 7, 3, 1, 4, 2, 8, 9, 5]], 
            [[5, 7, 4, 1, 2, 6, 8, 3, 9], 
            [6, 9, 2, 4, 8, 5, 7, 1, 3], 
            [2, 5, 8, 9, 6, 7, 3, 4, 1]]];

        this.columnOptions = [[], [], [], [], [], [], [], [], []];

        this.rowOptions = [[], [], [], [], [], [], [], [], []];

        this.regionOptions = 
        [[[], [], []], 
        [[], [], []], 
        [[], [], []]];
    }
}

var sudoku, startTime, endTime, elapsedTime;

initForm();
fadeIn();

let regionIndex =
   [[0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8], 
    [0, 1, 2, 0, 1, 2, 0, 1, 2], 
    [3, 4, 5, 3, 4, 5, 3, 4, 5], 
    [6, 7, 8, 6, 7, 8, 6, 7, 8]];

function newGame() {  //starts a new game
    sudoku = new Sudoku;
    endTime = null;
    initForm();
    shuffleSudoku();
    updateOptions();
    eraseNumbers();
    displaySudoku();
    beginTime();
}

function beginTime() {  //starts the timer
    startTime = new Date().getTime();
    let time = setInterval(function() {
        let now = new Date().getTime();
        let diff = Math.round((now - startTime) / 1000); 
        let m = diff >= 60 ? (diff >= 600 ? Math.floor(diff / 60) + ":" : "0" + Math.floor(diff / 60) + ":") : "00:";
        let s = diff % 60 >= 10 ? diff % 60 : "0" + diff % 60;
        elapsedTime = m + s
        document.getElementsByTagName("p")[0].textContent = "time: " + elapsedTime;
        if (endTime) {
            clearInterval(time);
        }
    }, 1000)
}

function initForm() {   //initializes the sudoku's form element
    let i = 0;
    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            document.getElementsByName("cell")[i].id = `${x}, ${y}`;
            i++;
        }
    }
    document.getElementsByName("cell").forEach(cell => {
        cell.className = "clue";
        cell.maxLength = 1;
        cell.disabled = true;
        });
}
    
function inputNum(num, x, y) {   //inputs a number into the sudoku data.
    sudoku.columns[x][y] = num;
    sudoku.rows[y][x] = num;
    sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = num;
}

function eraseNum(x, y) {      //erases a number from the sudoku data.
    sudoku.columns[x][y] = '';
    sudoku.rows[y][x] = '';
    sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = '';
}

function shuffleSudoku() {      //shuffles the pre-solved sudoku into a new, random sudoku.
            
    function sortRandom() {
        return Math.floor(Math.random() * 3);
    }

    let rowRegions =   //gets three groups of rows: The top three, middle three and bottom three.
    [[sudoku.rows[0],
    sudoku.rows[1],
    sudoku.rows[2]],
    [sudoku.rows[3],
    sudoku.rows[4],
    sudoku.rows[5]],
    [sudoku.rows[6],
    sudoku.rows[7],
    sudoku.rows[8]]];

    rowRegions.sort(sortRandom);  //shuffles the three groups of rows.
    rowRegions.forEach(row => {row.sort(sortRandom)});  //shuffles the rows within each group.

    //updates the row data
    for (let y = 0; y <= 8; y++) {
        sudoku.rows[y] = rowRegions[Math.floor(y / 3)][y % 3];
    }

    for (let i = 0; i <= 8; i++) {
        for (let j = 0; j <= 8; j++) {
            sudoku.columns[j][i] = sudoku.rows[i][j];
        }
    }

    let rowColumns =  //does the same as above for the columns
    [[sudoku.columns[0],
    sudoku.columns[1],
    sudoku.columns[2]],
    [sudoku.columns[3],
    sudoku.columns[4],
    sudoku.columns[5]],
    [sudoku.columns[6],
    sudoku.columns[7],
    sudoku.columns[8]]];

    rowColumns.sort(sortRandom);
    rowColumns.forEach(column => {column.sort(sortRandom)});

    for (let x = 0; x <= 8; x++) {
        sudoku.columns[x] = rowColumns[Math.floor(x / 3)][x % 3];
    }

    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            sudoku.rows[y][x] = sudoku.columns[x][y];
            sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = sudoku.rows[y][x];
        }
    }
}

function getOptions(x, y) {  //gets all options of numbers, that can be inputted in a specific cell.
            
    let options = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //start with all options, and erase them if a match is found in the same row, column or region.
    let currentNum = sudoku.columns[x][y];
    eraseNum(x, y);

    //check in column
    for (let i = 0; i <= 8; i++) {
        if (sudoku.columns[x][i] && options.indexOf(sudoku.columns[x][i]) >= 0) {
            options.splice(options.indexOf(sudoku.columns[x][i]), 1);
        }
    }

    //check in row
    for (let i = 0; i <= 8; i++) {
        if (sudoku.rows[y][i] && options.indexOf(sudoku.rows[y][i]) >= 0) {
            options.splice(options.indexOf(sudoku.rows[y][i]), 1);
        }
    }

    //check in region
    for (let i = 0; i <= 8; i++) {
        if (sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][i] && options.indexOf(sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][i]) >= 0) {
            options.splice(options.indexOf(sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][i]), 1);
        }
    }

    inputNum(currentNum, x, y);
    return options;
}

function updateOptions() {
    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            sudoku.columnOptions[x][y] = getOptions(x, y);
            sudoku.rowOptions[y][x] = getOptions(x, y);
            sudoku.regionOptions[Math.floor(x / 3)][Math.floor(y / 3)][regionIndex[y][x]] = getOptions(x, y);
        }
    }
}

function completion() {
            
    let cells = [];
    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            if (sudoku.rowOptions[y][x].length == 1 && sudoku.rows[y][x]) {
                cells.push([x, y]);
            }
        }
    }
    return cells;            
}

function elimination() {
    cells = [];
    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            if (sudoku.rows[y][x]) {
                let currentNum = sudoku.rows[y][x];
                eraseNum(x, y);
                updateOptions();
                for (let i = 0; i <= sudoku.rowOptions[y][x].length - 1; i++) {
                    let rowCount = 0;
                    let columnCount = 0;
                    let regionCount = 0;
                    for (let j = 0; j <= 8; j++) {
                        if (!sudoku.rows[y][j] && sudoku.rowOptions[y][j].indexOf(sudoku.rowOptions[y][x][i]) >= 0) {
                            rowCount++;
                        }
                    }
                    for (let j = 0; j <= 8; j++) {
                        if (!sudoku.columns[x][j] && sudoku.columnOptions[x][j].indexOf(sudoku.rowOptions[y][x][i]) >= 0) {
                            columnCount++;
                        }
                    }
                    for (let j = 0; j <= 8; j++) {
                        if (!sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)][j] && sudoku.regionOptions[Math.floor(x / 3)][Math.floor(y / 3)][j].indexOf(sudoku.rowOptions[y][x][i]) >= 0) {
                            regionCount++;
                        }
                    }
                    if (rowCount == 1 || columnCount == 1 || regionCount == 1) {
                        if (cells.indexOf([x, y] < 0)) {
                            cells.push([x, y]); 
                        }
                    }
                }
            inputNum(currentNum, x, y);
            }
        }
    }
    return cells;
}

function eraseBy(method) { //randomly erases a cell, either by elimination og completion
            
    function randomCell(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    let chosenCell = randomCell(method);
    if (chosenCell) {
        eraseNum(chosenCell[0], chosenCell[1]);
        document.getElementById(`${chosenCell[0]}, ${chosenCell[1]}`).disabled = false;
        document.getElementById(`${chosenCell[0]}, ${chosenCell[1]}`).className = "blank";
        updateOptions();
        return true;
    } else {
        return false;
    }
}
        
function eraseNumbers() {  //erases cells, until no more can be erased
    let keepRemoving = true;
    let cellsErased = 0;
    while (keepRemoving) {
        keepRemoving = eraseBy(completion());
        cellsErased++;
    }
    keepRemoving = true;
    while (keepRemoving) {
        keepRemoving = eraseBy(elimination());
        cellsErased++;
    }
    console.log(cellsErased);
}

function checkForErrors() { //checks if you have made an error, and if so changes the text color of the errors to red.

    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {

            let currentNum = sudoku.rows[y][x];
            
            if (currentNum !== NaN) {
                eraseNum(x, y);
            if (
                sudoku.columns[x].indexOf(currentNum) >= 0 ||
                sudoku.rows[y].indexOf(currentNum) >= 0 ||
                sudoku.regions[Math.floor(x / 3)][Math.floor(y / 3)].indexOf(currentNum) >= 0
                ) {
                    inputNum(currentNum, x, y);
                    document.getElementById(`${x}, ${y}`).className = "error";
                } else if (document.getElementById(`${x}, ${y}`).disabled == false) {
                    document.getElementById(`${x}, ${y}`).className = "blank";
                } else if (document.getElementById(`${x}, ${y}`).disabled == true) {
                    document.getElementById(`${x}, ${y}`).className = "clue";
                }
            }
            inputNum(currentNum, x, y);
        }
    }
}

function displaySudoku() {  //displays the sudoku data.
    for (let x = 0; x <= 8; x++) {
        for (let y = 0; y <= 8; y++) {
            document.getElementById(`${x}, ${y}`).value = sudoku.columns[x][y];
        }
    }
}

function updateData() {     //updates the Data with input and then checks if an error is made, or if the sudoku is completed.
    for (let y = 0; y <= 8; y++) {
        for (let x = 0; x <= 8; x++) {
            inputNum(parseInt(document.getElementById(`${x}, ${y}`).value), x, y);
        }
    }
    checkForErrors();
    checkIfSolved();
    updateOptions();
}

function checkIfSolved() {  //checks whether the sudoku is completed.
    if (sudoku.rows.every(checkForSolution) &&
        sudoku.columns.every(checkForSolution) &&
        sudoku.regions.every(arr => {return arr.every(checkForSolution)})) {

        endTime = elapsedTime;
        alert("Congratulations! You finished the sudoku in " + elapsedTime);
    }
}

function checkForSolution(arr) {  //checks if a row, column or region contains the numbers 1-9
    for (let i = 1; i <= 9; i++) {
        if (arr.indexOf(i) < 0) {
            return false;
        }
    }
    return true;
}

function fadeIn() {
    let x = 0;
    let fade = setInterval(function() {
        document.body.style.opacity = `${x}`;
        x += 0.01;
        if (x >= 8) {
            clearInterval(fade);
        }
    }, 25)
}
