import {ChessBoard, Piece, Pawn, Empty} from "./classes.js";

let chessBoard = new ChessBoard();

document.addEventListener("DOMContentLoaded", () => {
    chessBoard.createChessBoard(chessBoard.board,chessBoard.color);
    chessBoard.arrowCoords();

});

document.addEventListener("DOMContentLoaded", (event)=> {
    var canvas = document.getElementById('myCanvas');
    var ctx=canvas.getContext('2d');
    
    window.onload = function() {
    
        ChessBoard.arr(ctx, 10, 10, 100, 100, 10, 'red');
        ChessBoard.arr(ctx, 100, 10, 140, 140, 3, 'black');
    }
});

document.getElementById('flipBoardButton').addEventListener('click', () => {
    chessBoard.flipBoard('black');  
});



let r = 4;
let c = 3;
let br = 4;
let bc = 2;
let whitePawn = new Pawn('white', [r,c]);  // Example for white pawn at e4
 let blackPawn = new Pawn('black', [br,bc]); // Example for white pawn at e4

chessBoard.board[r][c] = whitePawn;

chessBoard.board[br][bc] = blackPawn;



let moves = blackPawn.getMoves(chessBoard.board);

console.log(moves); 
console.log(chessBoard.board);
 