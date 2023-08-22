import {ChessBoard, Piece, Pawn, Empty, Rook, Bishop, Queen, King, Knight, Move, Game, Player} from "./classes.js";

document.addEventListener("DOMContentLoaded", () => {
    let white = new Player('player1', 'white');
    let black = new Player('player2', 'black');
    let game = new Game(white, black, 'multiplayer');
    game.startGame(white);
});

document.addEventListener("DOMContentLoaded", (event)=> {
    var canvas = document.getElementById('myCanvas');
    var ctx=canvas.getContext('2d');
    
    window.onload = function() {
    
        // ChessBoard.arr(ctx, 10, 10, 100, 100, 10, 'red');
        // ChessBoard.arr(ctx, 100, 10, 140, 140, 3, 'black');
    }
});

// document.getElementById('flipBoardButton').addEventListener('click', () => {
//     chessBoard.flipBoard(chessBoard.board);  
// });