'use strict'

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


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive 
}


// using split function to make an object containing i & j coords
// from the cell element data
function extractCoords(data) {
    var coords = data.split('-');
    var coord = {
        i: +coords[0],
        j: +coords[1]
    }
    return coord;
}

// makes an array of objects containing i & j coords
// excluding one location as an argument.
function getLocations(board, coordI, coordJ) {
    var locations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++)
            if (i === coordI && j === coordJ) continue;
            else locations.push({ i, j });
    }
    return locations;
}

