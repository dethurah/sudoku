module.exports = difficulty => {
    
    function forXAndY(length, callback) {
        for (let y = 0; y <= length; y++) {
            for (let x = 0; x <= length; x++) {
                callback(x, y);
            }
        }
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

        let board = shuffle(difficulty)[0];
        
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

    return shuffleBoard(assignNumbers(chooseBoard(difficulty)));
}