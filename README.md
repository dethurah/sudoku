# sudoku
A simple sudoku game. Tested on Chrome.

<h2>Get started</h2>

Install latest <a href="https://nodejs.org/en/">Node</a>.

Download a local copy of the sudoku app.

In terminal, navigate to the app folder and install dependencies:

<code>npm install</code>

Run app.js in Node:

<code>node app.js</code>

Open localhost:3000 in Chrome and enjoy!

<h2>Features</h2>

<ul>
  <li>Generates unique sudoku puzzles (server-side) on easy, normal, hard and expert difficulty.</li>
  <li>Detects and shows when you make an error.</li>
  <li>Cell numbers are color coded: Clues are black, input is blue, errors are red.</li>
  <li>Displays game timer.</li>
  <li>Option to input "pencil marks". Enable pencil mark mode with hotkey: space.</li>
  <li>Erase a number or pencil mark by pressing the same number again.</li>
  <li>Automatically erases pencil marks that conflict with an inputted number in the same row, column and region.
  <li>Navigate the sudoku with up/down/left/right-arrows. Navigate outside the borders to end up on opposite side.</li>
  <li>Option to undo/redo.</li>
  <li>Option to view highscores and submit your name and time/highscore when a puzzle is completed.</li>
  <li>When submitting, your board is validated by the server. Time is also calculated server-side.</li>
</ul>

<h2>Development</h2>

For testing the result of finishing a sudoku, change line 7 of app.js to:

<code>var boards = require('./testBoards.js');</code>

Then start a game on "easy" to get a sudoku with only one cell blank.

In case you want to erase highscores, you'll have to do it manually in highscores.json.

To do list of improvements:
<ul>
  <li>still needs refactoring and clean up.</li>
  <li>better variable/function names.</li>
  <li>better file names.</li>
  <li>new feature: option to pause game (and hide sudoku while paused).</li>
  <li>new feature: auto pause game when viewing highscores.</li>
  <li>new feature: Login with Facebook to add highscores and view personal or global highscores.</li>
  <li>better html and cleaner css code.</li>
  <li>bug fix: if your press ctrl-Z in a cell with pencil markings, a big number may return in the cell while the markings remain.</li>
  <li>Instead of displaying different div's in index.html, maybe send html-content to a single content div.</li>
  <li>Maybe split code into more modules to be loaded in app.js</li>
  <li>Make app compatible with other browsers.</li>
  <li>Add more template sudoku boards in boards.js to improve diversity of boards.</li>
</ul>
