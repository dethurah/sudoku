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

function sortRandom() {
    return Math.floor(Math.random() * 3);
}

function getRandomCell(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function timeFormatter(str) {
    return str.length < 2 ? `0${str}` : str;
}

function setTitle(str) {
    document.getElementsByTagName("h1")[0].textContent = str;
}

// defines a sudoku puzzle
class Sudoku {
    constructor() {
        this.timer = null;
        this.elapsedTime = "";

        this.regions = [
            [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ]
        ];

        // an index to be used when dealing with regions
        this.regionIndex = [
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
    }

    // initializes the sudoku
    initBoard() {
        this.columns = [
            [3, 4, 6, 8, 2, 9, 1, 5, 7], 
            [9, 8, 5, 7, 1, 6, 4, 3, 2], 
            [1, 7, 2, 5, 3, 4, 9, 8, 6], 
            [2, 3, 7, 4, 9, 5, 6, 1, 8], 
            [8, 5, 1, 3, 6, 2, 7, 4, 9], 
            [6, 9, 4, 1, 7, 8, 3, 2, 5], 
            [5, 1, 8, 6, 4, 7, 2, 9, 3], 
            [7, 2, 3, 9, 8, 1, 5, 6, 4], 
            [4, 6, 9, 2, 5, 3, 8, 7, 1]
        ];

        this.rows = [
            [3, 9, 1, 2, 8, 6, 5, 7, 4],
            [4, 8, 7, 3, 5, 9, 1, 2, 6], 
            [6, 5, 2, 7, 1, 4, 8, 3, 9], 
            [8, 7, 5, 4, 3, 1, 6, 9, 2], 
            [2, 1, 3, 9, 6, 7, 4, 8, 5], 
            [9, 6, 4, 5, 2, 8, 7, 1, 3], 
            [1, 4, 9, 6, 7, 3, 2, 5, 8], 
            [5, 3, 8, 1, 4, 2, 9, 6, 7], 
            [7, 2, 6, 8, 9, 5, 3, 4, 1]
        ];

        this.columnOptions = [[], [], [], [], [], [], [], [], []];
        this.rowOptions = [[], [], [], [], [], [], [], [], []];
        this.regionOptions = [[[], [], []], [[], [], []], [[], [], []]];

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

    newGame() {
        this.stopTimer();
        setTitle("sudoko");
        document.getElementById("timer").textContent = "00:00";
        this.initBoard();
        this.shuffleBoard();
        this.updateOptions();
        this.removeNumbers();
        this.drawSudoku();
        this.beginTimer();
    }

    // shuffles the pre-solved sudoku into a new, random sudoku
    shuffleBoard() {
        // gets three groups of rows: The top three, middle three and bottom three
        let rowRegions = [
            [this.rows[0], this.rows[1], this.rows[2]],
            [this.rows[3], this.rows[4], this.rows[5]],
            [this.rows[6], this.rows[7], this.rows[8]]
        ];
    
        // shuffles the three groups of rows
        rowRegions.sort(sortRandom);
        // shuffles the rows within each group
        rowRegions.forEach(row => row.sort(sortRandom));
    
        // updates the row data
        this.rows[0] = rowRegions[0][0];
        this.rows[1] = rowRegions[0][1];
        this.rows[2] = rowRegions[0][2];
        this.rows[3] = rowRegions[1][0];
        this.rows[4] = rowRegions[1][1];
        this.rows[5] = rowRegions[1][2];
        this.rows[6] = rowRegions[2][0];
        this.rows[7] = rowRegions[2][1];
        this.rows[8] = rowRegions[2][2];
    
        forXAndY(8, (i, j) => {
            this.columns[j][i] = this.rows[i][j];
        });
    
        // does the same as above for the columns
        let rowColumns = [
            [this.columns[0], this.columns[1], this.columns[2]],
            [this.columns[3], this.columns[4], this.columns[5]],
            [this.columns[6], this.columns[7], this.columns[8]]
        ];
    
        rowColumns.sort(sortRandom);
        rowColumns.forEach(column => column.sort(sortRandom));
    
        this.columns[0] = rowColumns[0][0];
        this.columns[1] = rowColumns[0][1];
        this.columns[2] = rowColumns[0][2];
        this.columns[3] = rowColumns[1][0];
        this.columns[4] = rowColumns[1][1];
        this.columns[5] = rowColumns[1][2];
        this.columns[6] = rowColumns[2][0];
        this.columns[7] = rowColumns[2][1];
        this.columns[8] = rowColumns[2][2];
    
        forXAndY(8, (x, y) => {
            this.rows[y][x] = this.columns[x][y];
            this.regions[Math.floor(x / 3)][Math.floor(y / 3)][this.regionIndex[y][x]] = this.rows[y][x];
        });
    }

    updateOptions() {
        forXAndY(8, (x, y) => {
            this.columnOptions[x][y] = this.getOptions(x, y);
            this.rowOptions[y][x] = this.getOptions(x, y);
            this.regionOptions[Math.floor(x / 3)][Math.floor(y / 3)][this.regionIndex[y][x]] = this.getOptions(x, y);
        });
    }

    // erases cells with one options, until no more exist
    removeNumbers() {
        let keepRemoving = true;
        let cellsErased = 0;
        while (keepRemoving) {
            keepRemoving = this.eraseBy(this.completion());
            cellsErased++;
        }
        keepRemoving = true;
        while (keepRemoving) {
            keepRemoving = this.eraseBy(this.elimination());
            cellsErased++;
        }
    }

    // randomly erases a cell, that only has one option
    eraseBy(method) {
        let chosenCell = getRandomCell(method);
        if (chosenCell) {
            this.eraseNumber(chosenCell[0], chosenCell[1]);
            const cell = document.getElementById(`${chosenCell[0]}, ${chosenCell[1]}`)
            cell.disabled = false;
            cell.className = "blank";
            this.updateOptions();
            return true;
        } else {
            return false;
        }
    }

    completion() {
        let cells = [];
        forXAndY(8, (x, y) => {
            if (this.rowOptions[y][x].length == 1 && this.rows[y][x]) {
                cells.push([x, y]);
            }
        });
        return cells;
    }

    elimination() {
        let cells = [];
        forXAndY(8, (x, y) => {
            if (this.rows[y][x]) {
                let currentNum = this.rows[y][x];
                this.eraseNumber(x, y);
                this.updateOptions();
                for (let i = 0; i <= this.rowOptions[y][x].length - 1; i++) {
                    let rowCount = 0;
                    let columnCount = 0;
                    let regionCount = 0;
                    for (let j = 0; j <= 8; j++) {
                        if (!this.rows[y][j] && this.rowOptions[y][j].indexOf(this.rowOptions[y][x][i]) >= 0) {
                            rowCount++;
                        }
                        if (!this.columns[x][j] && this.columnOptions[x][j].indexOf(this.rowOptions[y][x][i]) >= 0) {
                            columnCount++;
                        }
                        if (!this.regions[Math.floor(x / 3)][Math.floor(y / 3)][j] &&
                            this.regionOptions[Math.floor(x / 3)][Math.floor(y / 3)][j].indexOf(this.rowOptions[y][x][i]) >= 0) {
                            regionCount++;
                        }
                    }
                    if (rowCount == 1 || columnCount == 1 || regionCount == 1) {
                        if (cells.indexOf([x, y] < 0)) {
                            cells.push([x, y]); 
                        }
                    }
                }
            this.inputNumber(currentNum, x, y);
            }
        });
        return cells;
    }

    // erases a number from the sudoku data
    eraseNumber(x, y) {
        this.columns[x][y] = '';
        this.rows[y][x] = '';
        this.regions[Math.floor(x / 3)][Math.floor(y / 3)][this.regionIndex[y][x]] = '';
    }

    // gets all options of numbers, that can be inputted in a specific cell
    getOptions(x, y) {
        // start with all options, and remove them if a match is found in the same row, column or region.
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const currentNum = this.columns[x][y];
        this.eraseNumber(x, y);

        for (let i = 0; i <= 8; i++) {
            // check in column
            if (this.columns[x][i] && options.indexOf(this.columns[x][i]) >= 0) {
                options.splice(options.indexOf(this.columns[x][i]), 1);
            }
            // check in row
            if (this.rows[y][i] && options.indexOf(this.rows[y][i]) >= 0) {
                options.splice(options.indexOf(this.rows[y][i]), 1);
            }
            // check in region
            if (this.regions[Math.floor(x / 3)][Math.floor(y / 3)][i] && options.indexOf(this.regions[Math.floor(x / 3)][Math.floor(y / 3)][i]) >= 0) {
                options.splice(options.indexOf(this.regions[Math.floor(x / 3)][Math.floor(y / 3)][i]), 1);
            }
        }

        this.inputNumber(currentNum, x, y);
        return options;
    }

    // inputs a number into the sudoku data
    inputNumber(num, x, y) {
        this.columns[x][y] = num;
        this.rows[y][x] = num;
        this.regions[Math.floor(x / 3)][Math.floor(y / 3)][this.regionIndex[y][x]] = num;
    }

    // displays the sudoku data
    drawSudoku() {
        forXAndY(8, (x, y) => {
            document.getElementById(`${x}, ${y}`).value = this.columns[x][y];
        });
    }

    // updates the timer in the view
    drawTimer(diff) {
        const m = timeFormatter(`${diff.getMinutes()}`);
        const s = timeFormatter(`${diff.getSeconds()}`);
        this.elapsedTime = `${m}:${s}`
        document.getElementById("timer").textContent = this.elapsedTime;
    }

    // starts the timer
    beginTimer() {
        const startTime = new Date();
        this.timer = setInterval(() => {
            const diff = new Date(new Date() - startTime);
            this.drawTimer(diff);
        }, 1000)
    }

    // stops the timer
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    // checks if you have made an error,
    // and if so changes the text color of the errors to red
    checkForErrors() {
        forXAndY(8, (x, y) => {
            const currentNum = this.rows[y][x];
            const currentCell = document.getElementById(`${x}, ${y}`);
            
            if (currentNum !== NaN) {
                this.eraseNumber(x, y);
                if (this.columns[x].indexOf(currentNum) >= 0 ||
                    this.rows[y].indexOf(currentNum) >= 0 ||
                    this.regions[Math.floor(x / 3)][Math.floor(y / 3)].indexOf(currentNum) >= 0) {
                    this.inputNumber(currentNum, x, y);
                    currentCell.className = "error";
                }
                else if (currentCell.disabled) {
                    currentCell.className = "clue";
                }
                else {
                    currentCell.className = "blank";
                }
            }
            this.inputNumber(currentNum, x, y);
        })
    }

    // updates the data with input and then checks if an error is made, or if the sudoku is completed.
    updateData() {
        forXAndY(8, (x, y) => {
            this.inputNumber(parseInt(document.getElementById(`${x}, ${y}`).value), x, y);
        });

        if (this.isSolved()) {
            this.stopTimer();
            setTitle(`Congratulations!`);
        }
        this.updateOptions();
    }

    // checks whether the sudoku is completed
    isSolved() {
        this.checkForErrors();
        return this.rows.every(this.checkForSolution) &&
            this.columns.every(this.checkForSolution) &&
            this.regions.every(arr => arr.every(this.checkForSolution))
    }

    // checks if the sum of a row, column or region is 45
    checkForSolution(arr) {
        return arr.reduce((prev, curr) => prev + curr) === 45;
    }
}

const sudoku = new Sudoku();
