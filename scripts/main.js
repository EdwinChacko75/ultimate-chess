function removeBoard() {
    document.getElementById("board").innerHTML = "";
}
function pxToVw(px) {
    return (100 * px) / document.documentElement.clientWidth;
}
function createChessBoard(color) {
    removeBoard();
    
    columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    peices = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

    if(color == "black"){
        columns.reverse();
        rows.reverse();
        peices.reverse();
        color = 'b';
    }
    else{
        color = 'w';
    }
    //Create the board
    for (var i = 1; i < 9; i++) {
        document.getElementById("board").innerHTML += '<div>';
        for (var j = 1; j < 9; j++) { 
            if (color == 'b') {
                var squareColor = (i + j) % 2 == 0 ? "light" : "dark" ;
                if (i == 8 && j == 1) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="peices" src="../img/chesspieces/wikipedia/' + color +'R.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '<p class="column">' + columns[j-1] + '</p></li>';
                }
                else if (j == 1) {
                    if (i == 1){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="peices" src="../img/chesspieces/wikipedia/wR.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else if (i == 7){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/bP.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else if (i == 2){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/wP.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else {
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img  class="pieces"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                }
                else if (i == 1) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/w' + peices[j - 1] + '.png"></li>';
                }
                else if (i == 2) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/wP.png"></li>';
                }
                else if (i == 7) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/bP.png"></li>';
                }
                else if (i == 8) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/b' + peices[j - 1] + '.png"><p class="column"' + squareColor +'">' + columns[j - 1] + '</p></li>';
                }
                else {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' empty"><img class="pieces"></li>';
                }
            }
            else {           
                var squareColor = (i + j) % 2 == 0 ? "light" : "dark";
                if (i == 8 && j == 1) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/' + color +'R.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '<p class="column">' + columns[j-1] + '</p></li>';
                }
                else if (j == 1) {
                    if (i == 1){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/bR.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else if (i == 7){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/wP.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else if (i == 2){
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/bP.png"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                    else {
                        document.getElementById("board").innerHTML += 
                        '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" ><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
                    }
                }
                else if (i == 1) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/b' + peices[j - 1] + '.png"></li>';
                }
                else if (i == 2) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/bP.png"></li>';
                }
                else if (i == 7) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/wP.png"></li>';
                }
                else if (i == 8) {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' occupied"><img class="pieces" src="../img/chesspieces/wikipedia/w' + peices[j - 1] + '.png"><p class="column"' + squareColor +'">' + columns[j - 1] + '</p></li>';
                }
                else {
                    document.getElementById("board").innerHTML += 
                    '<li id="' + columns[j - 1] + rows[i - 1]  + '" class="square ' + squareColor + ' empty"><img class="pieces"></li>';
                }
            }
        }
        document.getElementById("board").innerHTML += '</div>';
    }

    // highlight squares on click
    var squares = document.querySelectorAll('.square');

    squares.forEach(square => {
        square.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            if (event.target.classList.contains('highlighted')) {
                event.target.classList.remove('highlighted'); 
            }
            else {
                event.target.classList.add('highlighted');
            }
        });
    });
    var pieces = document.querySelectorAll('.pieces');
    pieces.forEach(piece => {
        piece.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            var square = event.target.parentNode; 
            if (square.classList.contains('highlighted')) {
                square.classList.remove('highlighted');
            }
            else {
                square.classList.add('highlighted');
            }
        });
    });
    // remove highlights on click
    squares.forEach(square => {
        square.addEventListener('click', function(event) {
            squares.forEach(square => {
                square.classList.remove('highlighted'); 
            });
        });
    });
    pieces.forEach(piece => {
        piece.addEventListener('click', function(event) {
            squares.forEach(square => {
                square.classList.remove('highlighted'); 
            });
        });
    });

    // draw arrows from a to b
    
}

function getCoords(res) {
    console.log(res);
}
function arrowCoords() {
    console.log("Function arrowCoords called!"); // This will let us know the function is executed.

    var squares = document.querySelectorAll('.square');
    var pieces = document.querySelectorAll('.pieces');

    let startSquare = null;

    squares.forEach(square => {
        square.addEventListener('mousedown', function(event) {
            let res = [];
            if (event.button === 2) {
                startSquare = event.target.id;
                console.log("Start Square (square):", startSquare); // To see the captured start square
            }
        });
    });

    pieces.forEach(piece => {
        piece.addEventListener('mousedown', function(event) {
            let res = [];
            if (event.button === 2) {
                startSquare = event.target.parentNode.id;
                res.push(startSquare);

                console.log("Start Square (piece):", startSquare); // To see the captured start square
            }
        });
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            let endSquare = null;
            if (event.target.classList.contains('square')) {
                endSquare = event.target.id;
            } else if (event.target.classList.contains('pieces')) {
                endSquare = event.target.parentNode.id;
            }
            if (endSquare) {
                res.push(endSquare);
                getCoords(res);
                console.log("End Square:", endSquare); // To see the captured end square
            }
            startSquare = null;
        }
    });
    return res;
}


document.addEventListener("DOMContentLoaded", createChessBoard);

document.addEventListener("DOMContentLoaded", arrowCoords);


