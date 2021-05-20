'use strict'

const MINE = '💣';
const START = '😀';
const DEAD = '🤯';
const WIN = '😎';
const FLAG = '🚩'
const HINT = '💡'


var gIsGameOn = false;
var gIsGameOver = false;
var gSize = 4;
var gMines = 2;
// var gIsHintOn = false;
var gTimerintervalId;
var gLives;
var gElLives = document.querySelector('.lives h1 span');

var gBoard;

function initGame() {
    document.querySelector('.face').innerText = START;
    gElLives.innerText = '❤❤❤';
    gLives = 3;
    gBoard = creatMat(gSize)
    renderBoard(gBoard);
}

function creatMat(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isMine: false,
                value: 0,
                isFlagged: false,
                isRevealed: false
            };
        }
    }
    return board;
}


// insert mines at random. 
// updating only the model.
function insertMines(locations, gMines) {
    for (var i = 0; i < gMines; i++) {
        var rndmIdx = getRandomInt(0, locations.length);
        var rndmLocation = locations.splice(rndmIdx, 1);
        gBoard[rndmLocation[0].i][rndmLocation[0].j].isMine = true;
    }


}
// going though the mat looking for mines
// when found, sending the coords to the neiborsloop "addValue()" to
// add value to the cell object depending on how many nies are nearby;
function checkIfmineAndAddValue(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++)
            if (board[i][j].isMine) {
                addValue(i, j, board);
            }
    }
    return board;
}

// neiborsloop;
function addValue(coordI, coordJ, board) {
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === coordI && j === coordJ) continue;
            if (!board[i][j].isMine) board[i][j].value++;
        }
    }
}

// rendering the game board, using "data" to differ between the coords of each cell
// used at gameStart function only.

function renderBoard(board) {
    var elBoard = document.querySelector('.board')
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isRevealed) {
                strHtml += `<td  oncontextmenu="flag(this)" onclick="clicked(this)" data-coords="${i}-${j}" ></td>`;
            }
        }
        strHtml += '</tr>'
    }
    elBoard.innerHTML = strHtml;
}

// after the first cell is pressed, the function will be used once
// to update the model excluding the first cell pressed to containe a mine.

function startGame(i, j) {
    gIsGameOn = true;
    startTimer()

    var locations = getLocations(gBoard, i, j)
    insertMines(locations, gMines);
    checkIfmineAndAddValue(gBoard);

}

// gets the chosen cell element, using its data to get its coords
// main game function for rendering each cell.

function clicked(elCell) {    
    if (gIsGameOver) return;
    if (isVictory()) return;

    var dataCoords = elCell.dataset.coords;
    var coord = extractCoords(dataCoords);

    if (!gIsGameOn) startGame(coord.i, coord.j); // on first click.


    // after the first click.

    // model update.
    var cell = gBoard[coord.i][coord.j];


    if (cell.isFlagged) return;
    cell.isRevealed = true;
   
    
    // dom update. (render cell)
    if (cell.isMine) {
        elCell.innerText = MINE;
        elCell.style.backgroundColor = 'red';
        gameOver();
    } else if (cell.value > 0) {
        elCell.innerText = cell.value;
        if (cell.value === 1) elCell.style.color = 'green'
        if (cell.value === 2) elCell.style.color = 'blue'
        if (cell.value === 3) elCell.style.color = 'red'
        if (cell.value === 4) elCell.style.color = 'brown'
        if (cell.value > 4) elCell.style.color = 'black'
        elCell.style.backgroundColor = 'lightYellow';
    } else {
        elCell.innerText = '';
        elCell.style.backgroundColor = 'lightYellow';
    }
    isVictory();
}
    //checking if there are any lives left.
    //if not game over!
function gameOver() {

    gLives--

    if(gLives === 2)  gElLives.innerText = '❤❤';
    if(gLives === 1)  gElLives.innerText = '❤';
    if(gLives === 0)  gElLives.innerText = '';  
        
    if(gLives)return;

    clearInterval(gTimerintervalId)
    gIsGameOver = true;    
    document.querySelector('.face').innerText = DEAD
}

function restart() {
    clearInterval(gTimerintervalId)
    gIsGameOver = false;
    gIsGameOn = false;
    initGame()
}

function isVictory() {
    var counter = 0;
    var size = gSize;
    var mines = gMines;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isRevealed && !gBoard[i][j].isMine) counter++
        }
    }
    if (counter === (size ** 2 - mines)) {
        document.querySelector('.face').innerText = WIN

        clearInterval(gTimerintervalId);
        return true
    }
}

function flag(elCell) {
    var dataCoords = elCell.dataset.coords;
    var coord = extractCoords(dataCoords);
    var cell = gBoard[coord.i][coord.j];
    console.log(cell);
    if (cell.isRevealed) return;
    if (cell.isFlagged) {
        cell.isFlagged = false;
        elCell.innerText = '';
    } else {
        cell.isFlagged = true;
        elCell.innerText = FLAG;
    }
}

function easy() {
    gSize = 4;
    gMines = 2;
    gIsGameOn = false;
    initGame();
}
function normal() {
    gSize = 8;
    gMines = 12;
    gIsGameOn = false;
    initGame();
}
function hard() {
    gSize = 12;
    gMines = 30;
    gIsGameOn = false;
    initGame();
}

function startTimer(){
    var secs = 0;
    var mins = 0;
    var elTimer = document.querySelector('.timer h2')

    gTimerintervalId = setInterval(function(){
        secs++
        if (secs === 60){
            secs = 0
            mins++
        } 
        if (secs < 10) elTimer.innerText = `0${mins} : 0${secs}`;
        if (secs >= 10) elTimer.innerText = `0${mins} : ${secs}`;

    }, 1000)
}

