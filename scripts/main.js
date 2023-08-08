import {ChessBoard, Piece, Pawn, Empty, Rook, Bishop, Queen, King, Knight} from "./classes.js";

let chessBoard = new ChessBoard();

document.addEventListener("DOMContentLoaded", () => {
    chessBoard.createChessBoard(chessBoard.board,chessBoard.color);
    // chessBoard.arrowCoords();

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

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

let r = 4;
let c = 3;
let br = 4;
let bc = 1;
let whiteRook = new Rook('white', [r,c]);  // Example for white pawn at e4
let blackPawn = new Pawn('black', [br,bc]); // Example for white pawn at e4

chessBoard.board[r][c] = whiteRook;

chessBoard.board[br][bc] = blackPawn;



// let moves = whiteRook.getMoves(chessBoard.board);

// console.log(chessBoard.board);
// console.log(moves); 
