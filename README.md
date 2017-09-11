# sudoku
A simple sudoku game. Tested on Chrome.

<h1>Get started</h1>

Install latest <a href="https://nodejs.org/en/">Node</a>.

Download a local copy of the sudoku app.

In terminal, navigate to the app folder and nstall dependencies:

<code>npm install</code>

Run app.js in Node:

<code>node app.js</code>

Open localhost:3000 in Chrome and enjoy!

<h1>Development</h1>

For testing the result of finishing a sudoku, change line 7 of app.js to:

<code>var boards = require('./testBoards.js');</code>

Start a game on "easy" to get a sudoku with only one cell blank.

To do list of improvements:
<ul>
  <li>a big clean up.</li>
  <li>better variable/function names.</li>
  <li>better file names.</li>
  <li>new feature: option to input small numbers in cells.</li>
  <li>new feature: option to pause game (and hide sudoku while paused).</li>
  <li>new feature: auto pause game when viewing highscores.</li>
  <li>better html and cleaner css code.</li>
  <li>Instead of displaying different div's in index.html, maybe send html-content to a single content div.</li>
  <li>Maybe split code into more modules to be loaded in app.js</li>
  <li>Make app compatible with other browsers.</li>
  <li>Add more template sudoku boards in boards.js to improve diversity of boards.</li>
</ul>
